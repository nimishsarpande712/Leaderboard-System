import mongoose from 'mongoose';

export async function connectDB(uri) {
  try {
    await mongoose.connect(uri, { dbName: 'leaderboard' });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Mongo connection error', err);
    process.exit(1);
  }
}
