import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IApology extends Document {
  slug: string;
  creatorName: string;
  recipientName: string;
  relationshipType: string;
  occasion: string; // birthday, apology, appreciation
  openedAt?: Date; // tracks when recipient first loaded link
  obsessions?: string;
  personality?: string;
  insideMoments?: string[];
  firstMemory?: string;
  smallNotices?: string;
  unspokenTruth?: string;
  vibeTheme?: string; // dreamy, cinematic, minimal, playful
  endingSurprise: {
    surpriseType: string; // scratch, polaroid, heartbeat
    surpriseData: any; // message, caption, or secret text
  };
  complimentStars?: {
    enabled: boolean;
    list: { title: string; text: string }[];
  };
  dateInvitation?: {
    enabled: boolean;
    dateType?: string;
    dateName?: string;
    dateDate?: string;
    nickname?: string;
    letterText?: string;
    response?: 'pending' | 'accepted' | 'declined';
  };
  favorites: {
    colorPalette: string[];
    moviesAndSeries: string[];
    insideJokes: string[];
  };
  aiGeneratedData: {
    headline: string;
    apologyNarrative: string;
    popCultureReferences: string[];
    themePreset: string;
    characterAttributes: {
      knownFor: string;
      acclaimedFor: string;
      rememberedFor: string;
    };
    memoriesList: string[];
    credits: {
      writer: string;
      cast: string[];
    };
  };
  status: string;
  passcode?: string;
  backgroundType?: string;
  customBackgroundUrl?: string;
  youtubeUrl?: string;
  songName?: string;
  websiteType?: 'personal' | 'wedding' | 'engagement' | 'birthday_party';
  weddingData?: {
    coupleNames?: string;
    invitationType?: string; // 'official' | 'save_the_date' | 'date_fixed' | 'engagement'
    weddingDate?: string;
    weddingTime?: string;
    venueName?: string;
    venueAddress?: string;
    venueMapsUrl?: string;
    hashtag?: string;
    itinerary?: Array<{
      title: string;
      date: string;
      time: string;
      desc?: string;
      icon?: string;
    }>;
    coupleImageUrl?: string;
    monogram?: string; // e.g. "A & S"
    hostNames?: string;
    groomBio?: string;
    brideBio?: string;
    guestRsvps?: Array<{
      name: string;
      attendance: string; // 'attending' | 'declined'
      headcount: number;
      message?: string;
      submittedAt: Date;
    }>;
  };
  birthdayPartyData?: {
    birthdayPersonName: string;
    ageMilestone?: string;
    eventTitle: string;
    hostNames: string;
    tagline?: string;
    partyDate: string;
    partyTime: string;
    venueName: string;
    venueAddress: string;
    venueMapsUrl?: string;
    dressCode?: string;
    specialNotes?: string;
    allowDjRequests?: boolean;
    itinerary?: Array<{
      title: string;
      time: string;
      desc?: string;
      icon?: string;
    }>;
    guestRsvps?: Array<{
      name: string;
      attendance: string; // 'attending' | 'declined'
      headcount: number;
      djSong?: string;
      message?: string;
      submittedAt: Date;
    }>;
  };
  proposalData?: {
    partnerName?: string;
    partnerNickname?: string;
    proposalType?: string; // 'marriage' | 'relationship' | 'forever' | 'valentine'
    proposalQuestion?: string;
    headline?: string;
    storyChapter1Title?: string;
    storyChapter1Text?: string;
    storyChapter2Title?: string;
    storyChapter2Text?: string;
    storyChapter3Title?: string;
    storyChapter3Text?: string;
    secretLoveNote?: string;
    celebrationDateTitle?: string;
    celebrationDateTime?: string;
    enableDodgeButton?: boolean;
    enablePromises?: boolean;
    promises?: Array<{ title: string; text: string }>;
    enableConstellation?: boolean;
    constellationNodes?: Array<{ title: string; subtitle: string; quote: string }>;
    enableLoveCoupons?: boolean;
    loveCoupons?: Array<{ badge: string; title: string; desc: string }>;
    enableReasonsWhy?: boolean;
    reasonsWhy?: Array<{ title: string; desc: string }>;
    enableWhispers?: boolean;
    whispers?: Array<{ title: string; preview: string; letter: string }>;
    enableBucketList?: boolean;
    bucketList?: Array<{ text: string }>;
    enableQuiz?: boolean;
    loveQuiz?: Array<{ q: string; options: string[]; celebration?: string }>;
    enableMemoryVault?: boolean;
    memoryKeepsakes?: Array<{ tag: string; title: string; desc: string }>;
    enableWishingWell?: boolean;
    responseStatus?: 'pending' | 'accepted' | 'declined';
    responseDate?: Date;
    responsePartnerNote?: string;
  };
  fontStyle?: string;
  creatorId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ApologySchema = new Schema<IApology>({
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  creatorName: {
    type: String,
    required: true,
  },
  recipientName: {
    type: String,
    required: true,
  },
  relationshipType: {
    type: String,
    default: 'Family & Friends',
  },
  occasion: {
    type: String,
    default: 'apology',
  },
  openedAt: {
    type: Date,
  },
  obsessions: {
    type: String,
  },
  personality: {
    type: String,
  },
  insideMoments: {
    type: [String],
    default: [],
  },
  firstMemory: {
    type: String,
  },
  smallNotices: {
    type: String,
  },
  unspokenTruth: {
    type: String,
  },
  vibeTheme: {
    type: String,
    default: 'dreamy',
  },
  endingSurprise: {
    surpriseType: { type: String, default: 'scratch' },
    surpriseData: { type: Schema.Types.Mixed, default: {} },
  },
  complimentStars: {
    enabled: { type: Boolean, default: false },
    list: {
      type: [{ title: String, text: String }],
      default: []
    }
  },
  dateInvitation: {
    enabled: { type: Boolean, default: false },
    dateType: { type: String },
    dateName: { type: String },
    dateDate: { type: String },
    nickname: { type: String },
    letterText: { type: String },
    response: { type: String, default: 'pending' },
  },
  favorites: {
    colorPalette: { type: [String], default: [] },
    moviesAndSeries: { type: [String], default: [] },
    insideJokes: { type: [String], default: [] },
  },
  aiGeneratedData: {
    headline: { type: String, required: true },
    apologyNarrative: { type: String, required: true },
    popCultureReferences: { type: [String], default: [] },
    themePreset: { type: String, required: true },
    characterAttributes: {
      knownFor: { type: String, default: "" },
      acclaimedFor: { type: String, default: "" },
      rememberedFor: { type: String, default: "" },
    },
    memoriesList: { type: [String], default: [] },
    credits: {
      writer: { type: String, default: 'Gemini AI' },
      cast: { type: [String], default: [] },
    },
  },
  status: {
    type: String,
    default: 'sent',
  },
  passcode: {
    type: String,
    default: '',
  },
  backgroundType: {
    type: String,
    default: 'particles',
  },
  customBackgroundUrl: {
    type: String,
    default: '',
  },
  youtubeUrl: {
    type: String,
    default: '',
  },
  songName: {
    type: String,
    default: '',
  },
  fontStyle: {
    type: String,
    default: 'classic',
  },
  websiteType: {
    type: String,
    enum: ['personal', 'wedding', 'engagement', 'birthday_party', 'proposal'],
    default: 'personal',
  },
  weddingData: {
    type: Schema.Types.Mixed,
    default: undefined,
  },
  birthdayPartyData: {
    type: Schema.Types.Mixed,
    default: undefined,
  },
  proposalData: {
    type: Schema.Types.Mixed,
    default: undefined,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

if (mongoose.models && (mongoose.models as any).Apology) {
  delete (mongoose.models as any).Apology;
}

const Apology: Model<IApology> = mongoose.model<IApology>('Apology', ApologySchema);

export default Apology;
