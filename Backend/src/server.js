import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';

dotenv.config();

const app = express();
app.use(cors({ origin: '*'}));
app.use(express.json());

app.get('/', (req,res)=> res.send('Leaderboard API running'));
app.use('/api/users', userRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  // send initial leaderboard
  sendLeaderboard();
});

async function sendLeaderboard() {
  const users = await User.find().sort({ totalPoints: -1, updatedAt: 1 });
  io.emit('leaderboard', users.map((u, idx) => ({
    _id: u._id,
    name: u.name,
    totalPoints: u.totalPoints,
    rank: idx + 1
  })));
}

// Hook into claim route by monkey patching response - simpler than event emitter for brevity
app.post('/api/users/:userId/claim', async (req, res, next) => {
  // allow controller to run first via routes file already registered
  next();
}, async (req, res) => {
  await sendLeaderboard();
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://nimimuguciaz9241:5EF7JqqWUJ3TGZ27@cluster0.idxvp9d.mongodb.net/leaderboard?retryWrites=true&w=majority&appName=Cluster0';

// Guard: mongodb+srv URIs must NOT include an explicit port number
if (MONGO_URI.startsWith('mongodb+srv://')) {
  const hostPart = MONGO_URI.replace('mongodb+srv://','').split('/')[0]; // user:pass@host
  const afterAt = hostPart.split('@').pop();
  if(/:\d+/.test(afterAt)) {
    console.error('\nInvalid MONGO_URI: mongodb+srv style connection strings cannot include a port. Remove ":<port>".');
    process.exit(1);
  }
}

const PORT = process.env.PORT || 4000;

connectDB(MONGO_URI).then(() => {
  server.listen(PORT, () => console.log('Server listening on', PORT));
});

export { io, sendLeaderboard };
