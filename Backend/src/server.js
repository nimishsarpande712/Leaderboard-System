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
// ---- CORS CONFIG ----
// Accept origins from:
//  1. CLIENT_ORIGIN (single primary prod frontend)
//  2. ALLOWED_ORIGINS (comma separated list)
//  3. Always include local dev hosts (localhost:5173 + 127.0.0.1:5173)
// Trailing slashes are stripped because Access-Control-Allow-Origin must be an origin, not a URL with '/'.
function normalizeOrigin(o){
  if(!o || typeof o !== 'string') return null;
  let v = o.trim();
  if(v.endsWith('/')) v = v.slice(0,-1);
  return v || null;
}
const defaults = ['http://localhost:5173','http://127.0.0.1:5173'];
const primary = normalizeOrigin(process.env.CLIENT_ORIGIN || 'https://leaderboard-system-1-1j3g.onrender.com');
const extraList = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(normalizeOrigin)
  .filter(Boolean);
const allowedOrigins = Array.from(new Set([primary, ...extraList, ...defaults]));
const allowAll = /^true$/i.test(process.env.CORS_ALLOW_ALL || '');
app.use(cors({
  origin: function(origin, cb){
    if(allowAll){ return cb(null, origin || true); }
    if(!origin || allowedOrigins.includes(origin)) return cb(null, origin || true);
    return cb(new Error('CORS blocked for origin: '+origin));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 204
}));
app.options('*', cors({
  origin: (origin, cb)=>{
    if(allowAll){ return cb(null, origin || true); }
    if(!origin || allowedOrigins.includes(origin)) return cb(null, origin || true);
    return cb(new Error('CORS blocked for origin: '+origin));
  },
  credentials:true
}));
console.log('🔐 CORS allowed origins:', allowAll ? '[ALL ORIGINS - DEV]' : allowedOrigins);
app.use(express.json());

app.get('/', (req,res)=> res.send('Leaderboard API running'));
app.get('/health', (_req,res)=> res.json({ ok:true }));
app.use('/api/users', userRoutes);
// Simple alias for sanity (optional): /api/leaderboard
app.get('/api/leaderboard', async (_req,res)=>{
  const users = await User.find().sort({ totalPoints:-1, updatedAt:1 });
  res.json(users.map((u,i)=> ({ _id:u._id, name:u.name, totalPoints:u.totalPoints, rank:i+1 })));
});

const server = http.createServer(app);
// Socket.IO: mirror same allowed origins list; it will reflect exact strings (no trailing slashes)
const io = new Server(server, { cors: { origin: allowedOrigins, methods:['GET','POST'] } });

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

// Utility: seed default users if DB empty (only runs once on cold start)
async function autoSeedIfEmpty() {
  const count = await User.countDocuments();
  if (count === 0) {
    const names = ['Rahul','Kamal','Sanak','Pooja','Rita','Ali','John','Meera','Vikas','Sara'];
    await User.insertMany(names.map(name => ({ name })));
    console.log(`🌱 Auto-seeded ${names.length} users (empty database).`);
    await sendLeaderboard();
  }
}

const PORT = process.env.PORT || 4000; // Render supplies PORT

const MONGO_URI = (process.env.MONGO_URI || process.env.MONGODB_URI || '').trim();
if(!MONGO_URI){
  console.error('❌ No MONGO_URI (or MONGODB_URI) provided in environment. Create .env with MONGO_URI=...');
  process.exit(1);
}

(async () => {
  try {
    await connectDB(MONGO_URI);
    await autoSeedIfEmpty();

    // Watch for user updates (points changes) and broadcast debounced leaderboard
    try {
      let debounceTimer = null;
      const trigger = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => { sendLeaderboard(); }, 120);
      };
      const changeStream = User.watch([], { fullDocument: 'updateLookup' });
      changeStream.on('change', (event) => {
        if (event.operationType === 'insert' || event.operationType === 'update' || event.operationType === 'replace') {
          trigger();
        }
      });
      console.log('👀 Change stream established for User collection');
    } catch (csErr) {
      console.warn('Change stream not active (likely not a replica set / free tier issue):', csErr.message);
    }

    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('Startup aborted – DB connection failed.');
    process.exit(1);
  }
})();

export { io, sendLeaderboard };
