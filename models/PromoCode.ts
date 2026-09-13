import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPromoCode extends Document {
  code: string;
  tokensGranted: number;
  maxUses: number; // 0 means unlimited
  usedCount: number;
  usedBy: Array<{
    userId: mongoose.Types.ObjectId;
    email: string;
    redeemedAt: Date;
  }>;
  isActive: boolean;
  expiresAt?: Date;
  createdBy?: string;
  createdAt: Date;
}

const PromoCodeSchema = new Schema<IPromoCode>({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true,
  },
  tokensGranted: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  maxUses: {
    type: Number,
    default: 0, // 0 = unlimited
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  usedBy: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    email: String,
    redeemedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
  },
  createdBy: {
    type: String,
    default: 'Admin',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model overwrite compile issues in Next.js HMR:
if (mongoose.models && (mongoose.models as any).PromoCode) {
  delete (mongoose.models as any).PromoCode;
}

const PromoCode: Model<IPromoCode> = mongoose.model<IPromoCode>('PromoCode', PromoCodeSchema);

export default PromoCode;
