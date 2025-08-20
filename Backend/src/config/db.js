import mongoose from 'mongoose';

// Connect using provided env variable (MONGO_URI / MONGODB_URI) with sensible defaults.
const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGO_URI / MONGODB_URI environment variable');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, {
      // useNewUrlParser / useUnifiedTopology kept for clarity (harmless on Mongoose 7+)
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'leaderboard'
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Mongo connection error', error);
    process.exit(1);
  }
};

export default connectDB;
