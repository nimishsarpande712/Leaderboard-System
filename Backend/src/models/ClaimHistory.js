import mongoose from 'mongoose';

const claimHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    points: { type: Number, required: true, min: 1, max: 10 }
  },
  { timestamps: true }
);

export const ClaimHistory = mongoose.model('ClaimHistory', claimHistorySchema);
