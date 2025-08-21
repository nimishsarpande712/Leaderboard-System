import mongoose from 'mongoose';

/**
 * Connect to MongoDB with diagnostics & basic retry.
 * Uses MONGO_URI or MONGODB_URI. Accepts mongodb+srv and standard URIs.
 */
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

async function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function connectDB(uriParam, attempt = 1) {
  const envUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  const uri = (uriParam || envUri || '').trim();
  if (!uri) {
    console.error('❌ Missing MONGO_URI or MONGODB_URI env variable');
    throw new Error('Missing Mongo URI');
  }

  // Basic validation for mongodb+srv incorrect port usage
  if (uri.startsWith('mongodb+srv://')) {
    const hostPart = uri.replace('mongodb+srv://','').split('/')[0];
    const afterAt = hostPart.split('@').pop();
    if(/:\d+/.test(afterAt)) {
      throw new Error('mongodb+srv connection string must not include a port number. Remove it.');
    }
  }

  console.log(`🔌 Connecting to MongoDB (attempt ${attempt}) ...`);
  try {
    await mongoose.connect(uri, {
      dbName: 'leaderboard',
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10
    });
    console.log('✅ MongoDB connected');
    return mongoose.connection;
  } catch (err) {
    console.error(`❌ Mongo connection error (attempt ${attempt}):`, err.message);
    if (attempt < MAX_RETRIES) {
      console.log(`⟳ Retrying in ${RETRY_DELAY_MS/1000}s...`);
      await sleep(RETRY_DELAY_MS);
  return connectDB(uri, attempt + 1);
    }
    throw err;
  }
}

export default connectDB;
export { mongoose };
