"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LandingPage from "@/components/LandingPage";
import AuthModal from "@/components/AuthModal";
import TokenStoreModal from "@/components/TokenStoreModal";
import {
  Heart,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Share2,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  Flame,
  Cake,
  Eye,
  User,
  Compass,
  Lock,
  Binary,
  Camera,
  Activity,
  Gift,
  Coins,
  Crown,
  User as UserIcon,
  Loader2,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  PartyPopper,
  Wine,
  Disc,
  QrCode
} from "lucide-react";
import QRCodeModal from "@/components/QRCodeModal";

interface WeddingEventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  desc?: string;
  icon?: string;
}

interface FormState {
  occasion: string; // apology, birthday, appreciation, birthday_party
  creatorName: string;
  recipientName: string;
  relationshipType: string;
  obsessions: string;
  favoriteColors: string;
  personality: string;
  moment1: string;
  moment2: string;
  moment3: string;
  firstMemory: string;
  smallNotices: string;
  reason: string;
  unspokenTruth: string;
  vibeTheme: string; // dreamy, cinematic, minimal, playful
  surpriseType: string; // scratch, polaroid, heartbeat, combo
  surpriseText: string; // secret message or caption
  polaroidCaption: string;
  polaroidImageQuery: string;
  complimentsEnabled: boolean;
  compliment1_title: string;
  compliment1_text: string;
  compliment2_title: string;
  compliment2_text: string;
  compliment3_title: string;
  compliment3_text: string;
  compliment4_title: string;
  compliment4_text: string;
  compliment5_title: string;
  compliment5_text: string;
  dateInvitationEnabled: boolean;
  dateType: string;
  dateName: string;
  dateDate: string;
  dateNickname: string;
  dateBanter: string;
  polaroidImageUrl: string;
  passcodeEnabled: boolean;
  passcode: string;
  backgroundType: string;
  customBackgroundUrl: string;
  youtubeUrl: string;
  songName: string;
  fontStyle: string;
  selectedColorPreset: string;
  websiteType?: "personal" | "wedding" | "engagement" | "birthday_party" | "proposal";
  weddingGroomName?: string;
  weddingBrideName?: string;
  weddingGroomBio?: string;
  weddingBrideBio?: string;
  weddingHashtag?: string;
  weddingEvent1Title?: string;
  weddingEvent1Date?: string;
  weddingEvent1Time?: string;
  weddingEvent2Title?: string;
  weddingEvent2Date?: string;
  weddingEvent2Time?: string;
  weddingEvent3Title?: string;
  weddingEvent3Date?: string;
  weddingEvent3Time?: string;
  weddingCoupleNames?: string;
  weddingInvitationType?: string;
  weddingDate?: string;
  weddingTime?: string;
  weddingVenueName?: string;
  weddingVenueAddress?: string;
  weddingVenueMapsUrl?: string;
  weddingHostNames?: string;
  weddingMonogram?: string;
  // Birthday Party fields
  partyPersonName?: string;
  partyAgeMilestone?: string;
  partyEventTitle?: string;
  partyHostNames?: string;
  partyTagline?: string;
  partyDate?: string;
  partyTime?: string;
  partyVenueName?: string;
  partyVenueAddress?: string;
  partyVenueMapsUrl?: string;
  partyDressCode?: string;
  partySpecialNotes?: string;
  partyAllowDjRequests?: boolean;
  // Romantic Proposal fields
  proposalPartnerName?: string;
  proposalPartnerNickname?: string;
  proposalType?: string;
  proposalQuestion?: string;
  proposalHeadline?: string;
  proposalStoryChapter1Title?: string;
  proposalStoryChapter1Text?: string;
  proposalStoryChapter2Title?: string;
  proposalStoryChapter2Text?: string;
  proposalStoryChapter3Title?: string;
  proposalStoryChapter3Text?: string;
  proposalSecretLoveNote?: string;
  proposalCelebrationDateTitle?: string;
  proposalCelebrationDateTime?: string;
  proposalEnableDodgeButton?: boolean;
  proposalEnablePromises?: boolean;
  proposalEnableConstellation?: boolean;
  proposalEnableLoveCoupons?: boolean;
  proposalEnableReasonsWhy?: boolean;
  proposalEnableWhispers?: boolean;
  proposalEnableBucketList?: boolean;
  proposalEnableQuiz?: boolean;
  proposalEnableMemoryVault?: boolean;
  proposalEnableWishingWell?: boolean;
}

const occasionOptions = [
  {
    value: "proposal",
    title: "Romantic Proposal & 'Will You Be Mine?'",
    desc: "Create a breathtaking twilight terrace garden proposal with starlight constellations, blooming pink roses, vintage 'For You ♡' love letter, interactive YES button & Certificate of Forever.",
    icon: Heart,
    color: "from-rose-500 via-pink-500 to-amber-400",
    emoji: "🌹",
  },
  {
    value: "wedding",
    title: "Wedding & Save-The-Date",
    desc: "Create a royal digital wedding invitation with wax seal opening, falling petals, event schedule, Google Maps & live guest RSVP tracking.",
    icon: Gift,
    color: "from-amber-500 to-yellow-600",
    emoji: "👑",
  },
  {
    value: "engagement",
    title: "Engagement & Ring Ceremony",
    desc: "Create an airy, botanical watercolor garden engagement invitation with wax seal opening, countdown & live guest RSVPs.",
    icon: Sparkles,
    color: "from-emerald-500 to-teal-600",
    emoji: "💍",
  },
  {
    value: "birthday_party",
    title: "Birthday Party Invitation",
    desc: "Create an elegant champagne ivory & pearl gold invitation with 3D metallic balloons, golden filigree framing, live countdown & live DJ song requests RSVP.",
    icon: PartyPopper,
    color: "from-amber-400 via-yellow-500 to-rose-400",
    emoji: "🎉",
  },
  {
    value: "apology",
    title: "Apology & Reconciliation",
    desc: "Create a beautiful, personalized website to say sorry, share memories, and ask to reconnect.",
    icon: Flame,
    color: "from-orange-500 to-red-600 font-orange",
    emoji: "🩹",
  },
  {
    value: "birthday",
    title: "Birthday Gift & Wishes",
    desc: "Create a heartfelt, personalized birthday gift website filled with floating balloons, music, and your favorite shared memories.",
    icon: Cake,
    color: "from-pink-500 to-purple-600",
    emoji: "🎂",
  },
  {
    value: "appreciation",
    title: "Gratitude & Appreciation",
    desc: "Say a heartfelt thank you and show them how much they mean to you with a beautiful personal page.",
    icon: Sparkles,
    color: "from-teal-500 to-indigo-600",
    emoji: "✨",
  },
  {
    value: "anniversary",
    title: "Anniversary Celebration",
    desc: "Celebrate your years together with a special timeline of your best memories and relationship milestones.",
    icon: Heart,
    color: "from-red-500 to-rose-600",
    emoji: "💖",
  },
];

const relationshipOptions = [
  { value: "partner", label: "Partner / Spouse" },
  { value: "best_friend", label: "Best Friend" },
  { value: "friend", label: "Friend" },
  { value: "sibling", label: "Sibling" },
  { value: "coworker", label: "Coworker" },
  { value: "other", label: "Other / Family" },
];

const vibeOptions = [
  { value: "dreamy", label: "Dreamy", desc: "Soft floating stardust & romantic fonts.", emoji: "🌌" },
  { value: "cinematic", label: "Cinematic", desc: "Dark mode, letterbox borders, retro monospace.", emoji: "🎬" },
  { value: "minimal", label: "Minimal", desc: "Grid coordinates, high contrast, clean structure.", emoji: "📐" },
  { value: "playful", label: "Playful", desc: "Bouncy bubble shapes & neon drop shadows.", emoji: "🎈" },
];

const surpriseOptions = [
  { value: "scratch", label: "Scratch Card", desc: "Interactive silver scratch foil reveal.", emoji: "🪙", icon: Sparkles },
  { value: "heartbeat", label: "Heartbeat Pulsator", desc: "Tap pulsating heart to unlock secret text.", emoji: "💓", icon: Heart },
];

const agentsList = [
  { id: "profiler", name: "The Profiler", activeText: "Calibrating emotional scale and relationship dynamics...", doneText: "Emotional tone successfully mapped." },
  { id: "curator", name: "The Curator", activeText: "Searching aesthetic templates, selecting colors, and mapping lights...", doneText: "Visual palette parameters resolved." },
  { id: "writer", name: "The Writer", activeText: "Drafting 3-act narrative script, weaving memories...", doneText: "Heartfelt custom narrative written." },
  { id: "assembler", name: "The Assembler", activeText: "Aligning WebGL particle simulations...", doneText: "3D canvas asset coordinates compiled." },
  { id: "keeper", name: "The Keeper", activeText: "Syncing database registry and setting slug headers...", doneText: "Your website is live and ready!" },
  { id: "deployer", name: "The Deployer", activeText: "Deploying interactive WebGL slides to edge network CDN...", doneText: "HTML static assets published to CDN." },
  { id: "publisher", name: "The Publisher", activeText: "Provisioning SSL certificate and binding slug URL...", doneText: "Custom sharing link compiled and online." }
];

function TerminalLogs() {
  const [logs, setLogs] = useState<string[]>([]);
  
  const logPool = [
    "[SYS.INFO] Initializing emotional recovery scan...",
    "[SYS.WARN] Subject hasn't replied in 3.5 hours. Checking active channels.",
    "[SYS.LOG] Subject has spent 3 hours analyzing 'no problem' message format.",
    "[SYS.CRITICAL] Eye-roll detected at 60fps. Adjusting apology narrative coordinates.",
    "[SYS.INFO] Calibrating level of sarcasm to 12% to prevent secondary argument.",
    "[SYS.LOG] Stitching custom visual layers & mapping stardust grids...",
    "[SYS.INFO] Shaders loaded: Midnight Blue / Clair de Lune",
    "[SYS.SUCCESS] Apology layout assembled successfully. Threat level reduced to Low.",
    "[SYS.LOG] Subject is ready to receive reconnection invitation payload."
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < logPool.length) {
        setLogs((prev) => [...prev, logPool[index]]);
        index++;
      } else {
        setLogs([]);
        index = 0;
      }
    }, 2500);
    
    setLogs([logPool[0]]);
    index = 1;

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto bg-black/85 border border-zinc-800 rounded-xl p-4 font-mono text-[11px] text-zinc-400 text-left space-y-1.5 shadow-2xl relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-purple-600/20" />
      <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-2 mb-2 text-zinc-500">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/25 animate-pulse" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/25" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/25" />
        <span className="ml-2 text-[9px] uppercase tracking-widest text-zinc-600 font-bold">sys.log // reconnect-protocol</span>
      </div>
      <div className="space-y-1.5 max-h-[140px] overflow-y-auto scrollbar-thin">
        {logs.map((log, idx) => {
          if (!log) return null;
          let color = "text-zinc-400";
          if (log.includes("WARN")) color = "text-amber-400";
          if (log.includes("CRITICAL")) color = "text-red-400 animate-pulse";
          if (log.includes("SUCCESS")) color = "text-emerald-400";
          if (log.includes("INFO")) color = "text-amber-400";
          
          return (
            <div key={idx} className={`${color} leading-relaxed`}>
              <span className="text-zinc-600 select-none mr-1.5">&gt;</span>
              {log}
            </div>
          );
        })}
        <div className="inline-block w-1.5 h-3 bg-purple-400/80 animate-pulse vertical-middle ml-1" />
      </div>
    </div>
  );
}

export default function OnboardingWizard() {
  const [step, setStep] = useState<number>(-1);
  const [weddingEvents, setWeddingEvents] = useState<WeddingEventItem[]>([]);
  const [partyTimeline, setPartyTimeline] = useState<WeddingEventItem[]>([]);

  const addWeddingEvent = (preset?: Partial<WeddingEventItem>) => {
    const newId = Date.now().toString();
    setWeddingEvents(prev => [
      {
        id: newId,
        title: preset?.title || "",
        date: preset?.date || "",
        time: preset?.time || "",
        desc: preset?.desc || "",
        icon: preset?.icon || "💍"
      },
      ...prev
    ]);
  };

  const removeWeddingEvent = (id: string) => {
    setWeddingEvents(prev => prev.filter(e => e.id !== id));
  };

  const updateWeddingEvent = (id: string, field: keyof WeddingEventItem, val: string) => {
    setWeddingEvents(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  const addPartyTimelineItem = (preset?: Partial<WeddingEventItem>) => {
    const newId = Date.now().toString();
    setPartyTimeline(prev => [
      ...prev,
      {
        id: newId,
        title: preset?.title || "",
        date: preset?.date || "",
        time: preset?.time || "",
        desc: preset?.desc || "",
        icon: preset?.icon || "✨"
      }
    ]);
  };

  const removePartyTimelineItem = (id: string) => {
    setPartyTimeline(prev => prev.filter(e => e.id !== id));
  };

  const updatePartyTimelineItem = (id: string, field: keyof WeddingEventItem, val: string) => {
    setPartyTimeline(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  // 🌹 Dynamic Proposal Keepsake Modules States (Creator can choose 1, 2, 3, or more items, or delete all)
  const [activeKeepsakeTab, setActiveKeepsakeTab] = useState<string>("promises");

  const [proposalPromises, setProposalPromises] = useState<Array<{ id: string; title: string; text: string }>>([
    { id: "1", title: "To Always Listen", text: "Even in comfortable silence, I promise to hear what your heart doesn't say out loud." },
    { id: "2", title: "To Stand Beside You in Every Storm", text: "Through sunny days and stormy nights, my hand will always be the one holding yours." },
    { id: "3", title: "To Make You Laugh on Heavy Days", text: "I promise to never let a single day go by without trying to bring out your radiant smile." },
    { id: "4", title: "To Support Your Wildest Dreams", text: "Whatever you aspire to conquer, I will be your greatest champion and biggest cheerleader." },
    { id: "5", title: "To Build Our Peaceful Sanctuary", text: "A home filled with warmth, endless cozy tea, laughter, and zero judgment." },
    { id: "6", title: "To Never Stop Choosing You", text: "Every morning when I open my eyes, I will choose you all over again, unconditionally." },
    { id: "7", title: "To Love You Beyond Words", text: "More today than yesterday, but never as much as tomorrow. Forever and always." }
  ]);

  const [proposalLoveCoupons, setProposalLoveCoupons] = useState<Array<{ id: string; badge: string; title: string; desc: string }>>([
    { id: "1", badge: "Midnight Escape", title: "1x Stargazing & Hot Cocoa Night", desc: "Valid anytime. Blankets, acoustic melodies, and endless sky under the moon." },
    { id: "2", badge: "Comfort Pass", title: "1x Endless Warm Hug Whenever Needed", desc: "No questions asked. Just unconditional warmth, peace, and holding you close." },
    { id: "3", badge: "Royal Treatment", title: "1x Breakfast in Bed & Morning Coffee", desc: "Fresh coffee, warm pastries, and zero alarms. You get to stay cozy all morning." },
    { id: "4", badge: "Golden Ticket", title: "1x Win Any Silly Argument Pass", desc: "Play this card and I instantly surrender with a kiss and admit you were 100% right." },
    { id: "5", badge: "Spontaneous Vibe", title: "1x Unplanned Road Trip & Sunset Chase", desc: "Pack a mini bag, pick a playlist, and let's drive wherever the road takes us." },
    { id: "6", badge: "Candlelight Vibe", title: "1x Home-Cooked Candlelight Dinner", desc: "Your favorite dishes prepared with love, soft jazz playing, and candlelit roses." }
  ]);

  const [proposalReasonsWhy, setProposalReasonsWhy] = useState<Array<{ id: string; title: string; desc: string }>>([
    { id: "1", title: "Your Radiant Smile", desc: "The way your entire face lights up when you're genuinely happy—it's my favorite sight in the world." },
    { id: "2", title: "Our Quiet Comfort", desc: "How we can sit together for hours without saying a word, yet feel completely understood and at peace." },
    { id: "3", title: "Your Joyous Laugh", desc: "The sound of your spontaneous laughter that instantly turns my worst days into sunshine." },
    { id: "4", title: "Your Gentle Strength", desc: "The kindness and resilience with which you carry yourself and uplift everyone around you." },
    { id: "5", title: "Our Spontaneous Adventures", desc: "Whether it's a 2 AM drive or a simple grocery run, everything with you feels cinematic." },
    { id: "6", title: "The Way You Love", desc: "Selfless, pure, and deep. Being loved by you is the greatest privilege of my life." }
  ]);

  const [proposalWhispers, setProposalWhispers] = useState<Array<{ id: string; title: string; preview: string; letter: string }>>([
    { id: "1", title: "On Difficult Days", preview: "When the weight of the world feels heavy...", letter: "Remember that you never have to carry anything alone anymore. You have my hand to hold, my shoulder to lean on, and my heart completely devoted to shielding your peace. You are stronger than you know, and loved more than you can imagine." },
    { id: "2", title: "The Moment I Knew", preview: "The exact day everything clicked...", letter: "It wasn't during a grand fireworks moment. It was when we were just talking, smiling over something silly, and I looked at you and thought: 'I want this person in every single chapter of my life.' There was no turning back." },
    { id: "3", title: "Our 50-Year Vision", preview: "Growing old and grey together...", letter: "I picture us decades from now, sitting on a porch with cups of tea, still laughing at our private inside jokes, our hands wrinkled but still interlocked with the exact same warmth as today." },
    { id: "4", title: "Why I Choose You", preview: "Every morning when I wake up...", letter: "Because you make the ordinary feel extraordinary. You inspire me to be kinder, dream bigger, and love without hesitation. Choosing you is the easiest, most natural decision my heart has ever made." }
  ]);

  const [proposalBucketList, setProposalBucketList] = useState<Array<{ id: string; text: string }>>([
    { id: "1", text: "Watch the Northern Lights wrapped together in one thick wool blanket" },
    { id: "2", text: "Slow dance barefoot in the warm summer rain with our favorite song playing" },
    { id: "3", text: "Build a cozy haven filled with books, warm amber lighting, and potted plants" },
    { id: "4", text: "Take a scenic mountain cabin road trip and watch the sunrise over misty peaks" },
    { id: "5", text: "Cook a complex gourmet recipe together and laugh when we make a total mess" },
    { id: "6", text: "Grow old together and still look at each other with stars in our eyes" }
  ]);

  const [proposalQuiz, setProposalQuiz] = useState<Array<{ id: string; q: string; options: string[]; celebration: string }>>([
    {
      id: "1",
      q: "What makes our connection feel so rare and unforgettable?",
      options: [
        "The way we can communicate with just a single glance",
        "How comfortable and safe we feel in each other's presence",
        "Our endless laughter and shared silly inside jokes",
        "All of the above, and a million things more ♡"
      ],
      celebration: "Exactly! Every single piece of our story is pure magic! ✨"
    },
    {
      id: "2",
      q: "Where is our ultimate dream romantic getaway?",
      options: [
        "A starlit terrace overlooking misty mountains with lanterns",
        "A private cozy wooden cabin deep in the pines",
        "A serene beach at golden hour listening to waves",
        "Anywhere in the world, as long as we are together 💖"
      ],
      celebration: "You know it! Home is wherever we are together. 🌹"
    },
    {
      id: "3",
      q: "How long will I love and cherish you?",
      options: [
        "For a thousand years",
        "Through all our tomorrows",
        "Past infinity and beyond the stars",
        "Forever and in every single lifetime 💍"
      ],
      celebration: "Forever and always. My heart has made its eternal choice! 💖"
    }
  ]);

  const [proposalConstellation, setProposalConstellation] = useState<Array<{ id: string; title: string; subtitle: string; quote: string }>>([
    { id: "1", title: "The First Spark", subtitle: "Where our paths aligned", quote: "Among billions of people on this planet, our orbits crossed in the most breathtaking way." },
    { id: "2", title: "The Midnight Laughter", subtitle: "Unfiltered joy under stars", quote: "Conversations that lasted until 3 AM, where time simply lost all meaning." },
    { id: "3", title: "The Quiet Sanctuary", subtitle: "Home in each other's eyes", quote: "Realizing that home isn't a place on a map—it's wherever you are standing." },
    { id: "4", title: "The Unspoken Bond", subtitle: "Understanding without words", quote: "One glance across a crowded room, and everything becomes clear." },
    { id: "5", title: "The Eternal Orbit", subtitle: "Forever by your side", quote: "Written in the constellations long before we even knew each other's names." }
  ]);

  const [proposalMemoryVault, setProposalMemoryVault] = useState<Array<{ id: string; tag: string; title: string; desc: string }>>([
    { id: "1", tag: "Day One", title: "The First Smile", desc: "When an ordinary day turned into the beginning of our forever story." },
    { id: "2", tag: "Late Nights", title: "Midnight Talks", desc: "Talking about everything and nothing until the sunrise painted the sky." },
    { id: "3", tag: "The Rainy Drive", title: "Shared Dreams", desc: "Wipers swishing, music humming, and realizing I never want anyone else." },
    { id: "4", tag: "Quiet Glances", title: "The Moment I Knew", desc: "Looking at you across the room and quietly thanking the stars for your existence." }
  ]);

  const [form, setForm] = useState<FormState>({
    occasion: "apology",
    creatorName: "",
    recipientName: "",
    relationshipType: "partner",
    obsessions: "",
    favoriteColors: "",
    personality: "",
    moment1: "",
    moment2: "",
    moment3: "",
    firstMemory: "",
    smallNotices: "",
    reason: "",
    unspokenTruth: "",
    vibeTheme: "dreamy",
    surpriseType: "scratch",
    surpriseText: "",
    polaroidCaption: "",
    polaroidImageQuery: "scenery",
    complimentsEnabled: false,
    compliment1_title: "",
    compliment1_text: "",
    compliment2_title: "",
    compliment2_text: "",
    compliment3_title: "",
    compliment3_text: "",
    compliment4_title: "",
    compliment4_text: "",
    compliment5_title: "",
    compliment5_text: "",
    dateInvitationEnabled: false,
    weddingGroomName: "",
    weddingBrideName: "",
    weddingCoupleNames: "",
    weddingMonogram: "",
    weddingHashtag: "",
    weddingHostNames: "",
    weddingDate: "",
    weddingTime: "",
    weddingVenueName: "",
    weddingVenueAddress: "",
    weddingVenueMapsUrl: "",
    weddingEvent1Title: "",
    weddingEvent1Date: "",
    weddingEvent1Time: "",
    weddingEvent2Title: "",
    weddingEvent2Date: "",
    weddingEvent2Time: "",
    weddingEvent3Title: "",
    weddingEvent3Date: "",
    weddingEvent3Time: "",
    // Birthday party fields
    partyPersonName: "",
    partyAgeMilestone: "",
    partyEventTitle: "",
    partyHostNames: "",
    partyTagline: "",
    partyDate: "",
    partyTime: "",
    partyVenueName: "",
    partyVenueAddress: "",
    partyVenueMapsUrl: "",
    partyDressCode: "",
    partySpecialNotes: "",
    partyAllowDjRequests: true,
    // Romantic Proposal fields
    proposalPartnerName: "",
    proposalPartnerNickname: "",
    proposalType: "marriage",
    proposalQuestion: "Will you marry me and make me the happiest person in the universe? 💍",
    proposalHeadline: "",
    proposalStoryChapter1Title: "Chapter I: The Spark",
    proposalStoryChapter1Text: "",
    proposalStoryChapter2Title: "Chapter II: The Moments That Built Us",
    proposalStoryChapter2Text: "",
    proposalStoryChapter3Title: "Chapter III: The Vow of Forever",
    proposalStoryChapter3Text: "",
    proposalSecretLoveNote: "",
    proposalCelebrationDateTitle: "Our Special Celebration Moment 🥂",
    proposalCelebrationDateTime: "",
    proposalEnableDodgeButton: true,
    proposalEnablePromises: true,
    proposalEnableConstellation: true,
    proposalEnableLoveCoupons: true,
    proposalEnableReasonsWhy: true,
    proposalEnableWhispers: true,
    proposalEnableBucketList: true,
    proposalEnableMemoryVault: true,
    dateType: "movie",
    dateName: "",
    dateDate: "",
    dateNickname: "",
    dateBanter: "",
    polaroidImageUrl: "",
    passcodeEnabled: false,
    passcode: "",
    backgroundType: "particles",
    customBackgroundUrl: "",
    youtubeUrl: "",
    songName: "",
    fontStyle: "classic",
    selectedColorPreset: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [activeAgentIdx, setActiveAgentIdx] = useState<number>(-1);
  const [completedAgents, setCompletedAgents] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [magicLink, setMagicLink] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [draftAiData, setDraftAiData] = useState<any>(null);
  const [isReviewingDraft, setIsReviewingDraft] = useState<boolean>(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState<boolean>(false);

  const [unsplashPhotos, setUnsplashPhotos] = useState<any[]>([]);
  const [isSearchingUnsplash, setIsSearchingUnsplash] = useState(false);
  const [unsplashError, setUnsplashError] = useState<string | null>(null);
  const [fanbasePreviewUrl, setFanbasePreviewUrl] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showTokenStore, setShowTokenStore] = useState<boolean>(false);
  const [showSuccessQrModal, setShowSuccessQrModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("sealedvibe_user");
        return cached ? JSON.parse(cached) : null;
      } catch (e) {}
    }
    return null;
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"submit" | "draft" | null>(null);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      try { localStorage.removeItem("sealedvibe_user"); } catch (e) {}
      setUserMenuOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Check auth session on load & sync state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.loggedIn && data.user) {
            setCurrentUser(data.user);
            try { localStorage.setItem("sealedvibe_user", JSON.stringify(data.user)); } catch (e) {}
          } else {
            setCurrentUser(null);
            try { localStorage.removeItem("sealedvibe_user"); } catch (e) {}
          }
        }
      } catch (e) {
        console.error('Session check failed:', e);
      }
    };
    checkAuth();
  }, []);

  // Dynamic preview fetch for fanbase autopilot backdrop
  useEffect(() => {
    if (form.backgroundType !== "fanbase") return;
    const query = form.obsessions || "scenery";
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search-unsplash?query=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.photos && data.photos.length > 0) {
            setFanbasePreviewUrl(data.photos[0].url);
          } else {
            setFanbasePreviewUrl(null);
          }
        }
      } catch (err) {
        console.error("Failed to fetch fanbase preview image:", err);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [form.backgroundType, form.obsessions]);

  const handleUnsplashSearch = async (queryStr: string) => {
    if (!queryStr.trim()) return;
    setIsSearchingUnsplash(true);
    setUnsplashError(null);
    try {
      const res = await fetch(`/api/search-unsplash?query=${encodeURIComponent(queryStr)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to search images");
      }
      setUnsplashPhotos(data.photos || []);
      if (data.photos && data.photos.length > 0 && !form.polaroidImageUrl) {
        updateForm("polaroidImageUrl", data.photos[0].url);
      }
    } catch (err: any) {
      setUnsplashError(err.message || "Failed to search images");
    } finally {
      setIsSearchingUnsplash(false);
    }
  };

  useEffect(() => {
    if (step === 15 && (form.surpriseType === "polaroid" || form.surpriseType === "combo") && unsplashPhotos.length === 0) {
      handleUnsplashSearch(form.polaroidImageQuery || "scenery");
    }
  }, [step, form.surpriseType]);

  const updateForm = (key: keyof FormState, val: any) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const getRecommendedBackground = (): string => {
    if (form.selectedColorPreset) {
      return form.selectedColorPreset;
    }
    const colors = (form.favoriteColors || "").toLowerCase();
    const occasion = (form.occasion || "").toLowerCase();

    // 1. Exact preset name/value matching
    if (colors.includes("sakura pink") || colors.includes("pastel lavender") || colors.includes("cherry")) {
      return "sakura";
    }
    if (colors.includes("ocean rain") || colors.includes("sky blue") || colors.includes("ocean indigo") || colors.includes("raindrop")) {
      return "raindrops";
    }
    if (colors.includes("marigold yellow") || colors.includes("warm amber") || colors.includes("lantern")) {
      if (occasion === "apology" || occasion === "reconciliation") return "candlelight";
      return "lanterns";
    }
    if (colors.includes("stardust silver") || colors.includes("cosmic purple")) {
      return "particles";
    }
    if (colors.includes("flicker amber") || colors.includes("flame gold") || colors.includes("candlelight")) {
      return "candlelight";
    }
    if (colors.includes("forest green") || colors.includes("neon mint") || colors.includes("firefly")) {
      return "fireflies";
    }
    if (colors.includes("celestial") || colors.includes("star silver") || colors.includes("starry")) {
      return "constellations";
    }
    if (colors.includes("aurora skies") || colors.includes("northern lights") || colors.includes("aurora green")) {
      return "aurora";
    }

    // 2. Generic color keyword checking
    if (colors.includes("pink") || colors.includes("rose") || colors.includes("lavender") || colors.includes("blossom") || colors.includes("sakura")) {
      return "sakura";
    }
    if (colors.includes("blue") || colors.includes("cyan") || colors.includes("teal") || colors.includes("aqua") || colors.includes("rain") || colors.includes("water") || colors.includes("sky")) {
      if (colors.includes("night") || colors.includes("star") || colors.includes("dark sky")) {
        return "constellations";
      }
      return "raindrops";
    }
    if (colors.includes("yellow") || colors.includes("gold") || colors.includes("orange") || colors.includes("amber") || colors.includes("marigold") || colors.includes("flicker") || colors.includes("candle")) {
      if (occasion === "apology" || occasion === "reconciliation") return "candlelight";
      return "lanterns";
    }
    if (colors.includes("green") || colors.includes("emerald") || colors.includes("mint") || colors.includes("lime") || colors.includes("forest") || colors.includes("firefly")) {
      return "fireflies";
    }
    if (colors.includes("space") || colors.includes("star") || colors.includes("constellation") || colors.includes("galaxy") || colors.includes("cosmos")) {
      return "constellations";
    }
    if (colors.includes("purple") || colors.includes("violet") || colors.includes("magenta") || colors.includes("aurora") || colors.includes("neon")) {
      return "aurora";
    }

    if (colors.includes("red") || colors.includes("crimson") || colors.includes("scarlet") || colors.includes("ruby") || colors.includes("flame") || colors.includes("fire")) {
      return "candlelight";
    }

    // 3. Fallbacks based on occasion
    if (occasion === "apology") {
      return "raindrops";
    }
    if (occasion === "birthday") {
      return "lanterns";
    }
    return "particles";
  };

  const getRecommendationExplanation = (): string => {
    const bg = getRecommendedBackground();
    const occasion = form.occasion || "apology";
    
    let occasionStr = "relationship mending";
    if (occasion === "birthday") occasionStr = "birthday celebration";
    if (occasion === "appreciation") occasionStr = "gratitude card";
    if (occasion === "anniversary") occasionStr = "anniversary card";

    switch (bg) {
      case "sakura":
        return `We suggest the Sakura Petals Drift backdrop! Its gentle drifting blossoms pair beautifully with your romantic styling to create a sweet, memorable atmosphere for this ${occasionStr}.`;
      case "raindrops":
        return `We suggest the Raindrops on Glass backdrop! The calming trickling raindrops slide down dynamically, establishing a heartfelt, reflective mood perfect for your message.`;
      case "lanterns":
        return `We suggest the Floating Lanterns backdrop! Drifting warm golden lanterns rise slowly, building a magical, warm celebratory feeling that fits this ${occasionStr} perfectly.`;
      case "particles":
        return `We suggest the Romantic Stardust backdrop! Glowing stardust particles float dynamically, adding a beautiful, modern WebGL sparkle effect to your custom card.`;
      case "candlelight":
        return `We suggest the Candlelight Glow backdrop! Pulsing warm golden embers and candle halos create a quiet, private, and deeply personal environment.`;
      case "fireflies":
        return `We suggest the Forest Fireflies backdrop! Shifting green fairy fireflies float around, creating a cozy, natural, and comforting visual experience.`;
      case "constellations":
        return `We suggest the Constellations Linker! Delicate drifting nodes link together in space, symbolizing connection, unity, and shared memories.`;
      case "aurora":
        return `We suggest the Cosmic Aurora backdrop! Smooth shifting colors flow dynamically, giving the presentation a premium, high-performance look.`;
      default:
        return "This visual backdrop matches your custom colors and occasion configuration beautifully.";
    }
  };

  const getPreviewPrimaryColor = (): string => {
    const colors = (form.favoriteColors || "").toLowerCase();
    if (colors.includes("pink") || colors.includes("rose") || colors.includes("sakura")) return "#ec4899";
    if (colors.includes("teal") || colors.includes("cyan") || colors.includes("blue") || colors.includes("aqua")) return "#06b6d4";
    if (colors.includes("yellow") || colors.includes("gold") || colors.includes("amber")) return "#f59e0b";
    if (colors.includes("green") || colors.includes("emerald") || colors.includes("mint") || colors.includes("lime")) return "#10b981";
    if (colors.includes("purple") || colors.includes("violet") || colors.includes("lavender") || colors.includes("nebula")) return "#a855f7";
    if (colors.includes("orange")) return "#f97316";
    if (colors.includes("red") || colors.includes("crimson")) return "#ef4444";
    return "#3b82f6"; // Default blue
  };

  const nextStep = () => {
    // Input validations per step
    if (step === 0 && !form.occasion) {
      setError("Please select an occasion.");
      return;
    }
    if (step === 0 && form.occasion === "proposal") {
      setError(null);
      setStep(401);
      return;
    }
    if (step === 401) {
      if (!form.creatorName?.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (!form.proposalPartnerName?.trim() && !form.recipientName?.trim()) {
        setError("Please enter your partner's name.");
        return;
      }
      setError(null);
      setStep(402);
      return;
    }
    if (step === 402) {
      if (!form.proposalStoryChapter1Text?.trim() || !form.proposalStoryChapter2Text?.trim() || !form.proposalStoryChapter3Text?.trim()) {
        setError("Please complete all 3 love story chapters.");
        return;
      }
      setError(null);
      setStep(403);
      return;
    }
    if (step === 403) {
      if (!form.proposalQuestion?.trim()) {
        setError("Please enter your proposal question.");
        return;
      }
      setError(null);
      setStep(404);
      return;
    }
    if (step === 404) {
      setError(null);
      setStep(405);
      return;
    }
    if (step === 0 && form.occasion === "wedding") {
      setError(null);
      setStep(101);
      return;
    }
    if (step === 0 && form.occasion === "engagement") {
      setError(null);
      setStep(201);
      return;
    }
    if (step === 0 && form.occasion === "birthday_party") {
      setError(null);
      setStep(301);
      return;
    }
    if (step === 301) {
      if (!form.partyPersonName?.trim()) {
        setError("Please enter the birthday star's name.");
        return;
      }
      if (!form.partyEventTitle?.trim()) {
        setError("Please enter the celebration event title (e.g. Adnan's 21st Midnight Rooftop Soirée ✨).");
        return;
      }
      if (!form.partyHostNames?.trim()) {
        setError("Please enter who is hosting or celebrating.");
        return;
      }
      setError(null);
      setStep(302);
      return;
    }
    if (step === 302) {
      if (!form.partyDate?.trim()) {
        setError("Please enter the party date.");
        return;
      }
      if (!form.partyTime?.trim()) {
        setError("Please enter the party start time (e.g. 8:00 PM).");
        return;
      }
      if (!form.partyVenueName?.trim()) {
        setError("Please enter the party lounge, club, or venue name.");
        return;
      }
      if (!form.partyVenueAddress?.trim()) {
        setError("Please enter the venue address.");
        return;
      }
      setError(null);
      setStep(303);
      return;
    }
    if (step === 303) {
      if (!form.partyDressCode?.trim()) {
        setError("Please enter the dress code for your guests.");
        return;
      }
      if (!form.partySpecialNotes?.trim()) {
        setError("Please enter the VIP notes / guest guidelines.");
        return;
      }
      setError(null);
      setStep(304);
      return;
    }
    if (step === 201) {
      if (!form.weddingGroomName?.trim() || !form.weddingBrideName?.trim()) {
        setError("Please enter both the Groom and Bride names.");
        return;
      }
      setError(null);
      setStep(202);
      return;
    }
    if (step === 202) {
      if (!form.weddingDate?.trim()) {
        setError("Please enter the engagement date.");
        return;
      }
      setError(null);
      setStep(203);
      return;
    }
    if (step === 203) {
      if (!form.weddingVenueName?.trim()) {
        setError("Please enter the celebration venue name.");
        return;
      }
      setError(null);
      setStep(204);
      return;
    }
    if (step === 101) {
      if (!form.weddingGroomName?.trim() || !form.weddingBrideName?.trim()) {
        setError("Please enter both the Groom and Bride names.");
        return;
      }
      if (!form.weddingMonogram?.trim()) {
        setError("Please enter the couple monogram initials (e.g. A & S).");
        return;
      }
      if (!form.weddingHashtag?.trim()) {
        setError("Please enter the wedding hashtag (e.g. #AdnanWedsSujan).");
        return;
      }
      if (!form.weddingHostNames?.trim()) {
        setError("Please enter the welcoming host / family names.");
        return;
      }
      setError(null);
      setStep(102);
      return;
    }
    if (step === 102) {
      if (!form.weddingDate?.trim()) {
        setError("Please select the wedding date.");
        return;
      }
      if (!form.weddingTime?.trim()) {
        setError("Please enter the main ceremony time (e.g. 7:00 PM).");
        return;
      }
      if (!form.weddingVenueName?.trim()) {
        setError("Please enter the palace or venue name.");
        return;
      }
      if (!form.weddingVenueAddress?.trim()) {
        setError("Please enter the full venue address.");
        return;
      }
      setError(null);
      setStep(103);
      return;
    }
    if (step === 103) {
      if (weddingEvents.length === 0) {
        setError("Please add at least one wedding function or ceremony.");
        return;
      }
      const missingFieldEvt = weddingEvents.find(
        (e) => !e.title.trim() || !e.date.trim() || !e.time.trim()
      );
      if (missingFieldEvt) {
        setError("Please provide an Event Title, Date, and Time for every added ceremony.");
        return;
      }
      setError(null);
      setStep(104);
      return;
    }
    if (step === 1 && (!form.creatorName.trim() || !form.recipientName.trim())) {
      setError("Please fill out both names to proceed.");
      return;
    }
    if (step === 3 && !form.obsessions.trim()) {
      setError("Please enter what they are obsessed with (e.g. Taylor Swift, space, Ghibli).");
      return;
    }
    if (step === 4 && !form.personality.trim()) {
      setError("Please describe their personality in one honest sentence.");
      return;
    }
    if (step === 5 && (!form.moment1.trim() || !form.moment2.trim() || !form.moment3.trim())) {
      setError("Please fill out all 3 inside moments or memories.");
      return;
    }
    if (step === 6 && !form.firstMemory.trim()) {
      setError("Please describe your first memory of them.");
      return;
    }
    if (step === 7 && !form.smallNotices.trim()) {
      setError("Please describe the small quirks or things you quietly notice.");
      return;
    }
    if (step === 8 && !form.reason.trim()) {
      setError("Please describe the context details / what you want to say.");
      return;
    }
    if (step === 9 && !form.unspokenTruth.trim()) {
      setError("Please share one thing you've never said directly to them.");
      return;
    }
    if (step === 12) {
      if (
        !form.compliment1_title.trim() || !form.compliment1_text.trim() ||
        !form.compliment2_title.trim() || !form.compliment2_text.trim() ||
        !form.compliment3_title.trim() || !form.compliment3_text.trim() ||
        !form.compliment4_title.trim() || !form.compliment4_text.trim() ||
        !form.compliment5_title.trim() || !form.compliment5_text.trim()
      ) {
        setError("Please fill out all 5 secret stardust compliments (titles and texts).");
        return;
      }
    }
    if (step === 13) {
      if (!form.favoriteColors.trim()) {
        setError("Please select a color preset or type your custom favorite colors.");
        return;
      }
    }
    if (step === 15) {
      if (form.surpriseType === "polaroid" || form.surpriseType === "combo") {
        if (!form.polaroidImageQuery.trim()) {
          setError("Please enter a search keyword for the Polaroid photo backdrop.");
          return;
        }
        if (!form.polaroidImageUrl) {
          setError("Please search Unsplash and select a photo to proceed.");
          return;
        }
      }
    }
    if (step === 16) {
      if (!form.dateNickname.trim()) {
        setError("Please enter their nickname or cute title.");
        return;
      }
      if (!form.dateName.trim()) {
        setError("Please enter the name or topic of the date.");
        return;
      }
      if (!form.dateDate.trim()) {
        setError("Please enter when this date should happen.");
        return;
      }
      if (!form.dateBanter.trim()) {
        setError("Please add a little detail or banter about the date.");
        return;
      }
    }
    if (step === 17) {
      if (form.passcodeEnabled && !form.passcode.trim()) {
        setError("Please enter a secure passcode or disable password protection.");
        return;
      }
    }

    setError(null);
    if (step === 11) {
      if (!form.complimentsEnabled) {
        const recommended = getRecommendedBackground();
        setForm((prev) => ({ ...prev, backgroundType: recommended }));
        setStep(13); // Skip to Aesthetic Design Studio
        return;
      }
    }
    if (step === 12) {
      const recommended = getRecommendedBackground();
      setForm((prev) => ({ ...prev, backgroundType: recommended }));
    }


    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError(null);
    if (step === 0) {
      resetForm(-1);
      return;
    }
    if (step === 401) {
      setStep(0);
      return;
    }
    if (step === 402) {
      setStep(401);
      return;
    }
    if (step === 403) {
      setStep(402);
      return;
    }
    if (step === 404) {
      setStep(403);
      return;
    }
    if (step === 405) {
      setStep(404);
      return;
    }
    if (step === 301) {
      setStep(0);
      return;
    }
    if (step === 302) {
      setStep(301);
      return;
    }
    if (step === 303) {
      setStep(302);
      return;
    }
    if (step === 304) {
      setStep(303);
      return;
    }
    if (step === 201) {
      setStep(0);
      return;
    }
    if (step === 202) {
      setStep(201);
      return;
    }
    if (step === 203) {
      setStep(202);
      return;
    }
    if (step === 204) {
      setStep(203);
      return;
    }
    if (step === 101) {
      setStep(0);
      return;
    }
    if (step === 102) {
      setStep(101);
      return;
    }
    if (step === 103) {
      setStep(102);
      return;
    }
    if (step === 104) {
      setStep(103);
      return;
    }
    if (step === 19) {
      setStep(18);
      return;
    }
    if (step === 18) {
      setStep(17);
      return;
    }
    if (step === 17) {
      if (form.dateInvitationEnabled) {
        setStep(16);
      } else {
        setStep(15);
      }
      return;
    }
    if (step === 16) {
      setStep(15);
      return;
    }
    if (step === 15) {
      setStep(14);
      return;
    }
    if (step === 13) {
      if (form.complimentsEnabled) {
        setStep(12);
      } else {
        setStep(11);
      }
      return;
    }
    setStep((prev) => prev - 1);
  };

  const handleCopy = async () => {
    if (magicLink) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(magicLink);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = magicLink;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  const resetForm = (targetStep: number = -1) => {
    setForm({
      occasion: "apology",
      creatorName: "",
      recipientName: "",
      relationshipType: "partner",
      obsessions: "",
      favoriteColors: "",
      personality: "",
      moment1: "",
      moment2: "",
      moment3: "",
      firstMemory: "",
      smallNotices: "",
      reason: "",
      unspokenTruth: "",
      vibeTheme: "dreamy",
      surpriseType: "scratch",
      surpriseText: "",
      polaroidCaption: "",
      polaroidImageQuery: "scenery",
      complimentsEnabled: false,
      compliment1_title: "",
      compliment1_text: "",
      compliment2_title: "",
      compliment2_text: "",
      compliment3_title: "",
      compliment3_text: "",
      compliment4_title: "",
      compliment4_text: "",
      compliment5_title: "",
      compliment5_text: "",
      dateInvitationEnabled: false,
      weddingGroomName: "",
      weddingBrideName: "",
      weddingGroomBio: "",
      weddingBrideBio: "",
      weddingCoupleNames: "",
      weddingMonogram: "",
      weddingHashtag: "",
      weddingHostNames: "",
      weddingDate: "",
      weddingTime: "",
      weddingVenueName: "",
      weddingVenueAddress: "",
      weddingVenueMapsUrl: "",
      weddingEvent1Title: "",
      weddingEvent1Date: "",
      weddingEvent1Time: "",
      weddingEvent2Title: "",
      weddingEvent2Date: "",
      weddingEvent2Time: "",
      weddingEvent3Title: "",
      weddingEvent3Date: "",
      weddingEvent3Time: "",
      // Birthday party fields
      partyPersonName: "",
      partyAgeMilestone: "",
      partyEventTitle: "",
      partyHostNames: "",
      partyTagline: "",
      partyDate: "",
      partyTime: "",
      partyVenueName: "",
      partyVenueAddress: "",
      partyVenueMapsUrl: "",
      partyDressCode: "",
      partySpecialNotes: "",
      partyAllowDjRequests: true,
      // Romantic Proposal fields
      proposalPartnerName: "",
      proposalPartnerNickname: "",
      proposalType: "marriage",
      proposalQuestion: "Will you marry me and make me the happiest person in the universe? 💍",
      proposalHeadline: "",
      proposalStoryChapter1Title: "Chapter I: The Spark",
      proposalStoryChapter1Text: "",
      proposalStoryChapter2Title: "Chapter II: The Moments That Built Us",
      proposalStoryChapter2Text: "",
      proposalStoryChapter3Title: "Chapter III: The Vow of Forever",
      proposalStoryChapter3Text: "",
      proposalSecretLoveNote: "",
      proposalCelebrationDateTitle: "Our Special Celebration Moment 🥂",
      proposalCelebrationDateTime: "",
      proposalEnableDodgeButton: true,
      proposalEnablePromises: true,
      proposalEnableConstellation: true,
      proposalEnableLoveCoupons: true,
      proposalEnableReasonsWhy: true,
      proposalEnableWhispers: true,
      proposalEnableBucketList: true,
      proposalEnableQuiz: true,
      proposalEnableMemoryVault: true,
      proposalEnableWishingWell: true,
      dateType: "movie",
      dateName: "",
      dateDate: "",
      dateNickname: "",
      dateBanter: "",
      polaroidImageUrl: "",
      passcodeEnabled: false,
      passcode: "",
      backgroundType: "particles",
      customBackgroundUrl: "",
      youtubeUrl: "",
      songName: "",
      fontStyle: "classic",
      selectedColorPreset: "",
    });
    setWeddingEvents([]);
    setPartyTimeline([]);
    setMagicLink(null);
    setDraftAiData(null);
    setIsReviewingDraft(false);
    setError(null);
    setStep(targetStep);
  };

  const validateForm = (activeForm: FormState) => {
    if (activeForm.dateInvitationEnabled) {
      if (!activeForm.dateNickname.trim()) return "Please enter their nickname or cute title.";
      if (!activeForm.dateName.trim()) return "Please enter the name or topic of the date.";
      if (!activeForm.dateDate.trim()) return "Please enter when this date should happen.";
      if (!activeForm.dateBanter.trim()) return "Please add a little detail or banter about the date.";
    }
    if (activeForm.surpriseType === "combo") {
      if (!activeForm.surpriseText.trim()) return "Please enter the final Scratch Card secret message.";
      if (!activeForm.polaroidCaption.trim()) return "Please enter the Polaroid handwritten caption.";
      if (!activeForm.polaroidImageQuery.trim()) return "Please enter a keyword for the Polaroid photo backdrop.";
    } else if (activeForm.surpriseType === "polaroid") {
      if (!activeForm.surpriseText.trim()) return "Please enter the Polaroid handwritten caption.";
      if (!activeForm.polaroidImageQuery.trim()) return "Please enter a keyword for the Polaroid photo backdrop.";
    } else {
      if (!activeForm.surpriseText.trim()) return "Please enter your secret message.";
    }
    return null;
  };

  const executeDraftGeneration = async () => {
    setError(null);
    setIsGeneratingDraft(true);
    setLoading(true);
    setActiveAgentIdx(0);

    const apiPromise = fetch("/api/generate-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to generate draft text.");
        }
        return data;
      });

    for (let i = 0; i < agentsList.length; i++) {
      setActiveAgentIdx(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const agent = agentsList[i];
      if (agent) {
        setCompletedAgents((prev) => ({ ...prev, [agent.id]: true }));
      }
    }

    try {
      const res = await apiPromise;
      setDraftAiData(res.aiData);
      setIsReviewingDraft(true);
      setStep(18);
    } catch (err: any) {
      setError(err.message || "Failed to generate draft text.");
    } finally {
      setLoading(false);
      setIsGeneratingDraft(false);
      setActiveAgentIdx(-1);
      setCompletedAgents({});
    }
  };

  const handleGenerateDraft = async () => {
    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Check if user is logged in & has tokens before calling AI
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (!meData.loggedIn || !meData.user) {
        setPendingAction("draft");
        setShowAuthModal(true);
        return;
      }
      setCurrentUser(meData.user);

      // Block AI API call if user has 0 tokens
      if ((meData.user.tokens ?? 0) < 1) {
        setError("You have 0 tokens. Please redeem a promo code or purchase a token pack to generate your website.");
        setShowTokenStore(true);
        return;
      }
    } catch (e) {
      setPendingAction("draft");
      setShowAuthModal(true);
      return;
    }

    await executeDraftGeneration();
  };

  const updateDraftField = (key: string, val: any) => {
    setDraftAiData((prev: any) => {
      if (!prev) return prev;
      const updated = { ...prev, [key]: val };
      if (key === "act1" || key === "act2" || key === "act3") {
        updated.apologyNarrative = `${updated.act1 || ""}[BREAK]${updated.act2 || ""}[BREAK]${updated.act3 || ""}`;
      }
      return updated;
    });
  };

  const updateDraftAttrField = (key: string, val: string) => {
    setDraftAiData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        characterAttributes: {
          ...prev.characterAttributes,
          [key]: val
        }
      };
    });
  };

  const executeFinalGeneration = async (activeForm: FormState) => {
    if (activeForm.occasion === "wedding") {
      setError(null);

      const groomName = activeForm.weddingGroomName?.trim();
      const brideName = activeForm.weddingBrideName?.trim();
      const monogram = activeForm.weddingMonogram?.trim();
      const hashtag = activeForm.weddingHashtag?.trim();
      const hostNames = activeForm.weddingHostNames?.trim();
      const weddingDate = activeForm.weddingDate?.trim();
      const weddingTime = activeForm.weddingTime?.trim();
      const venueName = activeForm.weddingVenueName?.trim();
      const venueAddress = activeForm.weddingVenueAddress?.trim();

      if (!groomName || !brideName) {
        setError("Please enter both the Groom and Bride names.");
        return;
      }
      if (!monogram) {
        setError("Please enter the couple monogram seal initials.");
        return;
      }
      if (!hashtag) {
        setError("Please enter the wedding hashtag.");
        return;
      }
      if (!hostNames) {
        setError("Please enter the welcoming host family names.");
        return;
      }
      if (!weddingDate) {
        setError("Please select the wedding date.");
        return;
      }
      if (!weddingTime) {
        setError("Please enter the ceremony time.");
        return;
      }
      if (!venueName) {
        setError("Please enter the venue name.");
        return;
      }
      if (!venueAddress) {
        setError("Please enter the venue address.");
        return;
      }
      const validEvents = weddingEvents.filter(
        (e) => e.title.trim() && e.date.trim() && e.time.trim()
      );
      if (validEvents.length === 0) {
        setError("Please add at least one wedding function or ceremony.");
        return;
      }

      setLoading(true);
      setActiveAgentIdx(0);
      try {
        const coupleNames = activeForm.weddingCoupleNames?.trim() || `${groomName} & ${brideName}`;
        const payload = {
          occasion: "wedding",
          websiteType: "wedding",
          creatorName: groomName,
          recipientName: brideName,
          relationshipType: "Family & Friends",
          vibeTheme: "dreamy",
          backgroundType: "particles",
          youtubeUrl: activeForm.youtubeUrl?.trim() || "",
          songName: activeForm.songName?.trim() || "",
          favorites: {
            colorPalette: ["#f59e0b", "#10b981", "#fbbf24"],
            moviesAndSeries: [],
            insideJokes: []
          },
          weddingData: {
            coupleNames: coupleNames,
            groomName: groomName,
            brideName: brideName,
            invitationType: "official",
            weddingDate: weddingDate,
            weddingTime: weddingTime,
            venueName: venueName,
            venueAddress: venueAddress,
            venueMapsUrl: activeForm.weddingVenueMapsUrl?.trim() || undefined,
            hostNames: hostNames,
            monogram: monogram,
            hashtag: hashtag,
            groomBio: activeForm.weddingGroomBio?.trim() || undefined,
            brideBio: activeForm.weddingBrideBio?.trim() || undefined,
            itinerary: validEvents.map((e) => ({
              title: e.title.trim(),
              date: e.date.trim(),
              time: e.time.trim(),
              desc: e.desc?.trim() || undefined,
              icon: e.icon || "💍"
            }))
          }
        };

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) {
          if (data.noTokens) {
            setShowTokenStore(true);
          }
          throw new Error(data.error || "Failed to generate wedding website.");
        }
        if (typeof data.remainingTokens === "number") {
          setCurrentUser((prev: any) => prev ? { ...prev, tokens: data.remainingTokens } : prev);
        }
        setMagicLink(`${window.location.origin}/p/${data.slug}`);
        setStep(19);
        return;
      } catch (err: any) {
        setError(err.message || "Failed to generate wedding website.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (activeForm.occasion === "engagement") {
      setError(null);
      setLoading(true);
      setActiveAgentIdx(0);
      try {
        const groomName = activeForm.weddingGroomName?.trim() || activeForm.creatorName || "Groom";
        const brideName = activeForm.weddingBrideName?.trim() || activeForm.recipientName || "Bride";
        const coupleNames = activeForm.weddingCoupleNames?.trim() || `${groomName} & ${brideName}`;
        const monogram = `${groomName.charAt(0) || "G"} & ${brideName.charAt(0) || "B"}`;

        const payload = {
          occasion: "engagement",
          websiteType: "engagement",
          creatorName: activeForm.creatorName || groomName,
          recipientName: coupleNames,
          relationshipType: "Family & Friends",
          vibeTheme: "dreamy",
          backgroundType: "particles",
          youtubeUrl: activeForm.youtubeUrl || "",
          songName: activeForm.songName || "Background Music",
          favorites: {
            colorPalette: ["#2d5a3c", "#556b2f", "#d4a373"],
            moviesAndSeries: [],
            insideJokes: []
          },
          weddingData: {
            coupleNames: coupleNames,
            groomName: groomName,
            brideName: brideName,
            invitationType: "engagement",
            weddingDate: activeForm.weddingDate || "2030-11-20",
            weddingTime: activeForm.weddingTime || "6:30 PM",
            venueName: activeForm.weddingVenueName || "The Botanical Meadow & Garden Lawn",
            venueAddress: activeForm.weddingVenueAddress || "Lakeview Promenade, Rosewood Greens, Grand Celebration Grounds",
            venueMapsUrl: activeForm.weddingVenueMapsUrl || `https://maps.google.com/?q=${encodeURIComponent((activeForm.weddingVenueName || "The Botanical Meadow") + " " + (activeForm.weddingVenueAddress || ""))}`,
            hostNames: activeForm.weddingHostNames || "Together with our families, cordially invite you to celebrate our engagement ceremony",
            hashtag: activeForm.weddingHashtag || `#${groomName.replace(/\s+/g, "")}${brideName.replace(/\s+/g, "")}Engagement`,
            monogram: monogram,
          }
        };

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) {
          if (data.noTokens) {
            setShowTokenStore(true);
          }
          throw new Error(data.error || "Failed to generate engagement website.");
        }
        if (typeof data.remainingTokens === "number") {
          setCurrentUser((prev: any) => prev ? { ...prev, tokens: data.remainingTokens } : prev);
        }
        setMagicLink(`${window.location.origin}/p/${data.slug}`);
        setStep(19);
        return;
      } catch (err: any) {
        setError(err.message || "Failed to generate engagement website.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (activeForm.occasion === "birthday_party") {
      setError(null);
      const personName = activeForm.partyPersonName?.trim();
      const eventTitle = activeForm.partyEventTitle?.trim();
      const hostNames = activeForm.partyHostNames?.trim();
      const partyDate = activeForm.partyDate?.trim();
      const partyTime = activeForm.partyTime?.trim();
      const venueName = activeForm.partyVenueName?.trim();
      const venueAddress = activeForm.partyVenueAddress?.trim();
      const dressCode = activeForm.partyDressCode?.trim();
      const specialNotes = activeForm.partySpecialNotes?.trim();

      if (!personName) {
        setError("Please enter the birthday star's name.");
        return;
      }
      if (!eventTitle) {
        setError("Please enter the celebration event title.");
        return;
      }
      if (!hostNames) {
        setError("Please enter who is hosting or celebrating.");
        return;
      }
      if (!partyDate) {
        setError("Please select the party date.");
        return;
      }
      if (!partyTime) {
        setError("Please enter the party start time.");
        return;
      }
      if (!venueName) {
        setError("Please enter the venue or lounge name.");
        return;
      }
      if (!venueAddress) {
        setError("Please enter the full venue address.");
        return;
      }
      if (!dressCode) {
        setError("Please enter the dress code for your guests.");
        return;
      }
      if (!specialNotes) {
        setError("Please enter the VIP notes / guest guidelines.");
        return;
      }

      setLoading(true);
      setActiveAgentIdx(0);
      try {
        const validTimeline = partyTimeline
          .filter(e => e.title.trim() && e.time.trim())
          .map(e => ({
            time: e.time.trim(),
            title: e.title.trim(),
            desc: e.desc?.trim() || undefined,
            icon: e.icon || "✨"
          }));

        const payload = {
          occasion: "birthday_party",
          websiteType: "birthday_party",
          creatorName: hostNames,
          recipientName: personName,
          relationshipType: "VIP Friends & Guests",
          vibeTheme: "cinematic",
          backgroundType: "particles",
          youtubeUrl: activeForm.youtubeUrl?.trim() || "",
          songName: activeForm.songName?.trim() || "",
          favorites: {
            colorPalette: ["#fbbf24", "#a855f7", "#ec4899"],
            moviesAndSeries: [],
            insideJokes: []
          },
          birthdayPartyData: {
            birthdayPersonName: personName,
            personName: personName,
            ageMilestone: activeForm.partyAgeMilestone?.trim() || undefined,
            eventTitle: eventTitle,
            hostNames: hostNames,
            tagline: activeForm.partyTagline?.trim() || undefined,
            partyDate: partyDate,
            partyTime: partyTime,
            venueName: venueName,
            venueAddress: venueAddress,
            venueMapsUrl: activeForm.partyVenueMapsUrl?.trim() || (venueName ? `https://maps.google.com/?q=${encodeURIComponent(venueName + " " + venueAddress)}` : undefined),
            dressCode: activeForm.partyDressCode?.trim() || undefined,
            specialNotes: activeForm.partySpecialNotes?.trim() || undefined,
            allowDjRequests: activeForm.partyAllowDjRequests ?? true,
            itinerary: validTimeline.length > 0 ? validTimeline : undefined,
            timeline: validTimeline.length > 0 ? validTimeline : undefined,
          }
        };

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) {
          if (data.noTokens) {
            setShowTokenStore(true);
          }
          throw new Error(data.error || "Failed to generate birthday party invitation website.");
        }
        if (typeof data.remainingTokens === "number") {
          setCurrentUser((prev: any) => prev ? { ...prev, tokens: data.remainingTokens } : prev);
        }
        setMagicLink(`${window.location.origin}/p/${data.slug}`);
        setStep(19);
        return;
      } catch (err: any) {
        setError(err.message || "Failed to generate birthday party invitation website.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (activeForm.occasion === "proposal") {
      setError(null);
      const partnerName = activeForm.proposalPartnerName?.trim() || activeForm.recipientName?.trim();
      const creatorName = activeForm.creatorName?.trim();
      const proposalQuestion = activeForm.proposalQuestion?.trim();
      const chapter1Text = activeForm.proposalStoryChapter1Text?.trim();
      const chapter2Text = activeForm.proposalStoryChapter2Text?.trim();
      const chapter3Text = activeForm.proposalStoryChapter3Text?.trim();

      if (!creatorName) {
        setError("Please enter your name.");
        return;
      }
      if (!partnerName) {
        setError("Please enter your partner's name.");
        return;
      }
      if (!proposalQuestion) {
        setError("Please enter your proposal question.");
        return;
      }
      if (!chapter1Text || !chapter2Text || !chapter3Text) {
        setError("Please complete all 3 love story chapters.");
        return;
      }

      setLoading(true);
      setActiveAgentIdx(0);
      try {
        const payload = {
          occasion: "proposal",
          websiteType: "proposal",
          creatorName: creatorName,
          recipientName: partnerName,
          relationshipType: "Partner",
          vibeTheme: "romantic",
          backgroundType: "particles",
          youtubeUrl: activeForm.youtubeUrl?.trim() || "",
          songName: activeForm.songName?.trim() || "Romantic Proposal Melody",
          favorites: {
            colorPalette: ["#f43f5e", "#fda4af", "#e11d48"],
            moviesAndSeries: [],
            insideJokes: []
          },
          proposalData: {
            partnerName: partnerName,
            partnerNickname: activeForm.proposalPartnerNickname?.trim() || undefined,
            proposalType: activeForm.proposalType || "marriage",
            proposalQuestion: proposalQuestion,
            headline: activeForm.proposalHeadline?.trim() || `For My Forever, ${partnerName} 🌹`,
            storyChapter1Title: activeForm.proposalStoryChapter1Title?.trim() || "Chapter I: The Day Everything Changed",
            storyChapter1Text: chapter1Text,
            storyChapter2Title: activeForm.proposalStoryChapter2Title?.trim() || "Chapter II: The Moments That Built Us",
            storyChapter2Text: chapter2Text,
            storyChapter3Title: activeForm.proposalStoryChapter3Title?.trim() || "Chapter III: The Vow of Forever",
            storyChapter3Text: chapter3Text,
            secretLoveNote: activeForm.proposalSecretLoveNote?.trim() || undefined,
            celebrationDateTitle: activeForm.proposalCelebrationDateTitle?.trim() || "Our Celebration Moment",
            celebrationDateTime: activeForm.proposalCelebrationDateTime?.trim() || undefined,
            enableDodgeButton: activeForm.proposalEnableDodgeButton ?? true,
            enablePromises: activeForm.proposalEnablePromises ?? true,
            promises: activeForm.proposalEnablePromises !== false
              ? proposalPromises.filter(p => p.title.trim() && p.text.trim()).map(({ title, text }) => ({ title, text }))
              : [],
            enableConstellation: activeForm.proposalEnableConstellation ?? true,
            constellationNodes: activeForm.proposalEnableConstellation !== false
              ? proposalConstellation.filter(c => c.title.trim() && c.quote.trim()).map(({ title, subtitle, quote }) => ({ title, subtitle, quote }))
              : [],
            enableLoveCoupons: activeForm.proposalEnableLoveCoupons ?? true,
            loveCoupons: activeForm.proposalEnableLoveCoupons !== false
              ? proposalLoveCoupons.filter(c => c.title.trim()).map(({ badge, title, desc }) => ({ badge, title, desc }))
              : [],
            enableReasonsWhy: activeForm.proposalEnableReasonsWhy ?? true,
            reasonsWhy: activeForm.proposalEnableReasonsWhy !== false
              ? proposalReasonsWhy.filter(r => r.title.trim()).map(({ title, desc }) => ({ title, desc }))
              : [],
            enableWhispers: activeForm.proposalEnableWhispers ?? true,
            whispers: activeForm.proposalEnableWhispers !== false
              ? proposalWhispers.filter(w => w.title.trim() || w.letter.trim()).map(({ title, preview, letter }) => ({ title, preview, letter }))
              : [],
            enableBucketList: activeForm.proposalEnableBucketList ?? true,
            bucketList: activeForm.proposalEnableBucketList !== false
              ? proposalBucketList.filter(b => b.text.trim()).map(({ text }) => ({ text }))
              : [],
            enableQuiz: activeForm.proposalEnableQuiz ?? true,
            loveQuiz: activeForm.proposalEnableQuiz !== false
              ? proposalQuiz.filter(q => q.q.trim()).map(({ q, options, celebration }) => ({ q, options, celebration }))
              : [],
            enableMemoryVault: activeForm.proposalEnableMemoryVault ?? true,
            memoryKeepsakes: activeForm.proposalEnableMemoryVault !== false
              ? proposalMemoryVault.filter(m => m.title.trim()).map(({ tag, title, desc }) => ({ tag, title, desc }))
              : [],
            enableWishingWell: activeForm.proposalEnableWishingWell ?? true,
            responseStatus: "pending"
          }
        };

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) {
          if (data.noTokens) {
            setShowTokenStore(true);
          }
          throw new Error(data.error || "Failed to generate romantic proposal website.");
        }
        if (typeof data.remainingTokens === "number") {
          setCurrentUser((prev: any) => prev ? { ...prev, tokens: data.remainingTokens } : prev);
        }
        setMagicLink(`${window.location.origin}/p/${data.slug}`);
        setStep(19);
        return;
      } catch (err: any) {
        setError(err.message || "Failed to generate romantic proposal website.");
      } finally {
        setLoading(false);
      }
      return;
    }

    const validationError = validateForm(activeForm);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);
    setActiveAgentIdx(0);

    let responseData: any = null;
    let apiError: string | null = null;

    const activeFormWithCustomBg = {
      ...activeForm,
      customBackgroundUrl: activeForm.backgroundType === "fanbase" && fanbasePreviewUrl
        ? fanbasePreviewUrl
        : activeForm.customBackgroundUrl,
      customAiData: draftAiData
    };

    const apiPromise = fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activeFormWithCustomBg),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to create your website link.");
        }
        return data;
      })
      .catch((err) => {
        apiError = err.message;
      });

    for (let i = 0; i < agentsList.length; i++) {
      setActiveAgentIdx(i);
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const agent = agentsList[i];
      if (agent) {
        setCompletedAgents((prev) => ({ ...prev, [agent.id]: true }));
      }
    }

    responseData = await apiPromise;

    if (apiError) {
      setError(apiError);
      setLoading(false);
      setActiveAgentIdx(-1);
      setCompletedAgents({});
      return;
    }

    if (responseData && responseData.slug) {
      if (typeof responseData.remainingTokens === "number") {
        setCurrentUser((prev: any) => prev ? { ...prev, tokens: responseData.remainingTokens } : prev);
      }
      const generatedUrl = `${window.location.origin}/p/${responseData.slug}`;
      setMagicLink(generatedUrl);
      setStep(19);
    }
    setLoading(false);
  };

  const handleSubmit = async (overrideForm?: FormState) => {
    const activeForm = overrideForm || form;

    // Check if user is logged in & has tokens
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!data.loggedIn || !data.user) {
        setCurrentUser(null);
        setPendingAction("submit");
        setShowAuthModal(true);
        return;
      }
      setCurrentUser(data.user);

      if ((data.user.tokens ?? 1) < 1) {
        setError("You have 0 tokens. Please redeem a promo code or purchase a token pack to generate your website.");
        setShowTokenStore(true);
        return;
      }
    } catch (e) {
      setPendingAction("submit");
      setShowAuthModal(true);
      return;
    }

    executeFinalGeneration(activeForm);
  };

  if (step === -1) {
    return <LandingPage onCreateClick={() => resetForm(0)} />;
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden selection:bg-purple-600/30 selection:text-blue-200 bg-[#050510] text-white bg-grid-pattern">
      {/* Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-950/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-950/15 blur-[120px] pointer-events-none" />

      {/* Fixed Sticky Universal Navbar in Wizard */}
      <header className="w-full px-3.5 sm:px-6 py-2.5 sm:py-4 z-30 sticky top-0 bg-[#050510]/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              type="button"
              onClick={() => resetForm(-1)} 
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-white text-xs font-bold transition-all shadow-sm group cursor-pointer"
              title="Return to Main Landing Page"
            >
              <ChevronLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>

            {/* Brand Logo - Returns to Main Landing Page */}
            <div 
              onClick={() => resetForm(-1)} 
              className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group"
              title="Return to Main Landing Page"
            >
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500/25 via-pink-500/20 to-purple-600/25 border border-amber-400/40 p-0.5 flex items-center justify-center shadow-xl shadow-amber-950/30 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-[10px] sm:rounded-[14px] bg-[#0c0a18] flex items-center justify-center">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400/20 transition-transform group-hover:scale-110" />
                </div>
                <span className="absolute -top-1 -right-1 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-amber-400 animate-ping" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-white to-pink-200 bg-clip-text text-transparent block font-serif">
                  SealedVibe
                </span>
                <span className="hidden sm:block text-[9px] uppercase tracking-[0.25em] text-slate-400 font-bold -mt-1">
                  Luxury Digital Keepsakes
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-3 relative">
            {currentUser ? (
              <>
                {/* Token Store Trigger */}
                <button
                  type="button"
                  onClick={() => setShowTokenStore(true)}
                  className="px-2 sm:px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 hover:border-amber-400 text-amber-300 font-mono font-bold text-[11px] sm:text-xs flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer shadow-sm"
                  title="Open Token Store & Redeem Promo Codes"
                >
                  <Coins className="w-3.5 h-3.5 text-amber-400" /> {currentUser.tokens ?? 0} <span className="hidden sm:inline">Token{(currentUser.tokens ?? 0) !== 1 ? 's' : ''}</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-sans font-black">+</span>
                </button>

                {/* User Account Dropdown Trigger */}
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="px-2 sm:px-3 py-1.5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/12 text-white uppercase tracking-wider text-[11px] sm:text-xs font-extrabold flex items-center gap-1 sm:gap-1.5 transition-all shadow-md cursor-pointer"
                    title="Account Menu"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-amber-400" /> 
                    <span className="hidden sm:inline">{currentUser.name?.split(" ")[0] || "Account"}</span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${userMenuOpen ? "rotate-180 text-amber-400" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        {/* Backdrop to dismiss */}
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setUserMenuOpen(false)} 
                        />

                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-zinc-950 border border-amber-500/30 shadow-2xl p-2 z-50 text-left space-y-1 backdrop-blur-2xl"
                          style={{
                            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.1)"
                          }}
                        >
                          {/* User Header Info */}
                          <div className="px-3 py-2 border-b border-white/10 space-y-0.5">
                            <span className="text-xs font-bold text-white block truncate">{currentUser.name}</span>
                            <span className="text-[10px] text-slate-400 block truncate">{currentUser.email}</span>
                          </div>

                          {/* Dashboard Link */}
                          <a
                            href="/dashboard"
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-400" />
                            <span>Dashboard & Keepsakes</span>
                          </a>

                          {/* Admin Portal (if admin) */}
                          {currentUser.isAdmin && (
                            <a
                              href="/admin"
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
                            >
                              <Crown className="w-4 h-4 text-amber-400" />
                              <span>Admin Portal</span>
                            </a>
                          )}

                          {/* Token Store Link */}
                          <button
                            type="button"
                            onClick={() => {
                              setUserMenuOpen(false);
                              setShowTokenStore(true);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 transition-all cursor-pointer text-left"
                          >
                            <span className="flex items-center gap-2">
                              <Coins className="w-4 h-4 text-amber-400" /> Token Balance
                            </span>
                            <span className="font-mono text-amber-300 font-bold bg-amber-500/20 px-1.5 py-0.2 rounded text-[10px]">
                              {currentUser.tokens ?? 1}
                            </span>
                          </button>

                          <div className="border-t border-white/10 pt-1" />

                          {/* 🚪 LOGOUT BUTTON */}
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all cursor-pointer text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out / Log Out</span>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <a
                  href="#pricing"
                  className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 text-xs font-bold transition-all shadow-sm"
                  title="View token packages and pricing"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> View Pricing
                </a>
                <a
                  href="/login"
                  className="text-xs text-slate-300 hover:text-white uppercase tracking-wider font-bold transition-colors px-1 sm:px-2"
                >
                  Log In
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Form Area */}
      <main className="flex-1 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8 z-10 w-full max-w-full overflow-x-hidden">
        {loading ? (
          <div 
            className="w-full max-w-2xl bg-white/[0.015] border border-white/5 backdrop-blur-[6px] rounded-[32px] p-6 sm:p-10 relative overflow-hidden"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(8px)",
              boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 25px 60px rgba(0, 0, 0, 0.5)"
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 animate-pulse" />
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-xl bg-blue-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
                  <Binary className="w-6 h-6 animate-pulse" />
                </div>
                <h2 className="text-2xl font-extrabold text-white">Patching Protocol</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Stitching layout layers and generating rich custom visual slide decks.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                {agentsList.map((agent, index) => {
                  const isActive = index === activeAgentIdx;
                  const isDone = completedAgents[agent.id];

                  return (
                    <div
                      key={agent.id}
                      className={`flex gap-4 p-3 rounded-xl border transition-all duration-300 ${
                        isActive
                          ? "bg-blue-600/10 border-amber-500/40 text-purple-200"
                          : isDone
                          ? "bg-white/5 border-white/5 text-slate-300 opacity-80"
                          : "border-transparent text-slate-600 opacity-40"
                      }`}
                    >
                      <div className="flex-shrink-0 flex items-center justify-center">
                        {isDone ? (
                          <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 text-xs">
                            ✓
                          </div>
                        ) : isActive ? (
                          <div className="w-5 h-5 rounded-full border border-blue-400 border-t-transparent animate-spin" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-white/5" />
                        )}
                      </div>

                      <div className="space-y-0.5 text-left">
                        <div className="text-xs font-bold uppercase tracking-wider">
                          Agent {index + 1}: {agent.name}
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          {isActive ? agent.activeText : isDone ? agent.doneText : "Awaiting activation..."}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            {step > 0 && step <= 17 && (() => {
              let totalQSteps = 15;
              if (form.complimentsEnabled) totalQSteps += 1;
              if (form.dateInvitationEnabled) totalQSteps += 1;

              let currentQStep = step;
              if (!form.complimentsEnabled && step > 11) {
                currentQStep -= 1;
              }
              if (!form.dateInvitationEnabled && step > 15) {
                currentQStep -= 1;
              }

              // Determine current stage for breadcrumb
              let currentStageName = "Occasion & Names";
              if (currentQStep >= 3 && currentQStep <= 7) currentStageName = "Memories & Connection";
              else if (currentQStep >= 8 && currentQStep <= 10) currentStageName = "Story & Message";
              else if (currentQStep >= 11 && currentQStep <= 14) currentStageName = "Vibe, Music & Stars";
              else if (currentQStep >= 15) currentStageName = "Surprise & Passcode";

              return (
                <div className="mb-6 max-w-xl mx-auto space-y-2">
                  <div className="flex justify-between items-center text-[11px] px-1 font-bold tracking-wider uppercase">
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {currentStageName}
                    </span>
                    <span className="text-amber-400 font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                      Step {currentQStep} of {totalQSteps}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                      style={{ width: `${(currentQStep / totalQSteps) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Wedding Wizard Progress Bar */}
            {step >= 101 && step <= 104 && (
              <div className="mb-6 max-w-xl mx-auto space-y-2">
                <div className="flex justify-between items-center text-[11px] px-1 font-bold tracking-wider uppercase">
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <Crown className="w-3.5 h-3.5 text-amber-400" /> Royal Wedding Studio
                  </span>
                  <span className="text-amber-400 font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                    Stage {step - 100} of 4
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                    style={{ width: `${((step - 100) / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Engagement Wizard Progress Bar */}
            {step >= 201 && step <= 204 && (
              <div className="mb-6 max-w-xl mx-auto space-y-2">
                <div className="flex justify-between items-center text-[11px] px-1 font-bold tracking-wider uppercase">
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Botanical Engagement Studio
                  </span>
                  <span className="text-emerald-400 font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                    Stage {step - 200} of 4
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    style={{ width: `${((step - 200) / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Birthday Party Progress Bar */}
            {step >= 301 && step <= 304 && (
              <div className="mb-6 max-w-xl mx-auto space-y-2">
                <div className="flex justify-between items-center text-[11px] px-1 font-bold tracking-wider uppercase">
                  <span className="flex items-center gap-1.5 text-fuchsia-300">
                    <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" /> VIP Birthday Party Studio
                  </span>
                  <span className="text-fuchsia-400 font-mono font-bold px-2 py-0.5 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/30">
                    Stage {step - 300} of 4
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(217,70,239,0.5)]"
                    style={{ width: `${((step - 300) / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Romantic Proposal Progress Bar */}
            {step >= 401 && step <= 404 && (
              <div className="mb-6 max-w-xl mx-auto space-y-2">
                <div className="flex justify-between items-center text-[11px] px-1 font-bold tracking-wider uppercase">
                  <span className="flex items-center gap-1.5 text-rose-300">
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" /> Romantic Proposal Studio
                  </span>
                  <span className="text-rose-400 font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30">
                    Stage {step - 400} of 4
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-rose-600 via-pink-500 to-amber-300 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(244,63,94,0.5)]"
                    style={{ width: `${((step - 400) / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div 
              className="bg-gradient-to-b from-[#100e1f]/95 via-[#0a0815]/95 to-black/95 border border-amber-500/25 backdrop-blur-2xl rounded-2xl sm:rounded-[36px] p-4 sm:p-8 md:p-10 relative overflow-hidden min-h-[380px] sm:min-h-[420px] flex flex-col justify-between shadow-2xl shadow-black/80"
              style={{
                boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 30px 80px rgba(0, 0, 0, 0.8)"
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />

              <AnimatePresence mode="wait">
                
                {/* 💍 WEDDING STEP 1: COUPLE & HOSTS */}
                {step === 101 && (
                  <motion.div
                    key="weddingStep1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                        💍 Wedding Wizard • Step 1 of 4
                      </div>
                      <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        The Couple & Welcoming Hosts 👑
                      </h2>
                      <p className="text-xs text-slate-400">
                        Enter the couple's auspicious details and welcoming family names.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Groom's Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Adnan"
                          value={form.weddingGroomName || ""}
                          onChange={(e) => {
                            updateForm("weddingGroomName", e.target.value);
                            updateForm("weddingCoupleNames", `${e.target.value} & ${form.weddingBrideName || ""}`);
                          }}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Bride's Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Sujan"
                          value={form.weddingBrideName || ""}
                          onChange={(e) => {
                            updateForm("weddingBrideName", e.target.value);
                            updateForm("weddingCoupleNames", `${form.weddingGroomName || ""} & ${e.target.value}`);
                          }}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 uppercase flex items-center justify-between">
                          <span>Groom's 1-Line Bio / Passion</span>
                          <span className="text-[10px] text-amber-400/80 font-normal lowercase">(optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Software Architect, Stargazer & Chai Lover"
                          value={form.weddingGroomBio || ""}
                          onChange={(e) => updateForm("weddingGroomBio", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 uppercase flex items-center justify-between">
                          <span>Bride's 1-Line Bio / Passion</span>
                          <span className="text-[10px] text-amber-400/80 font-normal lowercase">(optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Creative Designer, Classical Dancer & Baker"
                          value={form.weddingBrideBio || ""}
                          onChange={(e) => updateForm("weddingBrideBio", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Couple Monogram / Seal Initials</label>
                        <input
                          type="text"
                          placeholder="e.g. A & S"
                          value={form.weddingMonogram || ""}
                          onChange={(e) => updateForm("weddingMonogram", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Wedding Hashtag</label>
                        <input
                          type="text"
                          placeholder="e.g. #AdnanWedsSujan"
                          value={form.weddingHashtag || ""}
                          onChange={(e) => updateForm("weddingHashtag", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Host / Welcoming Family Names</label>
                        <input
                          type="text"
                          placeholder="e.g. Together with the Ajmeri & Bhatti Families"
                          value={form.weddingHostNames || ""}
                          onChange={(e) => updateForm("weddingHostNames", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5">{error}</p>}

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all text-xs font-mono uppercase"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold transition-all shadow-lg font-mono text-xs uppercase"
                      >
                        Next: Date & Venue <ChevronRight className="w-4 h-4 inline ml-1" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 💍 WEDDING STEP 2: DATE & VENUE */}
                {step === 102 && (
                  <motion.div
                    key="weddingStep2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                        💍 Wedding Wizard • Step 2 of 4
                      </div>
                      <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        Auspicious Date & Venue 📍
                      </h2>
                      <p className="text-xs text-slate-400">
                        This sets the live real-time countdown clock and guest Google Maps navigation.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Wedding Date (YYYY-MM-DD)</label>
                        <input
                          type="date"
                          value={form.weddingDate || ""}
                          onChange={(e) => updateForm("weddingDate", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Ceremony Main Time</label>
                        <input
                          type="text"
                          placeholder="e.g. 7:00 PM"
                          value={form.weddingTime || ""}
                          onChange={(e) => updateForm("weddingTime", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Palace / Venue Name</label>
                        <input
                          type="text"
                          placeholder="e.g. The Royal Grand Palace Ballroom"
                          value={form.weddingVenueName || ""}
                          onChange={(e) => updateForm("weddingVenueName", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Full Venue Address</label>
                        <input
                          type="text"
                          placeholder="e.g. 123 Heritage Palace Boulevard, Udaipur, Rajasthan"
                          value={form.weddingVenueAddress || ""}
                          onChange={(e) => updateForm("weddingVenueAddress", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Google Maps Link (Optional)</label>
                        <input
                          type="url"
                          placeholder="https://maps.google.com/?q=The+Royal+Palace"
                          value={form.weddingVenueMapsUrl || ""}
                          onChange={(e) => updateForm("weddingVenueMapsUrl", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5">{error}</p>}

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all text-xs font-mono uppercase"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold transition-all shadow-lg font-mono text-xs uppercase"
                      >
                        Next: Ceremonies <ChevronRight className="w-4 h-4 inline ml-1" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 💍 WEDDING STEP 3: DYNAMIC CEREMONIES & FUNCTIONS */}
                {step === 103 && (
                  <motion.div
                    key="weddingStep3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                        💍 Step 3 of 4 • Ceremonies & Program
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                            Ceremonies & Functions ✨
                          </h2>
                          <p className="text-xs text-slate-400">
                            Add as many events as your culture/tradition celebrates (Mehndi, Haldi, Nikah, Pheras, Reception, etc.).
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addWeddingEvent()}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/40 cursor-pointer self-start sm:self-auto transition-all"
                        >
                          + Add Another Event
                        </button>
                      </div>
                    </div>

                    {/* Quick Cultural Event Preset Chips */}
                    <div className="space-y-1.5 text-left">
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Quick Preset Ideas (Click to Add):</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { title: "Mehndi & Henna", icon: "🌺" },
                          { title: "Sangeet & Dance", icon: "🎵" },
                          { title: "Haldi / Pithi", icon: "💛" },
                          { title: "Baraat / Procession", icon: "🥁" },
                          { title: "Sacred Pheras / Vows", icon: "💍" },
                          { title: "Nikah / Holy Union", icon: "🕌" },
                          { title: "Walima / Reception", icon: "✨" },
                          { title: "Cocktail Gala", icon: "🥂" },
                          { title: "Roka / Blessings", icon: "🕊️" },
                        ].map((chip) => (
                          <button
                            key={chip.title}
                            type="button"
                            onClick={() => addWeddingEvent({ title: chip.title, icon: chip.icon })}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-[11px] text-slate-300 hover:text-amber-200 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>{chip.icon}</span> {chip.title}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Event Cards List */}
                    <div className="space-y-3.5 my-auto max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
                      {weddingEvents.length === 0 ? (
                        <div className="p-8 rounded-2xl bg-white/[0.02] border border-dashed border-white/15 text-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-2xl flex items-center justify-center mx-auto text-amber-400">
                            ✨
                          </div>
                          <h4 className="text-sm font-bold text-white">No Ceremonies Added Yet</h4>
                          <p className="text-xs text-slate-400 max-w-xs mx-auto">
                            Click any quick preset idea above (Mehndi, Sangeet, Haldi, Nikah, etc.) or tap <strong className="text-amber-400">+ Add Another Event</strong> to create your first function.
                          </p>
                        </div>
                      ) : (
                        weddingEvents.map((evt, idx) => (
                        <div key={evt.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative group text-left">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {/* Emoji Picker Select */}
                              <select
                                value={evt.icon || "💍"}
                                onChange={(e) => updateWeddingEvent(evt.id, "icon", e.target.value)}
                                className="bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-sm text-white cursor-pointer outline-none"
                              >
                                {["💍", "🌺", "🎵", "💛", "✨", "🥂", "🥁", "🕊️", "🕌", "⛪", "👑", "🌸"].map(em => (
                                  <option key={em} value={em}>{em}</option>
                                ))}
                              </select>
                              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                                Event {idx + 1}
                              </span>
                            </div>
                            {weddingEvents.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeWeddingEvent(evt.id)}
                                className="text-[11px] text-rose-400 hover:text-rose-300 font-bold px-2 py-0.5 rounded-md hover:bg-rose-500/10 transition-colors cursor-pointer"
                              >
                                ✕ Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div className="space-y-1 sm:col-span-1">
                              <label className="text-[10px] font-semibold text-slate-400 uppercase">Event Title</label>
                              <input
                                type="text"
                                placeholder="e.g. Sangeet & Dance"
                                value={evt.title}
                                onChange={(e) => updateWeddingEvent(evt.id, "title", e.target.value)}
                                className="w-full px-3 py-2 rounded-xl text-xs text-white glass-input"
                              />
                            </div>
                            <div className="space-y-1 sm:col-span-1">
                              <label className="text-[10px] font-semibold text-slate-400 uppercase">Date</label>
                              <input
                                type="text"
                                placeholder="e.g. Friday, Dec 16, 2035"
                                value={evt.date}
                                onChange={(e) => updateWeddingEvent(evt.id, "date", e.target.value)}
                                className="w-full px-3 py-2 rounded-xl text-xs text-white glass-input"
                              />
                            </div>
                            <div className="space-y-1 sm:col-span-1">
                              <label className="text-[10px] font-semibold text-slate-400 uppercase">Time</label>
                              <input
                                type="text"
                                placeholder="e.g. 6:30 PM"
                                value={evt.time}
                                onChange={(e) => updateWeddingEvent(evt.id, "time", e.target.value)}
                                className="w-full px-3 py-2 rounded-xl text-xs text-white glass-input"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase">Short Description (Optional)</label>
                            <input
                              type="text"
                              placeholder="e.g. An evening of music, henna, and celebration under the stars."
                              value={evt.desc || ""}
                              onChange={(e) => updateWeddingEvent(evt.id, "desc", e.target.value)}
                              className="w-full px-3 py-2 rounded-xl text-xs text-white glass-input"
                            />
                          </div>
                        </div>
                      ))
                      )}
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5">{error}</p>}

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all text-xs font-mono uppercase"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold transition-all shadow-lg font-mono text-xs uppercase"
                      >
                        Next: Soundtrack & Launch <ChevronRight className="w-4 h-4 inline ml-1" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 💍 WEDDING STEP 4: MUSIC & LAUNCH */}
                {step === 104 && (
                  <motion.div
                    key="weddingStep4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                        💍 Step 4 of 4 • Soundtrack & Launch
                      </div>
                      <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        Wedding Soundtrack & Music 🎵
                      </h2>
                      <p className="text-xs text-slate-400">
                        Paste any YouTube song or instrumental link that will play when guests open the wedding invitation.
                      </p>
                    </div>

                    <div className="space-y-4 my-auto text-left">
                      {/* YouTube Link Input */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">YouTube Song Link</label>
                        <input
                          type="url"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={form.youtubeUrl || ""}
                          onChange={(e) => {
                            updateForm("youtubeUrl", e.target.value);
                          }}
                          className="w-full px-4 py-3.5 rounded-xl bg-black/60 border border-white/10 focus:border-amber-500 outline-none text-white text-xs placeholder:text-zinc-600 transition-colors"
                        />
                        <p className="text-[11px] text-slate-500">
                          Supports full YouTube URLs, short links (youtu.be), or YouTube Music tracks.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Song Display Title (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Din Shagna Da / Royal Shehnai / Kesariya"
                          value={form.songName || ""}
                          onChange={(e) => updateForm("songName", e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl text-white glass-input text-xs"
                        />
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5">{error}</p>}

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all text-xs font-mono uppercase"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
                      </button>
                      <button
                        onClick={() => handleSubmit()}
                        disabled={loading}
                        className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Launch Royal Wedding Keepsake 👑</>}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 💍 ENGAGEMENT STEP 1: COUPLE & HOSTS */}
                {step === 201 && (
                  <motion.div
                    key="engagementStep1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                        💍 Engagement Wizard • Step 1 of 4
                      </div>
                      <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        The Engaged Couple & Families 🌸
                      </h2>
                      <p className="text-xs text-slate-400">
                        Enter the couple names and the host families inviting the guests.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Groom / Partner 1 Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Adnan"
                          value={form.weddingGroomName || ""}
                          onChange={(e) => {
                            updateForm("weddingGroomName", e.target.value);
                            updateForm("creatorName", e.target.value);
                          }}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Bride / Partner 2 Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Sujan"
                          value={form.weddingBrideName || ""}
                          onChange={(e) => {
                            updateForm("weddingBrideName", e.target.value);
                            updateForm("recipientName", e.target.value);
                          }}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Couple Hashtag & Monogram Initials</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="e.g. #AdnanSujanRingCeremony"
                            value={form.weddingHashtag || ""}
                            onChange={(e) => updateForm("weddingHashtag", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-white glass-input"
                          />
                          <input
                            type="text"
                            placeholder="e.g. A & S"
                            value={form.weddingMonogram || ""}
                            onChange={(e) => updateForm("weddingMonogram", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-white glass-input"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Inviting Family / Host Line</label>
                        <input
                          type="text"
                          placeholder="e.g. Together with their families, invite you to celebrate..."
                          value={form.weddingHostNames || ""}
                          onChange={(e) => updateForm("weddingHostNames", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5">{error}</p>}

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all text-xs font-mono uppercase"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 text-black font-black transition-all shadow-xl shadow-emerald-950/40 font-mono text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        Next: Date & Venue <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 💍 ENGAGEMENT STEP 2: DATE & VENUE */}
                {step === 202 && (
                  <motion.div
                    key="engagementStep2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                        💍 Engagement Wizard • Step 2 of 4
                      </div>
                      <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        Celebration Date & Venue 📍
                      </h2>
                      <p className="text-xs text-slate-400">
                        Specify when and where the ring ceremony and feast take place.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Engagement Date</label>
                        <input
                          type="date"
                          value={form.weddingDate || ""}
                          onChange={(e) => updateForm("weddingDate", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input bg-black/40"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Ceremony Time</label>
                        <input
                          type="text"
                          placeholder="e.g. 6:30 PM Onwards"
                          value={form.weddingTime || ""}
                          onChange={(e) => updateForm("weddingTime", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Venue Name</label>
                        <input
                          type="text"
                          placeholder="e.g. The Botanical Meadow & Garden Lawn"
                          value={form.weddingVenueName || ""}
                          onChange={(e) => updateForm("weddingVenueName", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Venue Address</label>
                        <input
                          type="text"
                          placeholder="e.g. Lakeview Promenade, Rosewood Greens"
                          value={form.weddingVenueAddress || ""}
                          onChange={(e) => updateForm("weddingVenueAddress", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Google Maps Directions URL (Optional)</label>
                        <input
                          type="url"
                          placeholder="https://maps.app.goo.gl/..."
                          value={form.weddingVenueMapsUrl || ""}
                          onChange={(e) => updateForm("weddingVenueMapsUrl", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5">{error}</p>}

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all text-xs font-mono uppercase"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 text-black font-black transition-all shadow-xl shadow-emerald-950/40 font-mono text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        Next: Ceremonies <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 💍 ENGAGEMENT STEP 3: CEREMONIES & PROGRAM */}
                {step === 203 && (
                  <motion.div
                    key="engagementStep3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                          💍 Engagement Wizard • Step 3 of 4
                        </div>
                        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                          Ring Ceremony & Celebrations ✨
                        </h2>
                        <p className="text-xs text-slate-400">
                          Add the engagement functions (Ring Exchange, Welcome High Tea, Dinner Party).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addWeddingEvent({ icon: "💍", title: "Ring Exchange" })}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase font-mono tracking-wider transition-all flex items-center gap-1.5 shadow-md self-start sm:self-auto cursor-pointer"
                      >
                        + Add Function
                      </button>
                    </div>

                    <div className="space-y-3 my-auto max-h-[280px] overflow-y-auto pr-1">
                      {weddingEvents.length === 0 ? (
                        <div className="p-6 rounded-2xl border border-dashed border-white/10 text-center space-y-2 bg-white/2">
                          <p className="text-sm text-slate-400">No extra functions added yet.</p>
                          <p className="text-xs text-slate-500">The main ring ceremony date and time will be prominently shown on the invitation.</p>
                          <button
                            type="button"
                            onClick={() => addWeddingEvent({ icon: "💍", title: "Ring Exchange Ceremony", time: "7:00 PM" })}
                            className="text-xs text-emerald-400 font-bold hover:underline"
                          >
                            + Click to add Ring Exchange Ceremony
                          </button>
                        </div>
                      ) : (
                        weddingEvents.map((evt) => (
                          <div key={evt.id} className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 relative text-left">
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                placeholder="Function Title (e.g. Ring Exchange, Cocktail)"
                                value={evt.title}
                                onChange={(e) => updateWeddingEvent(evt.id, "title", e.target.value)}
                                className="w-full bg-transparent border-none text-white text-sm font-bold placeholder:text-zinc-600 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => removeWeddingEvent(evt.id)}
                                className="text-zinc-500 hover:text-red-400 text-xs p-1"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="Date (e.g. Nov 20, 2026)"
                                value={evt.date}
                                onChange={(e) => updateWeddingEvent(evt.id, "date", e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                              />
                              <input
                                type="text"
                                placeholder="Time (e.g. 7:30 PM)"
                                value={evt.time}
                                onChange={(e) => updateWeddingEvent(evt.id, "time", e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all text-xs font-mono uppercase"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 text-black font-black transition-all shadow-xl shadow-emerald-950/40 font-mono text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        Next: Soundtrack <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 💍 ENGAGEMENT STEP 4: SOUNDTRACK & LAUNCH */}
                {step === 204 && (
                  <motion.div
                    key="engagementStep4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                        💍 Engagement Wizard • Step 4 of 4
                      </div>
                      <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        Acoustic Romantic Soundtrack 🎵
                      </h2>
                      <p className="text-xs text-slate-400">
                        Paste any YouTube song or acoustic melody link for your botanical ring ceremony.
                      </p>
                    </div>

                    <div className="space-y-4 my-auto text-left">
                      {/* YouTube Link Input */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">YouTube Song Link</label>
                        <input
                          type="url"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={form.youtubeUrl || ""}
                          onChange={(e) => {
                            updateForm("youtubeUrl", e.target.value);
                          }}
                          className="w-full px-4 py-3.5 rounded-xl bg-black/60 border border-white/10 focus:border-emerald-400 outline-none text-white text-xs placeholder:text-zinc-600 transition-colors"
                        />
                        <p className="text-[11px] text-slate-500">
                          Supports full YouTube URLs, short links (youtu.be), or YouTube Music tracks.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Song Display Title (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Perfect (Acoustic) / Romantic Harp"
                          value={form.songName || ""}
                          onChange={(e) => updateForm("songName", e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl text-white glass-input text-xs"
                        />
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5">{error}</p>}

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all text-xs font-mono uppercase"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
                      </button>
                      <button
                        onClick={() => handleSubmit()}
                        disabled={loading}
                        className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 text-black font-black transition-all shadow-xl shadow-emerald-950/40 font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Generate Botanical Engagement Website 💍</>}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 🎉 BIRTHDAY PARTY STEP 1: STAR & EVENT DETAILS */}
                {step === 301 && (
                  <motion.div
                    key="birthdayPartyStep1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                        🎉 Birthday Party Wizard • Step 1 of 4
                      </div>
                      <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        The Birthday Star & VIP Event 🥂
                      </h2>
                      <p className="text-xs text-slate-400">
                        Enter who is turning a year bolder, the event title, and the host crew.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Birthday Star's Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Adnan"
                          value={form.partyPersonName || ""}
                          onChange={(e) => {
                            updateForm("partyPersonName", e.target.value);
                            updateForm("recipientName", e.target.value);
                          }}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Age Milestone (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. 21st / 25th / 30th"
                          value={form.partyAgeMilestone || ""}
                          onChange={(e) => updateForm("partyAgeMilestone", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Party Event Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Adnan's 21st Midnight Rooftop Soirée ✨"
                          value={form.partyEventTitle || ""}
                          onChange={(e) => updateForm("partyEventTitle", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Hosting Line / Crew Names</label>
                        <input
                          type="text"
                          placeholder="e.g. Hosted with love by The Boys & Besties"
                          value={form.partyHostNames || ""}
                          onChange={(e) => {
                            updateForm("partyHostNames", e.target.value);
                            updateForm("creatorName", e.target.value);
                          }}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Party Tagline / Hype Quote (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Champagne, Disco Lights & Unforgettable Midnight Memories"
                          value={form.partyTagline || ""}
                          onChange={(e) => updateForm("partyTagline", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5">{error}</p>}

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all text-xs font-mono uppercase"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-400 via-purple-500 to-pink-500 hover:from-amber-300 text-white font-black transition-all shadow-xl shadow-amber-950/40 font-mono text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        Next: Date & Venue <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 🎉 BIRTHDAY PARTY STEP 2: DATE & VENUE */}
                {step === 302 && (
                  <motion.div
                    key="birthdayPartyStep2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                        🎉 Birthday Party Wizard • Step 2 of 4
                      </div>
                      <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        Celebration Date & Venue 📍
                      </h2>
                      <p className="text-xs text-slate-400">
                        Set when and where the celebration, dance floor, and toasts take place.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Party Date</label>
                        <input
                          type="date"
                          value={form.partyDate || ""}
                          onChange={(e) => updateForm("partyDate", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input bg-black/40"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Party Start Time</label>
                        <input
                          type="text"
                          placeholder="e.g. 8:00 PM Onwards"
                          value={form.partyTime || ""}
                          onChange={(e) => updateForm("partyTime", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Venue / Lounge / Club Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Skybar & Rooftop Lounge"
                          value={form.partyVenueName || ""}
                          onChange={(e) => updateForm("partyVenueName", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Full Venue Address</label>
                        <input
                          type="text"
                          placeholder="e.g. 42nd Floor Penthouse, Grand Horizon Heights"
                          value={form.partyVenueAddress || ""}
                          onChange={(e) => updateForm("partyVenueAddress", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Google Maps Directions URL (Optional)</label>
                        <input
                          type="url"
                          placeholder="https://maps.app.goo.gl/..."
                          value={form.partyVenueMapsUrl || ""}
                          onChange={(e) => updateForm("partyVenueMapsUrl", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5">{error}</p>}

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all text-xs font-mono uppercase"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-400 via-purple-500 to-pink-500 hover:from-amber-300 text-white font-black transition-all shadow-xl shadow-amber-950/40 font-mono text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        Next: Vibe & Timeline <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 🎉 BIRTHDAY PARTY STEP 3: DRESS CODE, RULES & TIMELINE */}
                {step === 303 && (
                  <motion.div
                    key="birthdayPartyStep3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                          🎉 Birthday Party Wizard • Step 3 of 4
                        </div>
                        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                          Vibe, Dress Code & Timeline ✨
                        </h2>
                        <p className="text-xs text-slate-400">
                          Add the dress code, VIP rules, and party schedule highlights.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addPartyTimelineItem({ icon: "🥂", title: "VIP Cake & Champagne Toast", time: "9:30 PM" })}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-black font-bold text-xs uppercase font-mono tracking-wider transition-all flex items-center gap-1.5 shadow-md self-start sm:self-auto cursor-pointer"
                      >
                        + Add Highlight
                      </button>
                    </div>

                    <div className="space-y-4 my-auto max-h-[300px] overflow-y-auto pr-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300 uppercase">Dress Code Theme <span className="text-amber-400">*</span></label>
                          <input
                            type="text"
                            placeholder="e.g. Midnight Black & Metallic Gold Glamour"
                            value={form.partyDressCode || ""}
                            onChange={(e) => updateForm("partyDressCode", e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl text-white glass-input text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300 uppercase">VIP Notes / Guest Guidelines <span className="text-amber-400">*</span></label>
                          <input
                            type="text"
                            placeholder="e.g. Open Bar • Strictly 18+ • Valet Parking"
                            value={form.partySpecialNotes || ""}
                            onChange={(e) => updateForm("partySpecialNotes", e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl text-white glass-input text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 text-left">
                        <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                          Party Schedule & Program Highlights (Optional)
                        </label>
                        {partyTimeline.length === 0 ? (
                          <div className="p-4 rounded-xl border border-dashed border-white/10 text-center space-y-1.5 bg-white/2">
                            <p className="text-xs text-slate-400">No custom timeline moments added yet.</p>
                            <p className="text-[11px] text-slate-500">The main party date & start time will be highlighted on the countdown.</p>
                            <button
                              type="button"
                              onClick={() => {
                                addPartyTimelineItem({ icon: "🍸", title: "Red Carpet & Cocktails", time: "8:00 PM" });
                                addPartyTimelineItem({ icon: "🎂", title: "Cake Cutting & Champagne Pop", time: "9:30 PM" });
                                addPartyTimelineItem({ icon: "🎧", title: "DJ Set & Dance Floor Open", time: "10:30 PM" });
                              }}
                              className="text-xs text-amber-300 font-bold hover:underline"
                            >
                              + Load 3 Standard Party Timeline Highlights
                            </button>
                          </div>
                        ) : (
                          partyTimeline.map((evt) => (
                            <div key={evt.id} className="p-3 rounded-xl bg-black/50 border border-amber-500/20 space-y-2 relative text-left">
                              <div className="flex items-center justify-between gap-2">
                                <input
                                  type="text"
                                  placeholder="Highlight Title (e.g. VIP Cake Cutting, DJ Set)"
                                  value={evt.title}
                                  onChange={(e) => updatePartyTimelineItem(evt.id, "title", e.target.value)}
                                  className="w-full bg-transparent border-none text-white text-xs font-bold placeholder:text-zinc-600 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => removePartyTimelineItem(evt.id)}
                                  className="text-zinc-500 hover:text-red-400 text-xs p-1"
                                >
                                  ✕
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="Time (e.g. 9:30 PM)"
                                  value={evt.time}
                                  onChange={(e) => updatePartyTimelineItem(evt.id, "time", e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                                />
                                <input
                                  type="text"
                                  placeholder="Short Description (Optional)"
                                  value={evt.desc || ""}
                                  onChange={(e) => updatePartyTimelineItem(evt.id, "desc", e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                                />
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all text-xs font-mono uppercase"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-400 via-purple-500 to-pink-500 hover:from-amber-300 text-white font-black transition-all shadow-xl shadow-amber-950/40 font-mono text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        Next: Music & RSVP <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 🎉 BIRTHDAY PARTY STEP 4: SOUNDTRACK & DJ RSVP LAUNCH */}
                {step === 304 && (
                  <motion.div
                    key="birthdayPartyStep4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                        🎉 Birthday Party Wizard • Step 4 of 4
                      </div>
                      <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        Party Soundtrack & DJ Request Box 🎵
                      </h2>
                      <p className="text-xs text-slate-400">
                        Paste a YouTube party anthem and enable guest DJ song requests during RSVP.
                      </p>
                    </div>

                    <div className="space-y-4 my-auto text-left">
                      {/* YouTube Link Input */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-amber-300 uppercase tracking-wider">YouTube Party Song Link</label>
                        <input
                          type="url"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={form.youtubeUrl || ""}
                          onChange={(e) => updateForm("youtubeUrl", e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl bg-black/60 border border-white/10 focus:border-amber-400 outline-none text-white text-xs placeholder:text-zinc-600 transition-colors"
                        />
                        <p className="text-[11px] text-slate-500">
                          Supports full YouTube links, short links (youtu.be), or YouTube Music tracks.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Track Display Title (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Levitating / Midnight Anthem"
                          value={form.songName || ""}
                          onChange={(e) => updateForm("songName", e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl text-white glass-input text-xs"
                        />
                      </div>

                      {/* DJ Request Box Toggle */}
                      <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-purple-200 block">🎧 Live DJ Song Request Box</span>
                          <span className="text-[11px] text-slate-400 block">Let guests nominate a song for the DJ when confirming attendance.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={form.partyAllowDjRequests ?? true}
                          onChange={(e) => updateForm("partyAllowDjRequests", e.target.checked)}
                          className="w-5 h-5 accent-amber-400 rounded cursor-pointer"
                        />
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5">{error}</p>}

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all text-xs font-mono uppercase"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
                      </button>
                      <button
                        onClick={() => handleSubmit()}
                        disabled={loading}
                        className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-amber-400 via-purple-500 to-pink-500 hover:from-amber-300 text-white font-black transition-all shadow-xl shadow-amber-950/40 font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Generate VIP Birthday Party Website 🎉</>}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 🌹 ROMANTIC PROPOSAL STEP 1: PARTNER & PROPOSAL TYPE */}
                {step === 401 && (
                  <motion.div
                    key="proposalStep1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] font-bold text-rose-300 uppercase tracking-widest">
                        🌹 Proposal Wizard • Step 1 of 4
                      </div>
                      <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        Who is This Question For? 💍
                      </h2>
                      <p className="text-xs text-slate-400">
                        Enter your names and the style of romantic proposal you are making.
                      </p>
                    </div>

                    <div className="space-y-4 my-auto text-left">
                      {/* Proposal Type Selector */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-rose-300 uppercase tracking-wider">Proposal Type</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {[
                            { value: "marriage", label: "💍 Marriage Proposal", desc: "Will You Marry Me?" },
                            { value: "relationship", label: "💖 Relationship", desc: "Be My Partner / Girlfriend" },
                            { value: "forever", label: "🌹 Forever & Always", desc: "Spend Forever With Me" }
                          ].map(t => (
                            <button
                              key={t.value}
                              type="button"
                              onClick={() => updateForm("proposalType", t.value)}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                (form.proposalType || "marriage") === t.value
                                  ? "bg-rose-950/60 border-rose-500 text-white shadow-lg shadow-rose-950/40"
                                  : "bg-black/40 border-white/10 text-slate-400 hover:border-rose-500/40"
                              }`}
                            >
                              <span className="text-xs font-bold block text-rose-200">{t.label}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">{t.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300 uppercase">Your Name (Proposer) <span className="text-rose-400">*</span></label>
                          <input
                            type="text"
                            placeholder="e.g. Adnan"
                            value={form.creatorName || ""}
                            onChange={(e) => updateForm("creatorName", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-white glass-input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300 uppercase">Partner's Name <span className="text-rose-400">*</span></label>
                          <input
                            type="text"
                            placeholder="e.g. Sujan"
                            value={form.proposalPartnerName || form.recipientName || ""}
                            onChange={(e) => {
                              updateForm("proposalPartnerName", e.target.value);
                              updateForm("recipientName", e.target.value);
                            }}
                            className="w-full px-4 py-3 rounded-xl text-white glass-input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300 uppercase">Cute Nickname (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. My Universe, Honey, Sweetheart"
                            value={form.proposalPartnerNickname || ""}
                            onChange={(e) => updateForm("proposalPartnerNickname", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-white glass-input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300 uppercase">Custom Headline (Optional)</label>
                          <input
                            type="text"
                            placeholder={`e.g. For My Forever, ${form.proposalPartnerName || "My Love"} 🌹`}
                            value={form.proposalHeadline || ""}
                            onChange={(e) => updateForm("proposalHeadline", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-white glass-input"
                          />
                        </div>
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5">{error}</p>}

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all text-xs font-mono uppercase"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 text-white font-black transition-all shadow-xl shadow-rose-950/40 font-mono text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        Next: Our Love Story <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 🌹 ROMANTIC PROPOSAL STEP 2: THREE CHAPTERS OF OUR LOVE STORY */}
                {step === 402 && (
                  <motion.div
                    key="proposalStep2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] font-bold text-rose-300 uppercase tracking-widest">
                          🌹 Proposal Wizard • Step 2 of 4
                        </div>
                        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                          Three Chapters of Us 📖
                        </h2>
                        <p className="text-xs text-slate-400">
                          Tell the story of how you met, the memories you cherish, and why you choose them.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const name = form.proposalPartnerName || "you";
                          updateForm("proposalStoryChapter1Title", "Chapter I: The Day Everything Changed");
                          updateForm("proposalStoryChapter1Text", `The day our paths crossed, the entire world seemed to fade into the background. A single smile from ${name} turned an ordinary day into something pure and cinematic.`);
                          updateForm("proposalStoryChapter2Title", "Chapter II: The Moments That Built Us");
                          updateForm("proposalStoryChapter2Text", "From late-night laughter and shared coffee to quiet moments where words weren't even needed, you became my peace, my home, and my favorite adventure.");
                          updateForm("proposalStoryChapter3Title", "Chapter III: The Vow of Forever");
                          updateForm("proposalStoryChapter3Text", "I don't just love you for who you are—I love the world we've created together. I choose you today, tomorrow, and through every lifetime.");
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
                      >
                        ✨ Autofill Romantic Draft
                      </button>
                    </div>

                    <div className="space-y-4 my-auto max-h-[340px] overflow-y-auto pr-1 text-left custom-scrollbar">
                      {/* Chapter 1 */}
                      <div className="p-4 rounded-2xl bg-black/40 border border-rose-500/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            placeholder="Chapter 1 Title"
                            value={form.proposalStoryChapter1Title || "Chapter I: The Spark"}
                            onChange={(e) => updateForm("proposalStoryChapter1Title", e.target.value)}
                            className="bg-transparent border-none text-rose-300 text-xs font-bold uppercase tracking-wider focus:outline-none w-full"
                          />
                        </div>
                        <textarea
                          rows={3}
                          placeholder="How did you meet? What made that first moment feel special?"
                          value={form.proposalStoryChapter1Text || ""}
                          onChange={(e) => updateForm("proposalStoryChapter1Text", e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-white text-xs bg-zinc-950/70 border border-white/10 outline-none focus:border-rose-400 transition-all font-sans resize-none leading-relaxed"
                        />
                      </div>

                      {/* Chapter 2 */}
                      <div className="p-4 rounded-2xl bg-black/40 border border-rose-500/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            placeholder="Chapter 2 Title"
                            value={form.proposalStoryChapter2Title || "Chapter II: The Moments That Built Us"}
                            onChange={(e) => updateForm("proposalStoryChapter2Title", e.target.value)}
                            className="bg-transparent border-none text-rose-300 text-xs font-bold uppercase tracking-wider focus:outline-none w-full"
                          />
                        </div>
                        <textarea
                          rows={3}
                          placeholder="What favorite moments, laughter, or memories define your bond?"
                          value={form.proposalStoryChapter2Text || ""}
                          onChange={(e) => updateForm("proposalStoryChapter2Text", e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-white text-xs bg-zinc-950/70 border border-white/10 outline-none focus:border-rose-400 transition-all font-sans resize-none leading-relaxed"
                        />
                      </div>

                      {/* Chapter 3 */}
                      <div className="p-4 rounded-2xl bg-black/40 border border-rose-500/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            placeholder="Chapter 3 Title"
                            value={form.proposalStoryChapter3Title || "Chapter III: The Vow of Forever"}
                            onChange={(e) => updateForm("proposalStoryChapter3Title", e.target.value)}
                            className="bg-transparent border-none text-rose-300 text-xs font-bold uppercase tracking-wider focus:outline-none w-full"
                          />
                        </div>
                        <textarea
                          rows={3}
                          placeholder="Why do you choose them forever? What is your promise to them?"
                          value={form.proposalStoryChapter3Text || ""}
                          onChange={(e) => updateForm("proposalStoryChapter3Text", e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-white text-xs bg-zinc-950/70 border border-white/10 outline-none focus:border-rose-400 transition-all font-sans resize-none leading-relaxed"
                        />
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5">{error}</p>}

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all text-xs font-mono uppercase"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 text-white font-black transition-all shadow-xl shadow-rose-950/40 font-mono text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        Next: The Big Question <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 🌹 ROMANTIC PROPOSAL STEP 3: THE BIG QUESTION & SECRET LOVE NOTE */}
                {step === 403 && (
                  <motion.div
                    key="proposalStep3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] font-bold text-rose-300 uppercase tracking-widest">
                        🌹 Proposal Wizard • Step 3 of 4
                      </div>
                      <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        The Big Question & Secret Letter 💌
                      </h2>
                      <p className="text-xs text-slate-400">
                        Write the question that will be displayed in grand glowing calligraphy, and your secret letter.
                      </p>
                    </div>

                    <div className="space-y-4 my-auto text-left">
                      {/* Big Proposal Question */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                          The Proposal Question <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Will you marry me and make me the happiest person in the universe? 💍"
                          value={form.proposalQuestion || ""}
                          onChange={(e) => updateForm("proposalQuestion", e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl bg-black/60 border border-rose-500/40 focus:border-rose-400 outline-none text-white text-xs font-serif italic placeholder:text-zinc-600 transition-colors"
                        />
                      </div>

                      {/* Secret Love Letter */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                            Secret Love Letter (Unlocked Upon YES! 💖)
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              updateForm("proposalSecretLoveNote", `You are the quiet prayer I didn't know I was making, and the greatest blessing I have ever received. Thank you for choosing to walk this life with me. Forever yours, ${form.creatorName || "me"}.`);
                            }}
                            className="text-[10px] text-rose-400 font-bold hover:underline"
                          >
                            + Autofill Sample Note
                          </button>
                        </div>
                        <textarea
                          rows={4}
                          placeholder="Write a private letter that will be unveiled alongside their official Certificate of Forever..."
                          value={form.proposalSecretLoveNote || ""}
                          onChange={(e) => updateForm("proposalSecretLoveNote", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-rose-400 outline-none text-white text-xs font-sans placeholder:text-zinc-600 transition-colors resize-none leading-relaxed"
                        />
                      </div>

                      {/* Playful Dodge Button Toggle */}
                      <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-rose-200 block">🙈 Playful 'Let Me Think' Dodge Button</span>
                          <span className="text-[11px] text-slate-400 block">Adds a funny second button that darts away whenever their mouse/finger touches it!</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={form.proposalEnableDodgeButton ?? true}
                          onChange={(e) => updateForm("proposalEnableDodgeButton", e.target.checked)}
                          className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                        />
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5">{error}</p>}

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all text-xs font-mono uppercase"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 text-white font-black transition-all shadow-xl shadow-rose-950/40 font-mono text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        Next: Interactive Features <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 🌹 ROMANTIC PROPOSAL STEP 4: INTERACTIVE EXPERIENCE MODULES */}
                {step === 404 && (
                  <motion.div
                    key="proposalStep4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] font-bold text-rose-300 uppercase tracking-widest">
                        🌹 Proposal Wizard • Step 4 of 5
                      </div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                        Interactive Keepsake Modules ✨
                      </h2>
                      <p className="text-xs text-slate-400">
                        Choose exactly which interactive features appear and how many items to create (e.g. 3 promises, 2 love tokens). Blank or disabled modules are skipped automatically!
                      </p>
                    </div>

                    {/* Horizontal Category Switcher Tabs */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin text-xs">
                      {[
                        { id: "promises", label: "🌟 Promises", count: form.proposalEnablePromises !== false ? proposalPromises.length : 0, enabled: form.proposalEnablePromises !== false },
                        { id: "coupons", label: "🎟️ Love Tokens", count: form.proposalEnableLoveCoupons !== false ? proposalLoveCoupons.length : 0, enabled: form.proposalEnableLoveCoupons !== false },
                        { id: "reasons", label: "💖 Reasons Why", count: form.proposalEnableReasonsWhy !== false ? proposalReasonsWhy.length : 0, enabled: form.proposalEnableReasonsWhy !== false },
                        { id: "whispers", label: "📜 Whispers", count: form.proposalEnableWhispers !== false ? proposalWhispers.length : 0, enabled: form.proposalEnableWhispers !== false },
                        { id: "bucket", label: "🧭 Bucket List", count: form.proposalEnableBucketList !== false ? proposalBucketList.length : 0, enabled: form.proposalEnableBucketList !== false },
                        { id: "constellation", label: "🌌 Constellation", count: form.proposalEnableConstellation !== false ? proposalConstellation.length : 0, enabled: form.proposalEnableConstellation !== false },
                        { id: "memory", label: "📸 Keepsakes", count: form.proposalEnableMemoryVault !== false ? proposalMemoryVault.length : 0, enabled: form.proposalEnableMemoryVault !== false }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveKeepsakeTab(tab.id)}
                          className={`px-3 py-2 rounded-xl whitespace-nowrap text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                            activeKeepsakeTab === tab.id
                              ? "bg-rose-500/20 border-rose-400/60 text-rose-200 shadow-md scale-[1.02]"
                              : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                            tab.enabled && tab.count > 0 ? "bg-rose-500/30 text-rose-200" : "bg-zinc-800 text-zinc-500"
                          }`}>
                            {tab.count}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Active Keepsake Module Editor Card */}
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-left space-y-3.5 max-h-[360px] overflow-y-auto custom-scrollbar">

                      {/* 1. PROMISES TAB */}
                      {activeKeepsakeTab === "promises" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/40 border border-rose-500/30">
                            <div>
                              <span className="text-xs font-bold text-rose-100 block">Include Sacred Promises on Website</span>
                              <span className="text-[11px] text-slate-400 block">Tap-to-reveal lifetime vow cards with shimmering starlight.</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={form.proposalEnablePromises ?? true}
                              onChange={(e) => updateForm("proposalEnablePromises", e.target.checked)}
                              className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                            />
                          </div>

                          {form.proposalEnablePromises !== false && (
                            <div className="space-y-2.5">
                              <p className="text-[11px] text-amber-300/90 font-mono">
                                💡 Tip: You can have 2, 3, 5, or however many promises you want. Delete any cards you don't need!
                              </p>

                              {proposalPromises.map((item, idx) => (
                                <div key={item.id} className="p-3 rounded-xl bg-zinc-900/80 border border-white/10 space-y-2 relative group">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">Promise #{idx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => setProposalPromises(prev => prev.filter(p => p.id !== item.id))}
                                      className="text-[11px] text-red-400 hover:text-red-300 font-bold px-2 py-0.5 rounded-md hover:bg-red-500/10 cursor-pointer"
                                    >
                                      🗑️ Remove
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Promise Title (e.g. To Stand Beside You in Every Storm)"
                                    value={item.title}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setProposalPromises(prev => prev.map(p => p.id === item.id ? { ...p, title: val } : p));
                                    }}
                                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none"
                                  />
                                  <textarea
                                    rows={2}
                                    placeholder="Promise Detail (e.g. Through sunny days and rainy nights, I promise my hand will always hold yours.)"
                                    value={item.text}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setProposalPromises(prev => prev.map(p => p.id === item.id ? { ...p, text: val } : p));
                                    }}
                                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none resize-none font-sans"
                                  />
                                </div>
                              ))}

                              <button
                                type="button"
                                onClick={() => setProposalPromises(prev => [
                                  ...prev,
                                  { id: Date.now().toString(), title: "To Love You In Every Tomorrow", text: "Every morning when I wake up, I promise to choose you all over again." }
                                ])}
                                className="w-full py-2.5 rounded-xl border border-dashed border-rose-500/40 hover:bg-rose-500/10 text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                + Add Another Promise Card
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 2. LOVE TOKENS TAB */}
                      {activeKeepsakeTab === "coupons" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/40 border border-rose-500/30">
                            <div>
                              <span className="text-xs font-bold text-rose-100 block">Include Redeemable Love Tokens</span>
                              <span className="text-[11px] text-slate-400 block">Cute vouchers with redeem buttons (e.g. warm hugs, win argument pass).</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={form.proposalEnableLoveCoupons ?? true}
                              onChange={(e) => updateForm("proposalEnableLoveCoupons", e.target.checked)}
                              className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                            />
                          </div>

                          {form.proposalEnableLoveCoupons !== false && (
                            <div className="space-y-2.5">
                              <p className="text-[11px] text-amber-300/90 font-mono">
                                💡 Tip: You can create 1, 2, 4, or 6 tokens. If you delete all, this section won't show on the website.
                              </p>

                              {proposalLoveCoupons.map((item, idx) => (
                                <div key={item.id} className="p-3 rounded-xl bg-zinc-900/80 border border-white/10 space-y-2 relative group">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">Token #{idx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => setProposalLoveCoupons(prev => prev.filter(c => c.id !== item.id))}
                                      className="text-[11px] text-red-400 hover:text-red-300 font-bold px-2 py-0.5 rounded-md hover:bg-red-500/10 cursor-pointer"
                                    >
                                      🗑️ Remove
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2">
                                    <input
                                      type="text"
                                      placeholder="Badge (e.g. Comfort Pass)"
                                      value={item.badge}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setProposalLoveCoupons(prev => prev.map(c => c.id === item.id ? { ...c, badge: val } : c));
                                      }}
                                      className="col-span-1 px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Token Title (e.g. 1x Endless Warm Hug Whenever Needed)"
                                      value={item.title}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setProposalLoveCoupons(prev => prev.map(c => c.id === item.id ? { ...c, title: val } : c));
                                      }}
                                      className="col-span-2 px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none"
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Description (e.g. No questions asked. Just unconditional warmth and holding you close.)"
                                    value={item.desc}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setProposalLoveCoupons(prev => prev.map(c => c.id === item.id ? { ...c, desc: val } : c));
                                    }}
                                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none"
                                  />
                                </div>
                              ))}

                              <button
                                type="button"
                                onClick={() => setProposalLoveCoupons(prev => [
                                  ...prev,
                                  { id: Date.now().toString(), badge: "Spontaneous Vibe", title: "1x Midnight Ice Cream & Long Drive", desc: "Valid anytime. Pick a flavor and playlist, and let's go on an unplanned midnight drive." }
                                ])}
                                className="w-full py-2.5 rounded-xl border border-dashed border-rose-500/40 hover:bg-rose-500/10 text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                + Add Another Love Token
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 3. REASONS WHY TAB */}
                      {activeKeepsakeTab === "reasons" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/40 border border-rose-500/30">
                            <div>
                              <span className="text-xs font-bold text-rose-100 block">Include 'Why You Are My Favorite Person'</span>
                              <span className="text-[11px] text-slate-400 block">Sweet cards highlighting the small quirks and details you adore.</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={form.proposalEnableReasonsWhy ?? true}
                              onChange={(e) => updateForm("proposalEnableReasonsWhy", e.target.checked)}
                              className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                            />
                          </div>

                          {form.proposalEnableReasonsWhy !== false && (
                            <div className="space-y-2.5">
                              <p className="text-[11px] text-amber-300/90 font-mono">
                                💡 Example: "Your Radiant Smile", "The Way You Laugh", "Our Quiet Comfort".
                              </p>

                              {proposalReasonsWhy.map((item, idx) => (
                                <div key={item.id} className="p-3 rounded-xl bg-zinc-900/80 border border-white/10 space-y-2 relative group">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">Reason #{idx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => setProposalReasonsWhy(prev => prev.filter(r => r.id !== item.id))}
                                      className="text-[11px] text-red-400 hover:text-red-300 font-bold px-2 py-0.5 rounded-md hover:bg-red-500/10 cursor-pointer"
                                    >
                                      🗑️ Remove
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Title (e.g. Your Radiant Smile)"
                                    value={item.title}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setProposalReasonsWhy(prev => prev.map(r => r.id === item.id ? { ...r, title: val } : r));
                                    }}
                                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none"
                                  />
                                  <textarea
                                    rows={2}
                                    placeholder="Why this makes them special (e.g. How your smile instantly turns my worst day into sunshine.)"
                                    value={item.desc}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setProposalReasonsWhy(prev => prev.map(r => r.id === item.id ? { ...r, desc: val } : r));
                                    }}
                                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none resize-none font-sans"
                                  />
                                </div>
                              ))}

                              <button
                                type="button"
                                onClick={() => setProposalReasonsWhy(prev => [
                                  ...prev,
                                  { id: Date.now().toString(), title: "Your Gentle Kindness", desc: "The pure empathy and kindness you share with everyone around you." }
                                ])}
                                className="w-full py-2.5 rounded-xl border border-dashed border-rose-500/40 hover:bg-rose-500/10 text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                + Add Another Reason
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 4. SECRET WHISPERS TAB */}
                      {activeKeepsakeTab === "whispers" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/40 border border-rose-500/30">
                            <div>
                              <span className="text-xs font-bold text-rose-100 block">Include 'Whispers in the Night'</span>
                              <span className="text-[11px] text-slate-400 block">Wax-sealed 3D flipping parchment cards that reveal intimate private letters.</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={form.proposalEnableWhispers ?? true}
                              onChange={(e) => updateForm("proposalEnableWhispers", e.target.checked)}
                              className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                            />
                          </div>

                          {form.proposalEnableWhispers !== false && (
                            <div className="space-y-2.5">
                              <p className="text-[11px] text-amber-300/90 font-mono">
                                💡 Tip: When tapped on the website, these cards flip over in 3D to reveal your heartfelt words.
                              </p>

                              {proposalWhispers.map((item, idx) => (
                                <div key={item.id} className="p-3 rounded-xl bg-zinc-900/80 border border-white/10 space-y-2 relative group">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">Secret Card #{idx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => setProposalWhispers(prev => prev.filter(w => w.id !== item.id))}
                                      className="text-[11px] text-red-400 hover:text-red-300 font-bold px-2 py-0.5 rounded-md hover:bg-red-500/10 cursor-pointer"
                                    >
                                      🗑️ Remove
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Card Header (e.g. On Difficult Days / The Moment I Knew)"
                                    value={item.title}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setProposalWhispers(prev => prev.map(w => w.id === item.id ? { ...w, title: val } : w));
                                    }}
                                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Front Preview Teaser (e.g. When the weight of the world feels heavy...)"
                                    value={item.preview}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setProposalWhispers(prev => prev.map(w => w.id === item.id ? { ...w, preview: val } : w));
                                    }}
                                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none"
                                  />
                                  <textarea
                                    rows={3}
                                    placeholder="Secret Letter on Back (e.g. Remember that you never have to carry anything alone. My heart is yours.)"
                                    value={item.letter}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setProposalWhispers(prev => prev.map(w => w.id === item.id ? { ...w, letter: val } : w));
                                    }}
                                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none resize-none font-sans"
                                  />
                                </div>
                              ))}

                              <button
                                type="button"
                                onClick={() => setProposalWhispers(prev => [
                                  ...prev,
                                  { id: Date.now().toString(), title: "Why I Choose You", preview: "Every single day without hesitation...", letter: "Because loving you is the easiest and most beautiful truth of my life." }
                                ])}
                                className="w-full py-2.5 rounded-xl border border-dashed border-rose-500/40 hover:bg-rose-500/10 text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                + Add Another Secret Flip Card
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 5. BUCKET LIST TAB */}
                      {activeKeepsakeTab === "bucket" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/40 border border-rose-500/30">
                            <div>
                              <span className="text-xs font-bold text-rose-100 block">Include 'Our Forever Bucket List'</span>
                              <span className="text-[11px] text-slate-400 block">Interactive checklist of romantic future milestones to check off together.</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={form.proposalEnableBucketList ?? true}
                              onChange={(e) => updateForm("proposalEnableBucketList", e.target.checked)}
                              className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                            />
                          </div>

                          {form.proposalEnableBucketList !== false && (
                            <div className="space-y-2.5">
                              <p className="text-[11px] text-amber-300/90 font-mono">
                                💡 Tip: Add dreams you want to conquer together (stargazing, road trips, slow dancing in the rain).
                              </p>

                              {proposalBucketList.map((item, idx) => (
                                <div key={item.id} className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center gap-2">
                                  <span className="text-xs text-rose-300 font-bold px-1">{idx + 1}.</span>
                                  <input
                                    type="text"
                                    placeholder="Bucket item (e.g. Slow dance barefoot in the warm summer rain)"
                                    value={item.text}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setProposalBucketList(prev => prev.map(b => b.id === item.id ? { ...b, text: val } : b));
                                    }}
                                    className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setProposalBucketList(prev => prev.filter(b => b.id !== item.id))}
                                    className="text-[11px] text-red-400 hover:text-red-300 font-bold px-2 py-1 rounded-md hover:bg-red-500/10 cursor-pointer"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              ))}

                              <button
                                type="button"
                                onClick={() => setProposalBucketList(prev => [
                                  ...prev,
                                  { id: Date.now().toString(), text: "Grow old together and still look at each other with stars in our eyes" }
                                ])}
                                className="w-full py-2.5 rounded-xl border border-dashed border-rose-500/40 hover:bg-rose-500/10 text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                + Add Bucket List Item
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 6. LOVE QUIZ TAB */}
                      {activeKeepsakeTab === "quiz" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/40 border border-rose-500/30">
                            <div>
                              <span className="text-xs font-bold text-rose-100 block">Include 'Our Little Love Quiz'</span>
                              <span className="text-[11px] text-slate-400 block">Playful couple's trivia questions with instant confetti & sparkling celebrations.</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={form.proposalEnableQuiz ?? true}
                              onChange={(e) => updateForm("proposalEnableQuiz", e.target.checked)}
                              className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                            />
                          </div>

                          {form.proposalEnableQuiz !== false && (
                            <div className="space-y-2.5">
                              {proposalQuiz.map((item, qIdx) => (
                                <div key={item.id} className="p-3 rounded-xl bg-zinc-900/80 border border-white/10 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">Question #{qIdx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => setProposalQuiz(prev => prev.filter(q => q.id !== item.id))}
                                      className="text-[11px] text-red-400 hover:text-red-300 font-bold px-2 py-0.5 rounded-md hover:bg-red-500/10 cursor-pointer"
                                    >
                                      🗑️ Remove
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Question prompt (e.g. What makes our connection feel so rare?)"
                                    value={item.q}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setProposalQuiz(prev => prev.map(q => q.id === item.id ? { ...q, q: val } : q));
                                    }}
                                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none"
                                  />
                                  <div className="grid grid-cols-2 gap-1.5">
                                    {item.options.map((opt, oIdx) => (
                                      <input
                                        key={oIdx}
                                        type="text"
                                        placeholder={`Option ${oIdx + 1}`}
                                        value={opt}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setProposalQuiz(prev => prev.map(q => {
                                            if (q.id !== item.id) return q;
                                            const newOpts = [...q.options];
                                            newOpts[oIdx] = val;
                                            return { ...q, options: newOpts };
                                          }));
                                        }}
                                        className="px-2.5 py-1.5 rounded-lg text-[11px] bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none"
                                      />
                                    ))}
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Celebration message (e.g. Exactly! Every single piece of us is magic! ✨)"
                                    value={item.celebration}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setProposalQuiz(prev => prev.map(q => q.id === item.id ? { ...q, celebration: val } : q));
                                    }}
                                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-amber-200 focus:border-rose-400 outline-none"
                                  />
                                </div>
                              ))}

                              <button
                                type="button"
                                onClick={() => setProposalQuiz(prev => [
                                  ...prev,
                                  {
                                    id: Date.now().toString(),
                                    q: "How long will I love and cherish you?",
                                    options: ["Through every tomorrow", "Past the stars", "For a thousand lifetimes", "Forever and always 💍"],
                                    celebration: "Forever and always! My heart is completely yours. 💖"
                                  }
                                ])}
                                className="w-full py-2.5 rounded-xl border border-dashed border-rose-500/40 hover:bg-rose-500/10 text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                + Add Another Quiz Question
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 7. CONSTELLATION TAB */}
                      {activeKeepsakeTab === "constellation" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/40 border border-rose-500/30">
                            <div>
                              <span className="text-xs font-bold text-rose-100 block">Include Celestial Constellation Map</span>
                              <span className="text-[11px] text-slate-400 block">Interactive glowing star nodes illustrating your unique cosmic alignment.</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={form.proposalEnableConstellation ?? true}
                              onChange={(e) => updateForm("proposalEnableConstellation", e.target.checked)}
                              className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                            />
                          </div>

                          {form.proposalEnableConstellation !== false && (
                            <div className="space-y-2.5">
                              {proposalConstellation.map((item, idx) => (
                                <div key={item.id} className="p-3 rounded-xl bg-zinc-900/80 border border-white/10 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">Star Node #{idx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => setProposalConstellation(prev => prev.filter(c => c.id !== item.id))}
                                      className="text-[11px] text-red-400 hover:text-red-300 font-bold px-2 py-0.5 rounded-md hover:bg-red-500/10 cursor-pointer"
                                    >
                                      🗑️ Remove
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      placeholder="Star Node Title (e.g. The First Spark)"
                                      value={item.title}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setProposalConstellation(prev => prev.map(c => c.id === item.id ? { ...c, title: val } : c));
                                      }}
                                      className="px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Subtitle (e.g. Where our paths aligned)"
                                      value={item.subtitle}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setProposalConstellation(prev => prev.map(c => c.id === item.id ? { ...c, subtitle: val } : c));
                                      }}
                                      className="px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none"
                                    />
                                  </div>
                                  <textarea
                                    rows={2}
                                    placeholder="Cosmic Quote (e.g. Among billions of people on this planet, our orbits crossed in the most breathtaking way.)"
                                    value={item.quote}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setProposalConstellation(prev => prev.map(c => c.id === item.id ? { ...c, quote: val } : c));
                                    }}
                                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none resize-none font-sans"
                                  />
                                </div>
                              ))}

                              <button
                                type="button"
                                onClick={() => setProposalConstellation(prev => [
                                  ...prev,
                                  { id: Date.now().toString(), title: "The Eternal Orbit", subtitle: "Written in the Stars", quote: "A love that was destined before time began." }
                                ])}
                                className="w-full py-2.5 rounded-xl border border-dashed border-rose-500/40 hover:bg-rose-500/10 text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                + Add Star Node
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 8. MEMORY KEEPSAKES TAB */}
                      {activeKeepsakeTab === "memory" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/40 border border-rose-500/30">
                            <div>
                              <span className="text-xs font-bold text-rose-100 block">Include Memory Keepsakes Vault</span>
                              <span className="text-[11px] text-slate-400 block">Vintage Polaroid style frames showcasing shared memory chapters.</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={form.proposalEnableMemoryVault ?? true}
                              onChange={(e) => updateForm("proposalEnableMemoryVault", e.target.checked)}
                              className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                            />
                          </div>

                          {form.proposalEnableMemoryVault !== false && (
                            <div className="space-y-2.5">
                              {proposalMemoryVault.map((item, idx) => (
                                <div key={item.id} className="p-3 rounded-xl bg-zinc-900/80 border border-white/10 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">Memory Frame #{idx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => setProposalMemoryVault(prev => prev.filter(m => m.id !== item.id))}
                                      className="text-[11px] text-red-400 hover:text-red-300 font-bold px-2 py-0.5 rounded-md hover:bg-red-500/10 cursor-pointer"
                                    >
                                      🗑️ Remove
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2">
                                    <input
                                      type="text"
                                      placeholder="Tag (e.g. Day One / Late Nights)"
                                      value={item.tag}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setProposalMemoryVault(prev => prev.map(m => m.id === item.id ? { ...m, tag: val } : m));
                                      }}
                                      className="col-span-1 px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Title (e.g. The First Smile)"
                                      value={item.title}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setProposalMemoryVault(prev => prev.map(m => m.id === item.id ? { ...m, title: val } : m));
                                      }}
                                      className="col-span-2 px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none"
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Memory note (e.g. When an ordinary day turned into the start of forever.)"
                                    value={item.desc}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setProposalMemoryVault(prev => prev.map(m => m.id === item.id ? { ...m, desc: val } : m));
                                    }}
                                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-black/60 border border-white/10 text-white focus:border-rose-400 outline-none"
                                  />
                                </div>
                              ))}

                              <button
                                type="button"
                                onClick={() => setProposalMemoryVault(prev => [
                                  ...prev,
                                  { id: Date.now().toString(), tag: "Shared Dreams", title: "Quiet Moments Together", desc: "Sitting beside you in comfortable silence, knowing you are my home." }
                                ])}
                                className="w-full py-2.5 rounded-xl border border-dashed border-rose-500/40 hover:bg-rose-500/10 text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                + Add Memory Frame
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 9. WISHING WELL TAB */}
                      {activeKeepsakeTab === "wishing" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30">
                            <div>
                              <span className="text-xs font-bold text-rose-100 block">🌙 Midnight Wishing Well</span>
                              <span className="text-[11px] text-slate-400 block">An interactive full-moon button allowing them to make a silent wish under the stars.</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={form.proposalEnableWishingWell ?? true}
                              onChange={(e) => updateForm("proposalEnableWishingWell", e.target.checked)}
                              className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                            />
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                            When enabled, this displays a romantic moonlit well near the end of the website. Your partner can tap to make a secret wish with shooting stardust animations.
                          </p>
                        </div>
                      )}

                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1 font-medium">{error}</p>}

                    <div className="pt-2 flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-5 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all text-xs font-mono uppercase"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 text-white font-black transition-all shadow-xl shadow-rose-950/40 font-mono text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        Next: Soundtrack & Launch <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 🌹 ROMANTIC PROPOSAL STEP 5: SOUNDTRACK & CELEBRATION LAUNCH */}
                {step === 405 && (
                  <motion.div
                    key="proposalStep5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] font-bold text-rose-300 uppercase tracking-widest">
                        🌹 Proposal Wizard • Step 5 of 5
                      </div>
                      <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        Romantic Soundtrack & Celebration 🎵
                      </h2>
                      <p className="text-xs text-slate-400">
                        Add your romantic song link and optional celebration date.
                      </p>
                    </div>

                    <div className="space-y-4 my-auto text-left">
                      {/* YouTube Link Input */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-rose-300 uppercase tracking-wider">YouTube Romantic Song Link</label>
                        <input
                          type="url"
                          placeholder="https://www.youtube.com/watch?v=HexFqifusOk"
                          value={form.youtubeUrl || ""}
                          onChange={(e) => updateForm("youtubeUrl", e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl bg-black/60 border border-white/10 focus:border-rose-400 outline-none text-white text-xs placeholder:text-zinc-600 transition-colors"
                        />
                        <p className="text-[11px] text-slate-500">
                          Plays automatically upon wax seal opening (with built-in acoustic harp fallback).
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Song Display Title (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Can't Help Falling in Love / Perfect"
                          value={form.songName || ""}
                          onChange={(e) => updateForm("songName", e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl text-white glass-input text-xs"
                        />
                      </div>

                      {/* Celebration Date (Optional) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300 uppercase">Celebration Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Our Celebration Dinner 🥂"
                            value={form.proposalCelebrationDateTitle || ""}
                            onChange={(e) => updateForm("proposalCelebrationDateTitle", e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl text-white glass-input text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300 uppercase">Celebration Time & Place</label>
                          <input
                            type="text"
                            placeholder="e.g. This Saturday at Sunset • Rooftop"
                            value={form.proposalCelebrationDateTime || ""}
                            onChange={(e) => updateForm("proposalCelebrationDateTime", e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl text-white glass-input text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5">{error}</p>}

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all text-xs font-mono uppercase"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
                      </button>
                      <button
                        onClick={() => handleSubmit()}
                        disabled={loading}
                        className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 text-white font-black transition-all shadow-xl shadow-rose-950/40 font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Generate Romantic Proposal Website 🌹💍</>}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 0: Occasion Picker */}
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center space-y-1.5 sm:space-y-2">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
                        Create Memory Vibe <Sparkles className="w-5 h-5 text-amber-400" />
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400">
                        Choose the occasion. We'll generate an interactive multi-slide slideshow tailored to them.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2.5 sm:gap-3 my-auto">
                      {occasionOptions.map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              if (form.occasion !== opt.value) {
                                updateForm("occasion", opt.value);
                                setWeddingEvents([]);
                              }
                            }}
                            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left border flex items-start gap-3 sm:gap-4 transition-all cursor-pointer ${
                              form.occasion === opt.value
                                ? "bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border-amber-500/60 text-amber-200 shadow-xl shadow-amber-950/40 ring-1 ring-amber-500/40 scale-[1.01]"
                                : "bg-white/4 border-white/8 text-slate-400 hover:bg-white/8 hover:text-white"
                            }`}
                          >
                            <div className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0 transition-colors ${
                              form.occasion === opt.value ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-white/5 text-slate-400"
                            }`}>
                              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="space-y-0.5">
                              <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                                {opt.title} <span className="text-xs sm:text-sm">{opt.emoji}</span>
                              </div>
                              <p className="text-[11px] sm:text-xs text-slate-400 leading-normal">
                                {opt.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {error && <p className="text-xs sm:text-sm text-red-400 font-mono mt-1.5 font-medium">{error}</p>}

                    <div className="pt-3 sm:pt-4 flex items-center justify-between gap-3">
                      <button
                        onClick={() => resetForm(-1)}
                        className="px-4 sm:px-6 py-3.5 rounded-xl sm:rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" /> Home
                      </button>
                      <button
                        onClick={nextStep}
                        className="flex-1 sm:flex-initial px-8 py-3.5 rounded-xl sm:rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Let's Begin <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 1: Names */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        Relational Names <User className="w-5 h-5 text-amber-400" />
                      </h2>
                      <p className="text-sm text-slate-400">
                        Who is generating this memory page, and who is receiving it?
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Your Name</label>
                        <input
                          type="text"
                          placeholder="E.g. Rahul / Alex"
                          value={form.creatorName}
                          onChange={(e) => updateForm("creatorName", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Their Name</label>
                        <input
                          type="text"
                          placeholder="E.g. Priya / Sarah"
                          value={form.recipientName}
                          onChange={(e) => updateForm("recipientName", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input"
                        />
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5 font-medium">{error}</p>}

                    <div className="pt-6 flex justify-between border-t border-zinc-900 mt-6">
                      <button onClick={prevStep} className="px-5 py-3 rounded-lg border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button onClick={nextStep} className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-950/30">
                        Next Step <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Relationship */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <h2 className="text-2xl font-extrabold text-white">Your Connection</h2>
                      <p className="text-sm text-slate-400">What is your relationship to {form.recipientName || "them"}?</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-auto">
                      {relationshipOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateForm("relationshipType", opt.value)}
                          className={`px-3 py-3 rounded-xl text-xs font-semibold border transition-all ${
                            form.relationshipType === opt.value
                              ? "bg-amber-500/10 border-amber-500/60 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.15)] shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                              : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    <div className="pt-6 flex justify-between border-t border-zinc-900 mt-6">
                      <button onClick={prevStep} className="px-5 py-3 rounded-lg border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button onClick={nextStep} className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-950/30">
                        Next Step <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Obsessions */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <h2 className="text-2xl font-extrabold text-white">Their Obsessions</h2>
                      <p className="text-sm text-slate-400">What are they completely obsessed with? We'll weave this into the layout metaphors.</p>
                    </div>

                    <div className="space-y-2 my-auto">
                      <label className="text-xs font-semibold text-slate-300 uppercase">Obsessions / Fanbase / Topics</label>
                      <input
                        type="text"
                        placeholder="E.g. FIFA, F1, LeetCode, mechanical keyboards, MCU..."
                        value={form.obsessions}
                        onChange={(e) => updateForm("obsessions", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-white glass-input"
                      />
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5 font-medium">{error}</p>}

                    <div className="pt-6 flex justify-between border-t border-zinc-900 mt-6">
                      <button onClick={prevStep} className="px-5 py-3 rounded-lg border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button onClick={nextStep} className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-950/30">
                        Next Step <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Personality */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <h2 className="text-2xl font-extrabold text-white">Their Personality</h2>
                      <p className="text-sm text-slate-400">Describe their personality or vibe in one honest sentence.</p>
                    </div>

                    <div className="space-y-2 my-auto">
                      <label className="text-xs font-semibold text-slate-300 uppercase">One-Sentence Summary</label>
                      <textarea
                        placeholder="E.g. Has 47 tabs open at all times, drinks cold brew like water, but always shows up when it matters."
                        value={form.personality}
                        onChange={(e) => updateForm("personality", e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl text-white glass-input resize-none"
                      />
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5 font-medium">{error}</p>}

                    <div className="pt-6 flex justify-between border-t border-zinc-900 mt-6">
                      <button onClick={prevStep} className="px-5 py-3 rounded-lg border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button onClick={nextStep} className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-950/30">
                        Next Step <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Three Inside Moments */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-1">
                      <h2 className="text-2xl font-extrabold text-white">Three Shared Moments</h2>
                      <p className="text-xs text-slate-400">Inside moments or jokes that only you two understand.</p>
                    </div>

                    <div className="space-y-2.5 my-auto">
                      <input
                        type="text"
                        placeholder="Moment 1: E.g. The 2AM debugging session that saved the build"
                        value={form.moment1}
                        onChange={(e) => updateForm("moment1", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-white text-xs glass-input"
                      />
                      <input
                        type="text"
                        placeholder="Moment 2: E.g. Missing our flight because you spent 30 minutes picking snacks"
                        value={form.moment2}
                        onChange={(e) => updateForm("moment2", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-white text-xs glass-input"
                      />
                      <input
                        type="text"
                        placeholder="Moment 3: E.g. The late night drive listening to Clair de Lune"
                        value={form.moment3}
                        onChange={(e) => updateForm("moment3", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-white text-xs glass-input"
                      />
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5 font-medium">{error}</p>}

                    <div className="pt-6 flex justify-between border-t border-zinc-900 mt-6">
                      <button onClick={prevStep} className="px-5 py-3 rounded-lg border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button onClick={nextStep} className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-950/30">
                        Next Step <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 6: First Memory */}
                {step === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <h2 className="text-2xl font-extrabold text-white">Your First Memory</h2>
                      <p className="text-sm text-slate-400">What is your absolute first memory of them? (E.g. standing by the locker, a shared seminar class...)</p>
                    </div>

                    <div className="space-y-2 my-auto">
                      <label className="text-xs font-semibold text-slate-300 uppercase">First Memory</label>
                      <textarea
                        placeholder="E.g. You were wearing a retro band tee, passionately explaining why star wars sequels are trash..."
                        value={form.firstMemory}
                        onChange={(e) => updateForm("firstMemory", e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl text-white glass-input resize-none animate-pulse-slow"
                      />
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5 font-medium">{error}</p>}

                    <div className="pt-6 flex justify-between border-t border-zinc-900 mt-6">
                      <button onClick={prevStep} className="px-5 py-3 rounded-lg border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button onClick={nextStep} className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-950/30">
                        Next Step <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 7: Quiet Notices */}
                {step === 7 && (
                  <motion.div
                    key="step7"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <h2 className="text-2xl font-extrabold text-white">Things You Notice</h2>
                      <p className="text-sm text-slate-400">What are the small quirks, details, or things you quietly notice about them?</p>
                    </div>

                    <div className="space-y-2 my-auto">
                      <label className="text-xs font-semibold text-slate-300 uppercase">Small Details</label>
                      <textarea
                        placeholder="E.g. How you check your git commits 3 times before pushing, and how you go quiet when you are tired..."
                        value={form.smallNotices}
                        onChange={(e) => updateForm("smallNotices", e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl text-white glass-input resize-none"
                      />
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5 font-medium">{error}</p>}

                    <div className="pt-6 flex justify-between border-t border-zinc-900 mt-6">
                      <button onClick={prevStep} className="px-5 py-3 rounded-lg border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button onClick={nextStep} className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-950/30">
                        Next Step <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 8: Narrative Context */}
                {step === 8 && (
                  <motion.div
                    key="step8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <h2 className="text-2xl font-extrabold text-white">
                        {form.occasion === "apology" ? "What are you sorry for?" : "What do you want to say?"}
                      </h2>
                      <p className="text-sm text-slate-400">
                        {form.occasion === "apology"
                          ? "Write what occurred and why you are sorry. The AI will weave it into a sincere note."
                          : "Write details of your greeting, celebration, or what you appreciate most about them."}
                      </p>
                    </div>

                    <div className="space-y-2 my-auto">
                      <label className="text-xs font-semibold text-slate-300 uppercase">Context Details</label>
                      <textarea
                        placeholder={
                          form.occasion === "apology"
                            ? "E.g. I ignored your messages while debugging an infinite loop and made you feel sidelined..."
                            : "E.g. I appreciate how you always check on me when I have a busy week..."
                        }
                        value={form.reason}
                        onChange={(e) => updateForm("reason", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl text-white glass-input resize-none"
                      />
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5 font-medium">{error}</p>}

                    <div className="pt-6 flex justify-between border-t border-zinc-900 mt-6">
                      <button onClick={prevStep} className="px-5 py-3 rounded-lg border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button onClick={nextStep} className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-950/30">
                        Next Step <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 9: Unspoken Truth */}
                {step === 9 && (
                  <motion.div
                    key="step9"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <h2 className="text-2xl font-extrabold text-white">Unspoken Truth</h2>
                      <p className="text-sm text-slate-400">Share one thing you've never said directly to them. This serves as the emotional peak of the letter.</p>
                    </div>

                    <div className="space-y-2 my-auto">
                      <label className="text-xs font-semibold text-slate-300 uppercase">One Unspoken Thing</label>
                      <input
                        type="text"
                        placeholder="E.g. I'm genuinely terrified of losing you, even if I act chill."
                        value={form.unspokenTruth}
                        onChange={(e) => updateForm("unspokenTruth", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-white glass-input"
                      />
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5 font-medium">{error}</p>}

                    <div className="pt-6 flex justify-between border-t border-zinc-900 mt-6">
                      <button onClick={prevStep} className="px-5 py-3 rounded-lg border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button onClick={nextStep} className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-950/30">
                        Next Step <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 10: Song Selection */}
                {step === 10 && (
                  <motion.div
                    key="step10"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <h2 className="text-2xl font-extrabold text-white">Favorite Song 🎵</h2>
                      <p className="text-sm text-slate-400">
                        Add a soundtrack to your website! It will play automatically when they open their letter.
                      </p>
                    </div>

                    <div className="space-y-4 my-auto text-left max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest block">YouTube Link (Or Video ID)</label>
                        <input
                          type="text"
                          placeholder="E.g. https://www.youtube.com/watch?v=2Vv-BfVoq4g"
                          value={form.youtubeUrl}
                          onChange={(e) => updateForm("youtubeUrl", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-white glass-input font-mono text-xs"
                        />
                      </div>

                      {/* How to find link guide */}
                      <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-white/5 space-y-2 text-[10px]">
                        <span className="font-bold text-slate-200 uppercase tracking-wider block">📋 How to find the correct link:</span>
                        <ul className="list-decimal pl-4 space-y-1 text-slate-400 font-sans">
                          <li>Open **YouTube** on your device.</li>
                          <li>Search for the song, cover version, or ambient music track you want.</li>
                          <li>Copy the URL from the browser address bar (or click **Share** &rarr; **Copy Link**).</li>
                          <li>Paste that copied link directly into the input field above.</li>
                        </ul>
                      </div>

                      {/* Warning block */}
                      <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[10px] space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider">
                          <span className="text-xs">⚠️</span>
                          <span>Playback Warning</span>
                        </div>
                        <p className="text-slate-350 leading-relaxed font-sans font-light">
                          Please ensure the link is a valid YouTube video. If you enter an incorrect, private, or restricted link, the music will fail to load and the song **will not play** on the published page.
                        </p>
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5 font-medium">{error}</p>}

                    <div className="pt-6 flex justify-between border-t border-zinc-900 mt-6">
                      <button onClick={prevStep} className="px-5 py-3 rounded-lg border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button onClick={nextStep} className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-950/30">
                        Next Step <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 11: Compliment Stars Toggle */}
                {step === 11 && (
                  <motion.div
                    key="step11"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <h2 className="text-2xl font-extrabold text-white">Stardust Secrets 🌌</h2>
                      <p className="text-sm text-slate-400">
                        Would you like to hide 5 secret compliments in the night sky? Your partner will click on glowing stars to reveal them.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 my-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, complimentsEnabled: true }));
                          setStep(12);
                        }}
                        className="w-full p-4 rounded-xl border border-zinc-800 hover:border-blue-500/40 bg-white/5 hover:bg-blue-650/5 text-left transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-white uppercase group-hover:text-blue-300">Yes, Hide 5 secret stars ⭐</span>
                          <p className="text-[10px] text-slate-500">Write 5 reasons why you appreciate or love them.</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-all" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, complimentsEnabled: false }));
                          setStep(13); // Skip to Aesthetic Design Studio
                        }}
                        className="w-full p-4 rounded-xl border border-zinc-800 hover:border-pink-500/40 bg-white/5 hover:bg-pink-600/5 text-left transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-white uppercase group-hover:text-pink-300">No, Skip compliments ⏭️</span>
                          <p className="text-[10px] text-slate-500">Proceed directly to aesthetics and final surprise.</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-all" />
                      </button>
                    </div>

                    <div className="pt-6 flex justify-between border-t border-zinc-900 mt-6">
                      <button onClick={prevStep} className="px-5 py-3 rounded-lg border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <div />
                    </div>
                  </motion.div>
                )}

                {/* Step 12: Compliments Star Questionnaire */}
                {step === 12 && (
                  <motion.div
                    key="step12"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-1.5">
                      <h2 className="text-2xl font-extrabold text-white">Hide 5 Stardust Secrets ✍️</h2>
                      <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-sans font-light">
                        Write 5 heartfelt reasons, memories, or cute inside jokes. These will be hidden inside glowing, interactive stars in the night sky. The recipient will see a beautiful stardust map and can click each star to unveil your secret stardust messages!
                      </p>
                    </div>

                    <div className="space-y-4 my-auto max-h-[220px] overflow-y-auto pr-1">
                      {/* Compliment 1 */}
                      <div className="space-y-1 text-left border-l-2 border-purple-500/20 pl-3">
                        <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest block">Star #1</span>
                        <input
                          type="text"
                          placeholder="Title (e.g. My Cousins Beach Infinity)"
                          value={form.compliment1_title}
                          onChange={(e) => updateForm("compliment1_title", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg text-white text-[11px] glass-input"
                        />
                        <textarea
                          placeholder="Secret message..."
                          value={form.compliment1_text}
                          onChange={(e) => updateForm("compliment1_text", e.target.value)}
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg text-white text-[11px] glass-input resize-none mt-1"
                        />
                      </div>

                      {/* Compliment 2 */}
                      <div className="space-y-1 text-left border-l-2 border-purple-500/20 pl-3">
                        <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest block">Star #2</span>
                        <input
                          type="text"
                          placeholder="Title (e.g. The Cutest Laughter)"
                          value={form.compliment2_title}
                          onChange={(e) => updateForm("compliment2_title", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg text-white text-[11px] glass-input"
                        />
                        <textarea
                          placeholder="Secret message..."
                          value={form.compliment2_text}
                          onChange={(e) => updateForm("compliment2_text", e.target.value)}
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg text-white text-[11px] glass-input resize-none mt-1"
                        />
                      </div>

                      {/* Compliment 3 */}
                      <div className="space-y-1 text-left border-l-2 border-purple-500/20 pl-3">
                        <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest block">Star #3</span>
                        <input
                          type="text"
                          placeholder="Title (e.g. Starry Constellation)"
                          value={form.compliment3_title}
                          onChange={(e) => updateForm("compliment3_title", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg text-white text-[11px] glass-input"
                        />
                        <textarea
                          placeholder="Secret message..."
                          value={form.compliment3_text}
                          onChange={(e) => updateForm("compliment3_text", e.target.value)}
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg text-white text-[11px] glass-input resize-none mt-1"
                        />
                      </div>

                      {/* Compliment 4 */}
                      <div className="space-y-1 text-left border-l-2 border-purple-500/20 pl-3">
                        <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest block">Star #4</span>
                        <input
                          type="text"
                          placeholder="Title (e.g. The Promise)"
                          value={form.compliment4_title}
                          onChange={(e) => updateForm("compliment4_title", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg text-white text-[11px] glass-input"
                        />
                        <textarea
                          placeholder="Secret message..."
                          value={form.compliment4_text}
                          onChange={(e) => updateForm("compliment4_text", e.target.value)}
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg text-white text-[11px] glass-input resize-none mt-1"
                        />
                      </div>

                      {/* Compliment 5 */}
                      <div className="space-y-1 text-left border-l-2 border-purple-500/20 pl-3">
                        <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest block">Star #5</span>
                        <input
                          type="text"
                          placeholder="Title (e.g. Sweetest Heart)"
                          value={form.compliment5_title}
                          onChange={(e) => updateForm("compliment5_title", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg text-white text-[11px] glass-input"
                        />
                        <textarea
                          placeholder="Secret message..."
                          value={form.compliment5_text}
                          onChange={(e) => updateForm("compliment5_text", e.target.value)}
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg text-white text-[11px] glass-input resize-none mt-1"
                        />
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5 font-medium">{error}</p>}

                    <div className="pt-6 flex justify-between border-t border-zinc-900 mt-6">
                      <button onClick={prevStep} className="px-5 py-3 rounded-lg border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button onClick={nextStep} className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-950/30">
                        Next Step <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 13: Aesthetic Design Studio */}
                {step === 13 && (
                  <motion.div
                    key="step13"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col justify-between space-y-4"
                  >
                    <div className="text-center sm:text-left space-y-1">
                      <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        Aesthetic Design Studio 🎨
                      </h2>
                      <p className="text-xs text-slate-400">
                        Design the visual style of your website. Choose custom colors, fonts, and animated backdrops.
                      </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 my-auto items-stretch justify-center">
                      
                      {/* Left Control Panel */}
                      <div className="flex-1 space-y-4 max-h-[380px] overflow-y-auto pr-1 text-left custom-scrollbar">
                        
                        {/* 1. Color Palette */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">1. Color Palette</label>
                          <input
                            type="text"
                            placeholder="E.g. neon pink, sky blue, gold, custom tones..."
                            value={form.favoriteColors}
                            onChange={(e) => {
                              updateForm("favoriteColors", e.target.value);
                              updateForm("selectedColorPreset", "");
                            }}
                            className="w-full px-4 py-2.5 rounded-xl text-white text-xs bg-zinc-950/60 border border-white/10 outline-none focus:border-purple-500 transition-all font-sans"
                          />
                          <div className="grid grid-cols-2 gap-1.5 mt-2">
                            {[
                              { name: "Sakura Dream 🌸", value: "Sakura pink, soft violet, pastel lavender", bg: "sakura" },
                              { name: "Cozy Ocean Rain ☔", value: "Bright teal, sky blue, aquamarine", bg: "raindrops" },
                              { name: "Golden Lanterns 🏮", value: "Marigold yellow, warm amber, soft gold", bg: "lanterns" },
                              { name: "Midnight Stardust 🌌", value: "Luminous gold, stardust silver, nebula purple", bg: "particles" },
                              { name: "Warm Candlelight 🕯️", value: "Warm yellow, flicker amber, flame gold", bg: "candlelight" },
                              { name: "Fairy Forest Fireflies 🧚", value: "Lime mint, neon green, emerald", bg: "fireflies" },
                              { name: "Celestial Linker ☄️", value: "Neon cyan, star silver, cosmic white", bg: "constellations" },
                              { name: "Cosmic Aurora 🔮", value: "Shifting violet, neon pink, aurora green", bg: "aurora" }
                            ].map((opt) => (
                              <button
                                key={opt.name}
                                type="button"
                                onClick={() => {
                                  updateForm("favoriteColors", opt.value);
                                  updateForm("selectedColorPreset", opt.bg);
                                }}
                                className={`px-2.5 py-1.5 rounded-lg border text-[9px] font-medium transition-all text-left flex flex-col cursor-pointer ${
                                  form.selectedColorPreset === opt.bg
                                    ? "bg-amber-500/10 border-amber-500/60 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.15)] shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                                    : "border-white/5 bg-zinc-950/40 hover:bg-white/5 text-slate-350"
                                }`}
                              >
                                <span className="font-bold leading-none block">{opt.name}</span>
                                <span className="text-[7.5px] text-slate-500 mt-0.5 truncate block">{opt.value}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 2. Typography Vibe */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">2. Typography Vibe</label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {[
                              { value: "classic", label: "Classic Elegant", fontClass: "font-serif-elegant italic text-[10px]" },
                              { value: "modern", label: "Clean Modern", fontClass: "font-sans-modern font-bold tracking-tight uppercase text-[9px]" },
                              { value: "retro", label: "Retro Typewriter", fontClass: "font-mono-retro font-bold text-[9px]" },
                              { value: "handwritten", label: "Cozy Handwritten", fontClass: "font-handwritten text-[11px] font-bold" }
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => updateForm("fontStyle", opt.value)}
                                className={`p-2 rounded-xl text-left border flex flex-col justify-between transition-all cursor-pointer ${
                                  form.fontStyle === opt.value
                                    ? "bg-amber-500/10 border-amber-500/60 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.15)] shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                                    : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/8"
                                }`}
                              >
                                <span className="text-[9px] font-bold text-white block">{opt.label}</span>
                                <span className={`text-[8.5px] text-slate-500 mt-1 block truncate ${opt.fontClass}`}>Love Letters</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 3. Backdrop Theme */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">3. Backdrop Theme</label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {[
                              { value: "aurora", emoji: "🌌", label: "Cosmic Aurora" },
                              { value: "sakura", emoji: "🌸", label: "Sakura Petals" },
                              { value: "particles", emoji: "💖", label: "Romantic Stardust" },
                              { value: "lanterns", emoji: "🏮", label: "Floating Lanterns" },
                              { value: "raindrops", emoji: "🌧️", label: "Raindrops on Glass" },
                              { value: "constellations", emoji: "✨", label: "Constellations" },
                              { value: "candlelight", emoji: "🕯", label: "Candlelight Glow" },
                              { value: "fireflies", emoji: "🧚", label: "Forest Fireflies" }
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => updateForm("backgroundType", opt.value)}
                                className={`p-2 rounded-xl text-left border flex gap-2 items-center transition-all cursor-pointer relative ${
                                  form.backgroundType === opt.value
                                    ? "bg-amber-500/10 border-amber-500/60 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                                    : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/8"
                                }`}
                              >
                                <span className="text-sm">{opt.emoji}</span>
                                <div className="flex-1 text-left min-w-0">
                                  <span className="text-[9px] font-bold text-white block truncate">{opt.label}</span>
                                  {opt.value === getRecommendedBackground() && (
                                    <span className="text-[7px] text-blue-300 font-extrabold uppercase animate-pulse leading-none block mt-0.5">Recommended</span>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Suggestion Card */}
                        <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-900/25 text-left space-y-1 backdrop-blur-sm">
                          <div className="flex items-center gap-1 text-blue-300">
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">Aesthetic Suggestion</span>
                          </div>
                          <p className="text-[9.5px] text-slate-350 leading-relaxed font-sans font-light">
                            {getRecommendationExplanation()}
                          </p>
                        </div>

                      </div>

                      {/* Right Preview Panel: Large Mobile Mockup */}
                      <div className="hidden md:flex flex-col items-center justify-center bg-zinc-950/40 border border-white/5 rounded-3xl p-5 w-[280px] shrink-0 backdrop-blur-sm">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Live Design Preview</span>
                        
                        {/* Phone Container */}
                        <div className="w-[220px] h-[340px] rounded-[32px] border-[5px] border-zinc-800 bg-black relative overflow-hidden shadow-2xl flex flex-col justify-between p-3.5 select-none">
                          
                          {/* Background visuals rendering in preview mockup */}
                          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                            {form.backgroundType === "particles" && (
                              <div className="absolute inset-0 bg-[#090514]">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.15),transparent_70%)]" />
                                {Array.from({ length: 8 }).map((_, i) => (
                                  <div
                                    key={`preview-star-${i}`}
                                    className="absolute rounded-full bg-white opacity-40 animate-pulse"
                                    style={{
                                      width: `${2 + (i % 2)}px`,
                                      height: `${2 + (i % 2)}px`,
                                      left: `${`${((i * 17) % 85) + 5}`}%`,
                                      top: `${`${((i * 11) % 80) + 10}`}%`,
                                      boxShadow: "0 0 8px rgba(255, 255, 255, 0.8)",
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                            {form.backgroundType === "raindrops" && (
                              <div className="absolute inset-0 bg-[#060b13] overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/20 to-[#020617]" />
                                {Array.from({ length: 10 }).map((_, i) => (
                                  <div
                                    key={`preview-rain-${i}`}
                                    className="absolute w-[1px] bg-gradient-to-b from-transparent to-blue-400/50"
                                    style={{
                                      height: `${30 + (i * 5)}px`,
                                      left: `${`${((i * 19) % 90) + 5}`}%`,
                                      top: `${`${-20 + ((i * 13) % 100)}`}%`,
                                      opacity: 0.3 + (i % 4) * 0.1,
                                      transform: "rotate(15deg)",
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                            {form.backgroundType === "lanterns" && (
                              <div className="absolute inset-0 bg-[#0d0702]">
                                <div className="absolute inset-0 bg-gradient-to-b from-[#1c0d02]/30 to-[#020100]" />
                                {Array.from({ length: 8 }).map((_, i) => (
                                  <div
                                    key={`preview-lantern-${i}`}
                                    className="absolute rounded-full bg-amber-400/30"
                                    style={{
                                      width: `${4 + (i % 4)}px`,
                                      height: `${4 + (i % 4)}px`,
                                      left: `${`${((i * 13) % 90) + 5}`}%`,
                                      bottom: `${`${((i * 17) % 80) + 10}`}%`,
                                      boxShadow: "0 0 10px #f59e0b",
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                            {form.backgroundType === "sakura" && (
                              <div className="absolute inset-0 bg-[#0d0309] overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-[#ffedfa]/5 to-[#000]" />
                                {Array.from({ length: 8 }).map((_, i) => (
                                  <div
                                    key={`preview-sakura-${i}`}
                                    className="absolute rounded-full bg-pink-300/40"
                                    style={{
                                      width: `${5 + (i % 3)}px`,
                                      height: `${3 + (i % 2)}px`,
                                      left: `${`${((i * 21) % 85) + 5}`}%`,
                                      top: `${`${((i * 13) % 80) + 10}`}%`,
                                      transform: `rotate(${i * 45}deg)`,
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                            {form.backgroundType === "candlelight" && (
                              <div className="absolute inset-0 bg-[#090502]">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#180c04]/40 to-[#020100]" />
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
                                {Array.from({ length: 6 }).map((_, i) => (
                                  <div
                                    key={`preview-candle-${i}`}
                                    className="absolute rounded-full bg-amber-300/40 animate-ping"
                                    style={{
                                      width: "3px",
                                      height: "3.5px",
                                      left: `${`${45 + ((i * 3) % 10)}`}%`,
                                      bottom: `${`${20 + i * 8}`}%`,
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                            {form.backgroundType === "fireflies" && (
                              <div className="absolute inset-0 bg-[#020704]">
                                <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/10 to-[#020202]" />
                                {Array.from({ length: 8 }).map((_, i) => (
                                  <div
                                    key={`preview-firefly-${i}`}
                                    className="absolute rounded-full bg-emerald-400/40"
                                    style={{
                                      width: "4px",
                                      height: "4px",
                                      left: `${`${((i * 17) % 85) + 5}`}%`,
                                      top: `${`${((i * 13) % 80) + 10}`}%`,
                                      boxShadow: "0 0 12px #34d399",
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                            {form.backgroundType === "constellations" && (
                              <div className="absolute inset-0 bg-[#04060c]">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_80%)]" />
                                {Array.from({ length: 6 }).map((_, i) => (
                                  <div
                                    key={`preview-constell-${i}`}
                                    className="absolute rounded-full bg-blue-200/50"
                                    style={{
                                      width: "3px",
                                      height: "3px",
                                      left: `dots`,
                                      top: `dots`,
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                            {form.backgroundType === "aurora" && (
                              <div className="absolute inset-0 bg-[#02050f] overflow-hidden">
                                <div className="absolute inset-x-0 -top-10 h-32 bg-gradient-to-b from-emerald-500/20 via-cyan-500/10 to-transparent blur-xl animate-pulse" />
                              </div>
                            )}
                            {form.backgroundType === "cyber_grid" && (
                              <div className="absolute inset-0 bg-[#030303]">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />
                              </div>
                            )}
                          </div>

                          {/* Mockup Header Tracker */}
                          <div className="w-full flex justify-between items-center text-[7px] uppercase tracking-widest text-slate-500 font-bold z-10">
                            <span>Created by You</span>
                            <span>Letter for ${form.recipientName || "Recipient"}</span>
                          </div>

                          {/* Center Mockup Cover Slide */}
                          <div className="my-auto text-center space-y-4 px-2 w-full z-10 relative">
                            <span 
                              className="text-[7px] uppercase tracking-widest font-extrabold block"
                              style={{
                                color: getPreviewPrimaryColor(),
                                textShadow: `0 0 8px ${getPreviewPrimaryColor()}30`
                              }}
                            >
                              A Relational Letter 🩹
                            </span>

                            <h1 
                              className={`text-[14px] font-extrabold leading-tight px-1 ${
                                form.fontStyle === "modern" ? "font-sans-modern uppercase tracking-wider text-[12px]" :
                                form.fontStyle === "retro" ? "font-mono-retro uppercase text-[11px]" :
                                form.fontStyle === "handwritten" ? "font-handwritten text-[16px] font-bold" :
                                "font-serif-elegant italic text-[13px]"
                              }`}
                              style={{
                                color: "#fff",
                                textShadow: `0 0 12px ${getPreviewPrimaryColor()}60`
                              }}
                            >
                              Forever with You
                            </h1>

                            <p className="text-[8px] text-slate-300 font-light leading-snug max-w-[160px] mx-auto">
                              From ${form.creatorName || "Creator"}, with a very hopeful heart ❤️
                            </p>

                            <div className="pt-2 flex justify-center">
                              <div 
                                className="px-3.5 py-1 rounded-full border border-white/10 text-[7px] font-bold tracking-widest uppercase flex items-center gap-1 bg-black/40"
                                style={{
                                  borderColor: `${getPreviewPrimaryColor()}30`
                                }}
                              >
                                Open Letter 💌
                              </div>
                            </div>
                          </div>

                          {/* Mockup Footer Tracker */}
                          <div className="w-full flex justify-between items-center text-[7px] uppercase text-slate-500 font-bold z-10">
                            <span>Cover Slide</span>
                            <span>1 / 10</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5 font-medium">{error}</p>}

                    <div className="pt-6 flex justify-between border-t border-zinc-900 mt-6">
                      <button onClick={prevStep} className="px-5 py-3 rounded-lg border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button onClick={nextStep} className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-950/30">
                        Next Step <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
                {step === 14 && (
                  <motion.div
                    key="step14"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-1">
                      <h2 className="text-2xl font-extrabold text-white">Ending Surprise 🎁</h2>
                      <p className="text-xs text-slate-400">Select the interactive surprise they unlock at the end of the letter.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-auto">
                      {surpriseOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateForm("surpriseType", opt.value)}
                          className={`p-4 rounded-2xl text-left border flex items-center gap-3.5 transition-all cursor-pointer ${
                            form.surpriseType === opt.value
                              ? "bg-amber-500/15 border-amber-500/70 text-amber-200 shadow-xl shadow-amber-950/40 ring-1 ring-amber-500/40"
                              : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <span className="text-2xl p-2.5 rounded-xl bg-white/5 border border-white/10">{opt.emoji}</span>
                          <div>
                            <span className="text-xs font-bold text-white block">{opt.label}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{opt.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Secret Message Input */}
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest block">
                        {form.surpriseType === "heartbeat" ? "Heartbeat Secret Text" : "Scratch Card Secret Message"}
                      </label>
                      <input
                        type="text"
                        placeholder={
                          form.surpriseType === "heartbeat"
                            ? "E.g. My heart rate syncs when you walk into the room."
                            : "E.g. I promise to buy you ramen next week / Forever yours ❤️"
                        }
                        value={form.surpriseText}
                        onChange={(e) => updateForm("surpriseText", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-white text-xs glass-input"
                      />
                      <p className="text-[10px] text-slate-500">
                        {form.surpriseType === "heartbeat"
                          ? "They will tap the glowing heart rhythm to unveil this secret message."
                          : "They will scratch away the silver interactive foil with their finger to reveal this note."}
                      </p>
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5 font-medium">{error}</p>}

                    <div className="pt-6 flex justify-between border-t border-zinc-900 mt-6">
                      <button onClick={prevStep} className="px-5 py-3 rounded-lg border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-950/30"
                      >
                        Next Step <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 17: Date Invitation Toggle */}
                {step === 15 && (
                  <motion.div
                    key="step15"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <h2 className="text-2xl font-extrabold text-white">Date Invitation 💌</h2>
                      <p className="text-sm text-slate-400">
                        Would you like to ask {form.recipientName || "them"} out on a date at the very end of their visit? They can reply "Yes" or "No".
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 my-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, dateInvitationEnabled: true }));
                          setStep(16);
                        }}
                        className="w-full p-4 rounded-xl border border-zinc-800 hover:border-blue-500/40 bg-white/5 hover:bg-blue-650/5 text-left transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-white uppercase group-hover:text-blue-300">Yes, Add Date Invite 🌹</span>
                          <p className="text-[10px] text-slate-500">Configure a custom movie, dinner, coffee, or walk date card.</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-all" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev) => {
                            const updatedForm = { ...prev, dateInvitationEnabled: false };
                            setStep(17); // Go to passcode protection step
                            return updatedForm;
                          });
                        }}
                        className="w-full p-4 rounded-xl border border-zinc-800 hover:border-pink-500/40 bg-white/5 hover:bg-pink-600/5 text-left transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-white uppercase group-hover:text-pink-300">No, Skip Date Invitation ⏭️</span>
                          <p className="text-[10px] text-slate-500">Proceed directly to create your website link.</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-all" />
                      </button>
                    </div>

                    <div className="pt-6 flex justify-between border-t border-zinc-900 mt-6">
                      <button onClick={prevStep} className="px-5 py-3 rounded-lg border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <div />
                    </div>
                  </motion.div>
                )}

                {/* Step 18: Date Details Form */}
                {step === 16 && (
                  <motion.div
                    key="step16"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-1">
                      <h2 className="text-2xl font-extrabold text-white">Date Details 🌹</h2>
                      <p className="text-xs text-slate-400">Configure how you'd like to ask them out.</p>
                    </div>

                    <div className="space-y-3.5 my-auto max-h-[260px] overflow-y-auto pr-1 text-left">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-300 uppercase block">Date Type</label>
                          <select
                            value={form.dateType}
                            onChange={(e) => updateForm("dateType", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl text-white text-xs bg-zinc-900 border border-white/10"
                          >
                            <option value="movie">Movie Date 🎬</option>
                            <option value="dinner">Dinner Date 🕯️</option>
                            <option value="coffee">Coffee/Cafe Date ☕</option>
                            <option value="walk">Scenic Walk Date 🌅</option>
                            <option value="concert">Concert/Event Date 🎵</option>
                            <option value="other">Other/Custom Date 🎁</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-300 uppercase block">Recipient Nickname/Cute Title</label>
                          <input
                            type="text"
                            placeholder="E.g. Sweetheart / My Favorite Human / Partner in Crime"
                            value={form.dateNickname}
                            onChange={(e) => updateForm("dateNickname", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl text-white text-xs glass-input"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-300 uppercase block">Date Name / Topic</label>
                          <input
                            type="text"
                            placeholder="E.g. Cozy Italian Dinner & Star Gazing"
                            value={form.dateName}
                            onChange={(e) => updateForm("dateName", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl text-white text-xs glass-input"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-300 uppercase block">Date Time / Day</label>
                          <input
                            type="text"
                            placeholder="E.g. This Saturday Evening at 7:30 PM"
                            value={form.dateDate}
                            onChange={(e) => updateForm("dateDate", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl text-white text-xs glass-input"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-300 uppercase block">Banter / Narrative Context</label>
                        <textarea
                          placeholder="E.g. You always mention how much you need a calm, relaxing evening away from work. I've got everything planned—good food, great music, and uninterrupted conversations with you."
                          value={form.dateBanter}
                          onChange={(e) => updateForm("dateBanter", e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl text-white text-xs glass-input resize-none"
                        />
                        <p className="text-[9px] text-slate-500">We'll weave this story context into a beautiful date proposal letter.</p>
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5 font-medium">{error}</p>}

                    <div className="pt-6 flex justify-between border-t border-zinc-900 mt-6">
                      <button onClick={prevStep} className="px-5 py-3 rounded-lg border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-950/30"
                      >
                        Configure Access Code <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 19: Passcode Setup */}
                {step === 17 && (
                  <motion.div
                    key="step17"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        Passcode Protection 🔐
                      </h2>
                      <p className="text-sm text-slate-400">
                        Would you like to lock this website behind a secret passcode? The recipient will have to enter this passcode to unlock it.
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 my-auto">
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({ ...prev, passcodeEnabled: true }));
                          }}
                          className={`flex-1 p-4 rounded-xl border text-center transition-all ${
                            form.passcodeEnabled
                              ? "bg-amber-500/10 border-amber-500/60 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                              : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                          }`}
                        >
                          <span className="block text-lg mb-1">🔒</span>
                          <span className="text-xs font-bold uppercase">Enable Passcode</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({ ...prev, passcodeEnabled: false, passcode: "" }));
                          }}
                          className={`flex-1 p-4 rounded-xl border text-center transition-all ${
                            !form.passcodeEnabled
                              ? "bg-pink-650/5 border-pink-500/40 text-pink-300"
                              : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                          }`}
                        >
                          <span className="block text-lg mb-1">🔓</span>
                          <span className="text-xs font-bold uppercase">No Passcode</span>
                        </button>
                      </div>

                      {form.passcodeEnabled && (
                        <div className="space-y-2 text-left animate-float-slow">
                          <label className="text-xs font-semibold text-slate-300 uppercase">Define secret passcode</label>
                          <input
                            type="text"
                            placeholder="E.g. ourfirstdate, 1234, sujanmylove"
                            value={form.passcode}
                            onChange={(e) => updateForm("passcode", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-white bg-zinc-900 border border-white/10 text-center font-mono tracking-wide"
                          />
                          <p className="text-[10px] text-slate-500">Make sure to send this passcode to {form.recipientName || "them"} along with the page link!</p>
                        </div>
                      )}
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5 font-medium">{error}</p>}

                    <div className="pt-6 flex justify-between border-t border-zinc-900 mt-6">
                      <button onClick={prevStep} className="px-5 py-3 rounded-lg border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        onClick={handleGenerateDraft}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-950/30"
                      >
                        Generate & Review Draft <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 19.5: Review & Edit Draft Text */}
                {step === 18 && draftAiData && (
                  <motion.div
                    key="step18"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="text-center sm:text-left space-y-2">
                      <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        Review & Customize AI Text 📝
                      </h2>
                      <p className="text-xs text-slate-400">
                        Review the generated templates below. Feel free to tweak the sentences or write custom text so it feels perfectly personal!
                      </p>
                    </div>

                    <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 text-left my-auto custom-scrollbar">
                      {/* Headline */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-300 uppercase block">Main Headline / Quote</label>
                        <input
                          type="text"
                          value={draftAiData.headline || ""}
                          onChange={(e) => updateDraftField("headline", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl text-white text-xs bg-zinc-950/60 border border-white/10 outline-none focus:border-purple-500 transition-all font-sans"
                        />
                      </div>

                      {/* Act 1 */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-300 uppercase block">Act I: The Reflection (Greeting Slide)</label>
                        <textarea
                          value={draftAiData.act1 || ""}
                          onChange={(e) => updateDraftField("act1", e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl text-white text-xs bg-zinc-950/60 border border-white/10 outline-none focus:border-purple-500 transition-all font-sans resize-none"
                        />
                      </div>

                      {/* Act 2 */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-300 uppercase block">Act II: The Metaphor (Heartfelt Memory Slide)</label>
                        <textarea
                          value={draftAiData.act2 || ""}
                          onChange={(e) => updateDraftField("act2", e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl text-white text-xs bg-zinc-950/60 border border-white/10 outline-none focus:border-purple-500 transition-all font-sans resize-none"
                        />
                      </div>

                      {/* Act 3 */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-300 uppercase block">Act III: The Reconciliation (Future Promise Slide)</label>
                        <textarea
                          value={draftAiData.act3 || ""}
                          onChange={(e) => updateDraftField("act3", e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl text-white text-xs bg-zinc-950/60 border border-white/10 outline-none focus:border-purple-500 transition-all font-sans resize-none"
                        />
                      </div>

                      {/* Attributes */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-300 uppercase block">Attribute: Known For</label>
                          <textarea
                            rows={2}
                            value={draftAiData.characterAttributes?.knownFor || ""}
                            onChange={(e) => updateDraftAttrField("knownFor", e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl text-white text-xs bg-zinc-950/70 border border-white/10 outline-none focus:border-amber-400 transition-all font-sans resize-none leading-relaxed"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-300 uppercase block">Attribute: Acclaimed For</label>
                          <textarea
                            rows={2}
                            value={draftAiData.characterAttributes?.acclaimedFor || ""}
                            onChange={(e) => updateDraftAttrField("acclaimedFor", e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl text-white text-xs bg-zinc-950/70 border border-white/10 outline-none focus:border-amber-400 transition-all font-sans resize-none leading-relaxed"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-300 uppercase block">Attribute: Remembered For</label>
                          <textarea
                            rows={2}
                            value={draftAiData.characterAttributes?.rememberedFor || ""}
                            onChange={(e) => updateDraftAttrField("rememberedFor", e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl text-white text-xs bg-zinc-950/70 border border-white/10 outline-none focus:border-amber-400 transition-all font-sans resize-none leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Date Letter */}
                      {form.dateInvitationEnabled && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-300 uppercase block">Date Proposal Letter</label>
                          <textarea
                            value={draftAiData.dateLetterText || ""}
                            onChange={(e) => updateDraftField("dateLetterText", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl text-white text-xs bg-zinc-950/70 border border-white/10 outline-none focus:border-amber-400 transition-all font-sans resize-none leading-relaxed"
                          />
                        </div>
                      )}
                    </div>

                    {error && <p className="text-sm text-red-400 font-mono text-xs mt-1.5 font-medium">{error}</p>}

                    <div className="pt-4 flex flex-col sm:flex-row gap-2.5 justify-between border-t border-zinc-900 mt-4">
                      <button 
                        onClick={() => setStep(17)} 
                        className="w-full sm:w-auto px-5 py-3 rounded-xl border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      
                      <button
                        onClick={() => handleSubmit()}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        Publish & Get Magic Link <Sparkles className="w-4 h-4 animate-pulse" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 20: Success screen */}
                {step === 19 && (
                  <motion.div
                    key="step19"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-6 text-center"
                  >
                    <div className="mx-auto w-16 h-16 rounded-full bg-blue-600/10 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-2">
                      <Sparkles className="w-8 h-8 glow-purple" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Your Magic Link is Ready!</h2>
                      <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                        Send this link to <span className="text-purple-300 font-semibold">{form.recipientName}</span>. 
                        They will load into a personalized, interactive 3D memory slide presenter.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-left">
                      <div className="truncate text-xs sm:text-sm text-slate-200 font-mono select-all">
                        {magicLink}
                      </div>
                      <button
                        onClick={handleCopy}
                        className={`flex-shrink-0 p-2.5 rounded-xl border transition-all ${
                          copied
                            ? "bg-green-500/20 border-green-500/30 text-green-400"
                            : "bg-white/5 border-white/5 hover:bg-white/10 text-slate-300"
                        }`}
                      >
                        {copied ? <Check className="w-4.5 h-4.5" /> : <Copy className="w-4.5 h-4.5" />}
                      </button>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                      {(form.occasion === "wedding" || form.occasion === "engagement" || form.occasion === "birthday_party") && (
                        <button
                          onClick={() => setShowSuccessQrModal(true)}
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-300 text-black font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm"
                        >
                          <QrCode className="w-4.5 h-4.5" /> Download QR Code Card 📲
                        </button>
                      )}
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                          `Hey ${form.recipientName}, I made this for you: ${magicLink}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm"
                      >
                        <MessageCircle className="w-4.5 h-4.5 fill-white" /> Share on WhatsApp
                      </a>
                      <a
                        href={magicLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black font-bold transition-all shadow-lg shadow-amber-950/30 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-950/30"
                      >
                        Preview Website <ExternalLink className="w-4.5 h-4.5" />
                      </a>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
                      <button
                        onClick={() => resetForm(0)}
                        className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Create another memory link
                      </button>
                      
                      <a
                        href={`${magicLink}/track`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-amber-400 hover:text-purple-300 transition-colors flex items-center gap-1 font-mono font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" /> Open Recipient Tracking Dashboard →
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-5 z-10 text-[10px] text-slate-500 border-t border-white/5 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-6 gap-2">
        <div>&copy; {new Date().getFullYear()} SealedVibe • Designed & Developed by Adnan</div>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          <a href="/refund" className="hover:text-slate-300 transition-colors">Refund Policy</a>
          <a href="mailto:adnanajmeri70@gmail.com" className="hover:text-slate-300 transition-colors" title="Email: adnanajmeri70@gmail.com">Contact: adnanajmeri70@gmail.com</a>
        </div>
      </footer>

      {/* Token Store & Promo Code Modal */}
      <TokenStoreModal
        isOpen={showTokenStore}
        currentTokens={currentUser?.tokens ?? 0}
        onClose={() => setShowTokenStore(false)}
        onSuccess={(newTokens) => {
          setCurrentUser((prev: any) => ({ ...prev, tokens: newTokens }));
          setShowTokenStore(false);
          setError(null);
        }}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        recipientName={form.recipientName || "Recipient"}
        occasion={form.occasion}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(user) => {
          setShowAuthModal(false);
          setCurrentUser(user);
          if (pendingAction === "draft") {
            executeDraftGeneration();
          } else {
            executeFinalGeneration(form);
          }
          setPendingAction(null);
        }}
      />

      {/* 📱 QR Code Invitation Card Modal */}
      {(form.occasion === "wedding" || form.occasion === "engagement" || form.occasion === "birthday_party") && (
        <QRCodeModal
          isOpen={showSuccessQrModal}
          onClose={() => setShowSuccessQrModal(false)}
          type={form.occasion === "wedding" ? "wedding" : form.occasion === "engagement" ? "engagement" : "birthday_party"}
          url={magicLink || undefined}
          names={
            form.occasion === "wedding"
              ? (form.weddingCoupleNames || `${form.creatorName} & ${form.recipientName}`)
              : form.occasion === "engagement"
              ? (form.weddingCoupleNames || `${form.creatorName} & ${form.recipientName}`)
              : (form.partyPersonName || form.recipientName || "Birthday Star")
          }
          title={
            form.occasion === "wedding"
              ? "Royal Wedding Invitation"
              : form.occasion === "engagement"
              ? "Engagement & Ring Ceremony"
              : (form.partyEventTitle || "Birthday Party Invitation")
          }
          date={
            form.occasion === "wedding"
              ? form.weddingDate
              : form.occasion === "engagement"
              ? form.weddingDate
              : form.partyDate
          }
          time={
            form.occasion === "wedding"
              ? form.weddingTime
              : form.occasion === "engagement"
              ? form.weddingTime
              : form.partyTime
          }
          venue={
            form.occasion === "wedding"
              ? form.weddingVenueName
              : form.occasion === "engagement"
              ? form.weddingVenueName
              : form.partyVenueName
          }
        />
      )}
    </div>
  );
}


