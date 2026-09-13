import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  tokens: number;
  role: string;
  redeemedCodes?: string[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
    sparse: true,
    index: true,
  },
  avatar: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  tokens: {
    type: Number,
    default: 0, // Starts with 0 tokens - purchase starting at ₹19 to create & publish
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  redeemedCodes: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model overwrite compile issues in Next.js HMR:
if (mongoose.models && (mongoose.models as any).User) {
  delete (mongoose.models as any).User;
}

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
