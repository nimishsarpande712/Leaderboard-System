import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    totalPoints: { type: Number, default: 0, index: true }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
