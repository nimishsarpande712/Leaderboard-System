import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import connectDB from './config/db.js';
import { User } from './models/User.js';

dotenv.config();

const app = express();
// CORS: explicit frontend origin (Render) with optional override via CLIENT_ORIGIN env
const FRONTEND_ORIGIN = process.env.CLIENT_ORIGIN || 'https://leaderboard-system-1-1j3g.onrender.com';
app.use(cors({
  origin: FRONTEND_ORIGIN,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));
// Optional: handle preflight for all
app.options('*', cors({ origin: FRONTEND_ORIGIN, credentials:true }));
app.use(express.json());

app.get('/', (req,res)=> res.send('Leaderboard API running'));
app.get('/health', (_req,res)=> res.json({ ok:true }));
app.use('/api/users', userRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: FRONTEND_ORIGIN, methods:['GET','POST'] } });

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

const PORT = process.env.PORT || 4000; // Render supplies PORT

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

export { io, sendLeaderboard };
