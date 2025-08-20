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

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/leaderboard';

connectDB(MONGO_URI).then(() => {
  server.listen(PORT, () => console.log('Server listening on', PORT));
});

export { io, sendLeaderboard };
