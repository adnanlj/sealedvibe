import mongoose, { Schema, Document } from 'mongoose';

export interface IRateLimit extends Document {
  key: string;
  points: number;
  expireAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>(
  {
    key: { type: String, required: true, unique: true, index: true },
    points: { type: Number, required: true, default: 1 },
    expireAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

export default mongoose.models.RateLimit || mongoose.model<IRateLimit>('RateLimit', RateLimitSchema);
