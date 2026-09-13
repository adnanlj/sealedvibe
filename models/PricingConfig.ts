import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPricingConfig extends Document {
  packId: string;
  name: string;
  tokens: number;
  priceInr: number;
  originalPriceInr?: number;
  priceUsd: number;
  tagline: string;
  isPopular: boolean;
  updatedAt: Date;
}

const PricingConfigSchema = new Schema<IPricingConfig>({
  packId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  tokens: {
    type: Number,
    required: true,
  },
  priceInr: {
    type: Number,
    required: true,
  },
  originalPriceInr: {
    type: Number,
    default: 0,
  },
  priceUsd: {
    type: Number,
    default: 0,
  },
  tagline: {
    type: String,
    default: '',
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

if (mongoose.models && (mongoose.models as any).PricingConfig) {
  delete (mongoose.models as any).PricingConfig;
}

const PricingConfig: Model<IPricingConfig> = mongoose.model<IPricingConfig>('PricingConfig', PricingConfigSchema);

export default PricingConfig;
