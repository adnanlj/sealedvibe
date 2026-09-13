"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Sparkles, 
  Heart, 
  Volume2, 
  VolumeX, 
  Calendar, 
  Award, 
  MessageCircle, 
  Stars, 
  Flame, 
  Moon, 
  Send, 
  CheckCircle2, 
  ChevronDown,
  Camera,
  Compass,
  Smile,
  Coffee,
  Music,
  Shield,
  Gift,
  Clock,
  Ticket,
  MapPin,
  CheckSquare,
  Square,
  Feather,
  Sun,
  CloudRain,
  Radio,
  RotateCcw,
  Check
} from "lucide-react";

interface RomanticProposalProps {
  data: {
    slug: string;
    creatorName: string;
    recipientName?: string;
    occasion?: string;
    youtubeUrl?: string;
    songName?: string;
    isDemo?: boolean;
    status?: string;
    proposalData?: {
      partnerName?: string;
      partnerNickname?: string;
      proposalType?: string;
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
      constellationNodes?: Array<{ title: string; subtitle?: string; quote: string }>;
      enableLoveCoupons?: boolean;
      loveCoupons?: Array<{ badge?: string; title: string; desc: string }>;
      enableReasonsWhy?: boolean;
      reasonsWhy?: Array<{ title: string; desc: string }>;
      enableWhispers?: boolean;
      whispers?: Array<{ title: string; preview?: string; letter: string }>;
      enableBucketList?: boolean;
      bucketList?: Array<{ text: string }>;
      enableMemoryVault?: boolean;
      memoryKeepsakes?: Array<{ tag?: string; title: string; desc: string }>;
      responseStatus?: "pending" | "accepted" | "declined";
      responseDate?: Date | string;
      responsePartnerNote?: string;
    };
  };
}

// Web Audio API Engine for Romantic Acoustic Harp & Warm Twilight Chimes Fallback
class RomanticProposalAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: any = null;

  start() {
    if (this.isPlaying) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      this.isPlaying = true;
      this.playWarmTwilightPad();
      this.scheduleHarpMelody();
    } catch (e) {
      console.log("AudioContext error", e);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) clearInterval(this.timer);
    if (this.ctx && this.ctx.state !== "closed") {
      try {
        this.ctx.close();
      } catch (e) {}
    }
  }

  private playWarmTwilightPad() {
    if (!this.ctx || !this.isPlaying) return;
    const baseFreqs = [110.0, 164.81, 220.0, 277.18, 329.63]; // A2, E3, A3, C#4, E4
    baseFreqs.forEach((freq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(340, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.018, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
    });
  }

  private scheduleHarpMelody() {
    const notes = [220.00, 277.18, 329.63, 415.30, 440.00, 554.37, 659.25, 880.00];
    const melody = [0, 1, 2, 4, 3, 2, 1, 0, 2, 4, 5, 6, 5, 4, 2, 1];
    let step = 0;

    this.timer = setInterval(() => {
      if (!this.ctx || !this.isPlaying) return;
      const freq = notes[melody[step % melody.length]];
      step++;
      this.pluckHarpString(freq);
    }, 540);
  }

  private pluckHarpString(freq: number) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(freq * 2.8, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.048, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.9);
    } catch (e) {}
  }
}

export default function RomanticProposal({ data }: RomanticProposalProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Envelope state: "sealed" | "seal_broken" | "flap_open" | "letter_out"
  const [envelopeState, setEnvelopeState] = useState<"sealed" | "seal_broken" | "flap_open" | "letter_out">("sealed");

  // Interactive Promises unlocked tracking
  const [unlockedPromises, setUnlockedPromises] = useState<Record<number, boolean>>({});

  // Active Constellation Star State
  const [activeConstellation, setActiveConstellation] = useState<number>(0);

  // Love Coupons claimed tracking
  const [claimedCoupons, setClaimedCoupons] = useState<Record<number, boolean>>({});

  // Secret Whispers Flip Cards state
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  // Bucket List items checked (unticked by default)
  const [checkedBucketItems, setCheckedBucketItems] = useState<Record<number, boolean>>({});


  // Check if current proposal is a demo preview (in showroom modal or /p/demo-proposal)
  const isDemoProposal =
    data.slug === "demo-proposal" ||
    data.slug?.startsWith("demo-") ||
    data.slug === "demo" ||
    data.isDemo === true ||
    (typeof window !== "undefined" && (
      window.location.pathname.includes("demo-proposal") ||
      window.location.pathname.includes("/demo") ||
      window.location.pathname === "/"
    ));

  // Proposal acceptance state:
  // - In DEMO mode: Always starts fresh & unanswered on each reload/refresh, reset immediately
  // - In REAL user proposals: Persists answered state from database & localStorage permanently
  const [hasAccepted, setHasAccepted] = useState(
    isDemoProposal ? false : (data.proposalData?.responseStatus === "accepted" || data.status === "accepted")
  );
  const [partnerNote, setPartnerNote] = useState(
    isDemoProposal ? "" : (data.proposalData?.responsePartnerNote || "")
  );
  const [isSubmittingAcceptance, setIsSubmittingAcceptance] = useState(false);
  const [noteSubmitted, setNoteSubmitted] = useState(
    isDemoProposal ? false : (!!data.proposalData?.responsePartnerNote || data.proposalData?.responseStatus === "accepted")
  );

  // Playful Dodge button state with spring physics
  const [dodgePosition, setDodgePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);
  const dodgePhrases = [
    "Let Me Think 🙈",
    "Are you sure? 😜",
    "Nice try! 💕",
    "You can't escape forever! 💍",
    "Destiny has chosen! 💖",
    "Just click YES! 🥰"
  ];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const youtubePlayerRef = useRef<any>(null);
  const audioEngineRef = useRef<RomanticProposalAudioEngine | null>(null);
  const isOpenedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    audioEngineRef.current = new RomanticProposalAudioEngine();

    // In demo mode, always clear any saved answers so each refresh/open provides a fresh interactive experience
    if (isDemoProposal) {
      setHasAccepted(false);
      setNoteSubmitted(false);
      setPartnerNote("");
      try {
        localStorage.removeItem(`sv_accepted_${data.slug}`);
      } catch (e) {}
    } else {
      // Restore persisted interactions from localStorage for real user proposals
      try {
        const savedBucket = localStorage.getItem(`sv_bucket_${data.slug}`);
        if (savedBucket) {
          setCheckedBucketItems(JSON.parse(savedBucket));
        }
        const savedPromises = localStorage.getItem(`sv_promises_${data.slug}`);
        if (savedPromises) {
          setUnlockedPromises(JSON.parse(savedPromises));
        }
        const savedCoupons = localStorage.getItem(`sv_coupons_${data.slug}`);
        if (savedCoupons) {
          setClaimedCoupons(JSON.parse(savedCoupons));
        }
        const savedAccepted = localStorage.getItem(`sv_accepted_${data.slug}`);
        if (savedAccepted === "true") {
          setHasAccepted(true);
        }
      } catch (e) {}
    }

    return () => {
      if (audioEngineRef.current) audioEngineRef.current.stop();
    };
  }, [data.slug, isDemoProposal]);

  useEffect(() => {
    isOpenedRef.current = isOpened;
  }, [isOpened]);

  // YouTube Audio Embed Loader
  const extractId = (url?: string) => {
    if (!url) return "";
    const cleanUrl = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) return cleanUrl;
    const regExp = /(?:https?:\/\/)?(?:www\.|m\.|music\.)?(?:youtube(?:-nocookie)?\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
    const match = cleanUrl.match(regExp);
    if (match && match[1]) return match[1];
    const fallbackMatch = cleanUrl.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:[&\?\/#]|$)/);
    return fallbackMatch ? fallbackMatch[1] : "";
  };

  useEffect(() => {
    const vid = extractId(data.youtubeUrl);
    if (!vid) return;

    if (!document.getElementById("youtube-api-script")) {
      const tag = document.createElement("script");
      tag.id = "youtube-api-script";
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const checkInterval = setInterval(() => {
      if ((window as any).YT && (window as any).YT.Player) {
        clearInterval(checkInterval);
        if (!youtubePlayerRef.current) {
          try {
            youtubePlayerRef.current = new (window as any).YT.Player("proposal-yt-audio", {
              height: "200",
              width: "200",
              videoId: vid,
              playerVars: {
                autoplay: 0,
                controls: 0,
                loop: 1,
                playlist: vid,
                playsinline: 1,
                enablejsapi: 1,
                origin: typeof window !== "undefined" ? window.location.origin : "",
              },
              events: {
                onReady: (event: any) => {
                  try {
                    event.target.setVolume(100);
                    event.target.unMute();
                    if (isOpenedRef.current) {
                      event.target.playVideo();
                      if (audioEngineRef.current) {
                        audioEngineRef.current.stop();
                      }
                      setIsPlayingMusic(true);
                    }
                  } catch (e) {}
                },
                onError: () => {
                  if (isOpenedRef.current && audioEngineRef.current) {
                    audioEngineRef.current.start();
                  }
                }
              },
            });
          } catch (e) {}
        }
      }
    }, 150);

    return () => clearInterval(checkInterval);
  }, [data.youtubeUrl]);

  // Data mapping with romantic defaults
  const p = data.proposalData || {};
  const partnerName = p.partnerName || data.recipientName || "My Love";
  const partnerNickname = p.partnerNickname || "Forever";
  const creatorName = data.creatorName || "Yours Truly";
  const rawHeadline = p.headline || `For My Forever, ${partnerName}`;
  const headlineClean = rawHeadline.replace(/🌹|💖|✨|♡|❤️|💕/gu, '').trim();
  const proposalQuestion = p.proposalQuestion || "Will you be mine forever and share all of life's magic with me? 💖";
  const defaultDemoNote = `From the moment our paths crossed, my world turned into something luminous and real. Every laugh we've shared, every quiet silence, every glance has made one thing certain: I don't want a future that doesn't have you in it. You are my home, my peace, and my greatest adventure. Forever yours, ${creatorName}.`;
  const secretLoveNote = p.secretLoveNote || (data.slug.includes("demo") ? defaultDemoNote : "");
  
  const chapter1Title = p.storyChapter1Title || "Chapter I: The Day Everything Changed";
  const chapter1Text = p.storyChapter1Text || "Do you remember when our paths first crossed? In an ordinary world, that moment felt entirely cinematic. A single smile from you turned everything into poetry.";
  
  const chapter2Title = p.storyChapter2Title || "Chapter II: The Moments That Built Us";
  const chapter2Text = p.storyChapter2Text || "From late-night conversations and shared laughter to quiet moments where words weren't even needed, you became my peace, my home, and my favorite adventure.";
  
  const chapter3Title = p.storyChapter3Title || "Chapter III: The Vow of Forever";
  const chapter3Text = p.storyChapter3Text || "I realized that love isn't just about sharing good days—it's about standing by each other through everything. I choose you today, tomorrow, and for all of our tomorrows.";

  const celebrationTitle = p.celebrationDateTitle || "The Day We Celebrate Forever";
  const celebrationDateTime = p.celebrationDateTime || "";
  const enableDodgeButton = p.enableDodgeButton !== false;
  const songTitle = data.songName || "Our Romantic Melody";

  // 1. Sacred Lifetime Promises (Dynamic list support - 3 compact iconic vows for demo)
  const defaultPromises = [
    { title: "To Always Listen", text: "Even in comfortable silence, I promise to hear what your heart doesn't say out loud." },
    { title: "To Stand Beside You in Every Storm", text: "Through sunny days and stormy nights, my hand will always be the one holding yours." },
    { title: "To Never Stop Choosing You", text: "Every morning when I open my eyes, I will choose you all over again, unconditionally." }
  ];
  const rawPromises = (p.promises && Array.isArray(p.promises))
    ? p.promises 
    : (p.enablePromises === false ? [] : (data.slug.includes("demo") ? defaultPromises : []));
  const sacredPromises = rawPromises.filter(item => item && item.title?.trim() && item.text?.trim());
  const enablePromises = p.enablePromises !== false && sacredPromises.length > 0;

  // 2. Micro-Things Showcase: What I Adore About You (3 compact cards for demo)
  const defaultReasons = [
    { title: "Your Radiant Smile", desc: "The way your entire face lights up when you're genuinely happy—it's my favorite sight in the world." },
    { title: "Our Quiet Comfort", desc: "How we can sit together for hours without saying a word, yet feel completely understood and at peace." },
    { title: "Our Spontaneous Adventures", desc: "Whether it's a 2 AM drive or a simple grocery run, everything with you feels cinematic." }
  ];
  const rawReasons = (p.reasonsWhy && Array.isArray(p.reasonsWhy))
    ? p.reasonsWhy 
    : (p.enableReasonsWhy === false ? [] : (data.slug.includes("demo") ? defaultReasons : []));
  const reasonIcons = [Smile, Coffee, Compass, Music, Shield, Heart, Sparkles, Feather];
  const microThings = rawReasons.filter(item => item && item.title?.trim()).map((r, i) => ({
    icon: reasonIcons[i % reasonIcons.length],
    title: r.title,
    desc: r.desc || ""
  }));
  const enableReasonsWhy = p.enableReasonsWhy !== false && microThings.length > 0;

  // 3. Constellation Star Nodes (3 compact star alignments for demo)
  const defaultConstellations = [
    { title: "The First Spark", subtitle: "Where our paths aligned", quote: "Among billions of people on this planet, our orbits crossed in the most breathtaking way." },
    { title: "The Quiet Sanctuary", subtitle: "Home in each other's eyes", quote: "Realizing that home isn't a place on a map—it's wherever you are standing." },
    { title: "The Eternal Orbit", subtitle: "Forever by your side", quote: "Written in the constellations long before we even knew each other's names." }
  ];
  const rawConstellations = (p.constellationNodes && Array.isArray(p.constellationNodes))
    ? p.constellationNodes 
    : (p.enableConstellation === false ? [] : (data.slug.includes("demo") ? defaultConstellations : []));
  const constellationNodes = rawConstellations.filter(item => item && item.title?.trim() && item.quote?.trim()).map((n, i) => ({
    id: i,
    title: n.title,
    subtitle: n.subtitle || `Star Alignment 0${i + 1}`,
    quote: n.quote
  }));
  const enableConstellation = p.enableConstellation !== false && constellationNodes.length > 0;

  // 4. Redeemable Love Coupons (3 compact tokens for demo)
  const defaultCoupons = [
    { badge: "Midnight Escape", title: "1x Stargazing & Hot Cocoa Night", desc: "Valid anytime. Blankets, acoustic melodies, and endless sky under the moon." },
    { badge: "Comfort Pass", title: "1x Endless Warm Hug Whenever Needed", desc: "No questions asked. Just unconditional warmth, peace, and holding you close." },
    { badge: "Spontaneous Vibe", title: "1x Unplanned Road Trip & Sunset Chase", desc: "Pack a mini bag, pick a playlist, and let's drive wherever the road takes us." }
  ];
  const couponIcons = [Moon, Heart, Compass, Coffee, Award, Flame, Gift, Stars];
  const rawCoupons = (p.loveCoupons && Array.isArray(p.loveCoupons))
    ? p.loveCoupons 
    : (p.enableLoveCoupons === false ? [] : (data.slug.includes("demo") ? defaultCoupons : []));
  const loveCoupons = rawCoupons.filter(item => item && item.title?.trim()).map((c, i) => ({
    id: i,
    badge: c.badge || "Love Keepsake",
    title: c.title,
    desc: c.desc || "Valid anytime with infinite devotion.",
    icon: couponIcons[i % couponIcons.length]
  }));
  const enableLoveCoupons = p.enableLoveCoupons !== false && loveCoupons.length > 0;

  // 5. Secret Whispers Flip Cards (2 intimate 3D flip letters for demo)
  const defaultWhispers = [
    { title: "On Difficult Days", preview: "When the weight of the world feels heavy...", letter: "Remember that you never have to carry anything alone anymore. You have my hand to hold, my shoulder to lean on, and my heart completely devoted to shielding your peace. You are stronger than you know, and loved more than you can imagine." },
    { title: "The Moment I Knew", preview: "The exact day everything clicked...", letter: "It wasn't during a grand fireworks moment. It was when we were just talking, smiling over something silly, and I looked at you and thought: 'I want this person in every single chapter of my life.' There was no turning back." }
  ];
  const rawWhispers = (p.whispers && Array.isArray(p.whispers))
    ? p.whispers 
    : (p.enableWhispers === false ? [] : (data.slug.includes("demo") ? defaultWhispers : []));
  const whisperCards = rawWhispers.filter(item => item && (item.title?.trim() || item.letter?.trim())).map((w, i) => ({
    id: i,
    title: w.title || `Secret Letter 0${i + 1}`,
    preview: w.preview || "Tap to unlock an intimate letter...",
    letter: w.letter || ""
  }));
  const enableWhispers = p.enableWhispers !== false && whisperCards.length > 0;

  // 6. Bucket List Items (3 iconic dreams for demo)
  const defaultBucketList = [
    { text: "Watch the Northern Lights wrapped together in one thick wool blanket" },
    { text: "Slow dance barefoot in the warm summer rain with our favorite song playing" },
    { text: "Grow old together and still look at each other with stars in our eyes" }
  ];
  const rawBucket = (p.bucketList && Array.isArray(p.bucketList))
    ? p.bucketList 
    : (p.enableBucketList === false ? [] : (data.slug.includes("demo") ? defaultBucketList : []));
  const bucketList = rawBucket.filter(item => item && item.text?.trim());
  const enableBucketList = p.enableBucketList !== false && bucketList.length > 0;

  // 7. Memory Vault Keepsake Cards (3 polaroids for demo)
  const defaultMemory = [
    { tag: "Day One", title: "The First Smile", desc: "When an ordinary day turned into the beginning of our forever story." },
    { tag: "Late Nights", title: "Midnight Talks", desc: "Talking about everything and nothing until the sunrise painted the sky." },
    { tag: "Quiet Glances", title: "The Moment I Knew", desc: "Looking at you across the room and quietly thanking the stars for your existence." }
  ];
  const rawMemory = (p.memoryKeepsakes && Array.isArray(p.memoryKeepsakes))
    ? p.memoryKeepsakes 
    : (p.enableMemoryVault === false ? [] : (data.slug.includes("demo") ? defaultMemory : []));
  const memoryKeepsakes = rawMemory.filter(item => item && item.title?.trim()).map(m => ({
    tag: m.tag || "Keepsake",
    title: m.title,
    desc: m.desc || ""
  }));
  const enableMemoryVault = p.enableMemoryVault !== false && memoryKeepsakes.length > 0;


  // Canvas drifting blush rose petals + shooting stars + stardust (Ultra-Lightweight 60 FPS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const petals: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      angle: number;
      rotationSpeed: number;
      color: string;
      opacity: number;
      type: "rose" | "star" | "bloom";
    }> = [];

    const colors = ["#fda4af", "#f472b6", "#fb7185", "#fecdd3", "#fff1f2", "#fde047"];
    const count = width < 768 ? 14 : 22;

    for (let i = 0; i < count; i++) {
      const isStar = i % 4 === 0;
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isStar ? Math.random() * 2 + 1 : Math.random() * 7 + 4,
        speedY: isStar ? 0.04 : Math.random() * 0.5 + 0.3,
        speedX: (Math.random() - 0.5) * 0.4,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.4 + 0.35,
        type: isStar ? "star" : i % 3 === 0 ? "bloom" : "rose"
      });
    }

    let shootingStar: { x: number; y: number; length: number; speed: number; opacity: number } | null = null;
    let nextShootingStar = Date.now() + 3000;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const now = Date.now();
      if (!shootingStar && now > nextShootingStar) {
        shootingStar = {
          x: Math.random() * (width * 0.7),
          y: Math.random() * (height * 0.3),
          length: Math.random() * 70 + 50,
          speed: Math.random() * 7 + 5,
          opacity: 1
        };
        nextShootingStar = now + Math.random() * 8000 + 5000;
      }

      if (shootingStar) {
        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${shootingStar.opacity * 0.8})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - shootingStar.length,
          shootingStar.y + shootingStar.length * 0.35
        );
        ctx.stroke();
        ctx.restore();

        shootingStar.x += shootingStar.speed;
        shootingStar.y += shootingStar.speed * 0.35;
        shootingStar.opacity -= 0.025;

        if (shootingStar.opacity <= 0) {
          shootingStar = null;
        }
      }

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.angle += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        if (p.type === "star") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.globalAlpha = p.opacity;
          ctx.fill();
        } else if (p.type === "bloom") {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.7, p.size * 1.1, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity * 0.7;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.6, p.size * 0.8, p.size * 0.6, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.6, -p.size * 0.8, -p.size * 0.6, 0, -p.size);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // 💌 DIRECT 3D ENVELOPE OPENING ANIMATION SEQUENCE
  const handleOpenEnvelope = () => {
    if (envelopeState !== "sealed") return;

    setEnvelopeState("seal_broken");
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.5 },
        colors: ["#fda4af", "#f472b6", "#fbbf24", "#ffffff", "#f43f5e"]
      });
    } catch (e) {}

    setTimeout(() => {
      setEnvelopeState("flap_open");
    }, 300);

    setTimeout(() => {
      setEnvelopeState("letter_out");
      setIsPlayingMusic(true);

      if (data.youtubeUrl) {
        if (youtubePlayerRef.current && typeof youtubePlayerRef.current.playVideo === "function") {
          try {
            youtubePlayerRef.current.unMute();
            youtubePlayerRef.current.setVolume(100);
            youtubePlayerRef.current.playVideo();
          } catch (e) {}
        }
      } else {
        if (audioEngineRef.current) {
          audioEngineRef.current.start();
        }
      }

      try {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.4 },
          colors: ["#fda4af", "#fbbf24", "#fbcfe8", "#ffffff"]
        });
      } catch (e) {}
    }, 700);
  };

  const handleEnterFullWebsite = () => {
    setIsOpened(true);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: data.slug, event: "open" })
    }).catch(() => {});
  };

  const togglePromise = (idx: number) => {
    setUnlockedPromises(prev => {
      const updated = { ...prev, [idx]: !prev[idx] };
      try {
        localStorage.setItem(`sv_promises_${data.slug}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#fbbf24", "#fda4af", "#ffffff"]
      });
    } catch (e) {}
  };

  const claimCoupon = (idx: number) => {
    setClaimedCoupons(prev => {
      const updated = { ...prev, [idx]: true };
      try {
        localStorage.setItem(`sv_coupons_${data.slug}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#fbbf24", "#fda4af", "#34d399", "#ffffff"]
      });
    } catch (e) {}
  };

  const toggleFlipWhisper = (idx: number) => {
    setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleBucketItem = (idx: number) => {
    setCheckedBucketItems(prev => {
      const updated = { ...prev, [idx]: !prev[idx] };
      try {
        localStorage.setItem(`sv_bucket_${data.slug}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    try {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.7 },
        colors: ["#fda4af", "#fbbf24"]
      });
    } catch (e) {}
  };


  const toggleMusic = () => {
    if (isPlayingMusic) {
      setIsPlayingMusic(false);
      if (youtubePlayerRef.current && typeof youtubePlayerRef.current.pauseVideo === "function") {
        try {
          youtubePlayerRef.current.pauseVideo();
        } catch (e) {}
      }
      if (audioEngineRef.current) {
        audioEngineRef.current.stop();
      }
    } else {
      setIsPlayingMusic(true);
      if (data.youtubeUrl) {
        if (youtubePlayerRef.current && typeof youtubePlayerRef.current.playVideo === "function") {
          try {
            youtubePlayerRef.current.unMute();
            youtubePlayerRef.current.setVolume(100);
            youtubePlayerRef.current.playVideo();
          } catch (e) {}
        }
      } else if (audioEngineRef.current) {
        audioEngineRef.current.start();
      }
    }
  };

  const handleAcceptProposal = async () => {
    setIsSubmittingAcceptance(true);
    
    // Only persist to localStorage if this is a real user proposal
    if (!isDemoProposal) {
      try {
        localStorage.setItem(`sv_accepted_${data.slug}`, "true");
      } catch (e) {}
    }

    try {
      confetti({
        particleCount: 180,
        spread: 130,
        origin: { y: 0.5 },
        colors: ["#fda4af", "#f472b6", "#fbbf24", "#ffffff", "#f43f5e"]
      });

      if (!isDemoProposal) {
        const res = await fetch("/api/respond-proposal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: data.slug,
            response: "accepted",
            partnerNote: partnerNote.trim()
          })
        });

        if (res.ok) {
          setHasAccepted(true);
        }
      } else {
        // In demo mode, immediately show full celebration & certificate in session
        setHasAccepted(true);
      }
    } catch (err) {
      console.error("Failed to submit proposal response:", err);
      setHasAccepted(true);
    } finally {
      setIsSubmittingAcceptance(false);
    }
  };

  const handleSendPartnerNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerNote.trim()) return;
    setIsSubmittingAcceptance(true);
    try {
      if (!isDemoProposal) {
        localStorage.setItem(`sv_accepted_${data.slug}`, "true");
        await fetch("/api/respond-proposal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: data.slug,
            response: "accepted",
            partnerNote: partnerNote.trim()
          })
        });
      }
      setNoteSubmitted(true);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#fda4af", "#fbbf24", "#ffffff"]
      });
    } catch (err) {
      setNoteSubmitted(true);
    } finally {
      setIsSubmittingAcceptance(false);
    }
  };

  const handleDodge = () => {
    if (!enableDodgeButton) return;
    const randomX = (Math.random() - 0.5) * 240;
    const randomY = (Math.random() - 0.5) * 160;
    setDodgePosition({ x: randomX, y: randomY });
    setDodgeCount(prev => prev + 1);
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `💍 I just said YES! 💖 Check out our forever moment: ${typeof window !== "undefined" ? window.location.href : ""}`
  )}`;

  return (
    <div className="min-h-screen text-[#fff5f7] font-serif relative overflow-x-hidden selection:bg-rose-500/30 selection:text-rose-100 bg-[#0a0714]">
      
      {/* 🌹 HIGH-DEFINITION ROMANTIC TERRACE GARDEN BACKDROP */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center sm:bg-center bg-no-repeat transition-transform duration-1000 scale-100 opacity-90"
        style={{
          backgroundImage: `url('/images/proposal-terrace-bg.jpg')`,
        }}
      />
      
      {/* Twilight Atmosphere Scrim & Vignette */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#0a0714]/75 via-[#160a18]/65 to-[#0b050f]/85 backdrop-blur-[1px]" />
      
      {/* Warm Sunset & Candlelight Ambient Glow Halos */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 w-[320px] sm:w-[650px] h-[280px] sm:h-[450px] bg-gradient-to-b from-amber-400/20 via-rose-500/15 to-transparent blur-[80px] sm:blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-[220px] sm:w-[400px] h-[220px] sm:h-[400px] bg-amber-500/10 blur-[80px] sm:blur-[110px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[220px] sm:w-[400px] h-[220px] sm:h-[400px] bg-rose-500/12 blur-[80px] sm:blur-[110px] rounded-full pointer-events-none z-0" />

      {/* Off-screen YouTube audio bridge */}
      <div 
        style={{ 
          position: "fixed", 
          bottom: 0, 
          right: 0, 
          width: "2px", 
          height: "2px", 
          opacity: 0.001, 
          zIndex: -100, 
          pointerEvents: "none" 
        }} 
        aria-hidden="true"
      >
        <div id="proposal-yt-audio" />
      </div>

      {/* Floating Canvas: Blush Petals, Stardust & Shooting Stars */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      {/* Floating Audio Controller with clean mobile spacing */}
      {isOpened && (
        <div className="fixed top-14 sm:top-5 right-3 sm:right-5 z-40 flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMusic}
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-black/85 via-[#1c0a1f]/85 to-black/85 border border-amber-300/40 text-rose-100 shadow-[0_0_30px_rgba(251,191,36,0.3)] backdrop-blur-2xl flex items-center gap-2 sm:gap-3 cursor-pointer font-sans text-xs group transition-all"
          >
            {isPlayingMusic ? (
              <>
                <div className="flex items-center gap-0.5 h-3 sm:h-3.5">
                  <span className="w-0.5 h-full bg-amber-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-0.5 h-2/3 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-0.5 h-full bg-pink-300 rounded-full animate-bounce [animation-delay:-0.45s]" />
                  <span className="w-0.5 h-1/2 bg-amber-200 rounded-full animate-bounce [animation-delay:-0.2s]" />
                </div>
                <span className="truncate max-w-[110px] sm:max-w-[140px] font-semibold text-rose-100 tracking-wide text-[11px] sm:text-xs">{songTitle}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />
                <span className="text-stone-400 font-medium tracking-wide text-[11px] sm:text-xs">Play Melody 🎵</span>
              </>
            )}
          </motion.button>
        </div>
      )}

      {/* 🌹 PHASE 1: REALISTIC 3D ENVELOPE OPENING WITH LETTER SLIDING FROM INSIDE (NO POPUP) */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="proposal-prelude"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96, pointerEvents: "none" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#090510]/95 backdrop-blur-2xl overflow-y-auto"
          >
            <div className="w-full max-w-xl flex flex-col items-center text-center space-y-6 py-6 my-auto">
              
              {/* Sacred Moonlight Badge */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1.5"
              >
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-300/50 text-[11px] sm:text-xs text-amber-200 font-sans font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(251,191,36,0.3)] backdrop-blur-md">
                  <Moon className="w-3.5 h-3.5 text-amber-300 fill-amber-300/40" /> A Sacred Love Letter
                </div>
                <p className="text-xs sm:text-sm text-rose-200/90 font-serif italic tracking-wide">
                  Handcrafted with eternal devotion by <strong className="text-amber-200 font-normal">{creatorName}</strong>
                </p>
              </motion.div>

              {/* 💌 REALISTIC 3D PARCHMENT ENVELOPE STRUCTURE */}
              <div className="relative w-full max-w-[460px] aspect-[1.5/1] perspective-[1200px] mt-12 sm:mt-16">
                
                {/* 1. ENVELOPE BACK INTERIOR POCKET (z-index: 1) */}
                <div 
                  className="absolute inset-0 rounded-[24px] sm:rounded-[28px] overflow-hidden border border-[#c4b19c]/80 shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_60px_rgba(244,114,182,0.2)]"
                  style={{
                    background: "linear-gradient(145deg, #d8cbba 0%, #c4b19c 100%)",
                    zIndex: 1
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent pointer-events-none" />
                </div>

                {/* 2. 📜 THE WRITTEN LETTER INSIDE (SLIDES UP FROM INSIDE ENVELOPE CAVITY) (z-index: 10) */}
                <motion.div
                  animate={
                    envelopeState === "letter_out"
                      ? { y: -160, scale: 1.05, opacity: 1 }
                      : { y: 0, scale: 0.96, opacity: 0.9 }
                  }
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-3 sm:inset-x-5 top-3 h-[92%] rounded-2xl bg-gradient-to-b from-[#fffefc] via-[#faf5eb] to-[#f3ebd9] border border-[#d6c4ae] p-5 sm:p-7 text-left flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.25)] select-none"
                  style={{
                    zIndex: 10
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-[#e2d3c1] pb-2">
                      <span className="text-[9px] uppercase font-sans tracking-[0.25em] text-[#846859] font-black block">
                        Chapter 0 • Dedicated Letter
                      </span>
                      <span className="text-sm">🌹</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif italic text-[#2c1810] leading-snug drop-shadow-sm font-normal pt-1">
                      "A thousand reasons to choose you... Every single day ♡"
                    </h3>
                  </div>

                  <div className="space-y-1.5 border-t border-[#dfcfbd] pt-3 text-[#4a352c] font-serif italic text-xs">
                    <p className="font-bold text-rose-950 text-sm">
                      For My Forever, {partnerName} 💖
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#5c463b] leading-relaxed">
                      "From the moment our paths crossed, you turned every ordinary day into pure poetry. Step into our starlit sanctuary where forever begins..."
                    </p>
                    <p className="text-[10px] text-[#7a6053] font-sans font-semibold pt-1">
                      — Forever yours, {creatorName}
                    </p>
                  </div>
                </motion.div>

                {/* 3. ENVELOPE FRONT POCKET (z-index: 20) */}
                <div 
                  className="absolute inset-0 rounded-[24px] sm:rounded-[28px] overflow-hidden pointer-events-none"
                  style={{
                    zIndex: 20
                  }}
                >
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 460 300">
                    <path d="M0,0 L230,160 L0,300 Z" fill="rgba(244, 237, 224, 0.94)" stroke="rgba(195, 174, 150, 0.4)" strokeWidth="1" />
                    <path d="M460,0 L230,160 L460,300 Z" fill="rgba(240, 232, 218, 0.94)" stroke="rgba(195, 174, 150, 0.4)" strokeWidth="1" />
                    <path d="M0,300 L230,160 L460,300 Z" fill="rgba(248, 242, 232, 0.97)" stroke="rgba(195, 174, 150, 0.55)" strokeWidth="1.2" />
                  </svg>

                  {/* Organic Twine Cross-Tie */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[4px] bg-[#9e805f] shadow-sm pointer-events-none"
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, #7c5f40, #7c5f40 2px, #b29777 2px, #b29777 4px)",
                      opacity: envelopeState === "sealed" ? 0.95 : 0.4,
                      transition: "opacity 0.4s"
                    }}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[4px] bg-[#9e805f] shadow-sm pointer-events-none"
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, #7c5f40, #7c5f40 2px, #b29777 2px, #b29777 4px)",
                      opacity: envelopeState === "sealed" ? 0.95 : 0.4,
                      transition: "opacity 0.4s"
                    }}
                  />

                  {/* Right-Hand Calligraphy Inscription ("For You ♡") */}
                  <div className="absolute right-5 sm:right-7 bottom-5 sm:bottom-7 text-right pointer-events-none select-none">
                    <span className="text-3xl sm:text-4xl font-serif italic text-[#3f2a24] font-normal tracking-wide drop-shadow-sm block">
                      For You ♡
                    </span>
                    <p className="text-[9px] font-serif italic text-[#7c6358] font-semibold tracking-wider pt-0.5">
                      Dedicated to {partnerName}
                    </p>
                  </div>
                </div>

                {/* 4. 🔺 TOP TRIANGULAR FLAP (FLIPS OPEN UPWARDS IN 3D) */}
                <motion.div
                  animate={
                    envelopeState === "flap_open" || envelopeState === "letter_out"
                      ? { rotateX: 180, zIndex: 5 }
                      : { rotateX: 0, zIndex: 30 }
                  }
                  transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-x-0 top-0 h-[56%] origin-top pointer-events-none"
                  style={{
                    transformStyle: "preserve-3d"
                  }}
                >
                  <svg className="w-full h-full drop-shadow-md" preserveAspectRatio="none" viewBox="0 0 460 165">
                    <polygon 
                      points="0,0 460,0 230,165" 
                      fill="#faf4ea" 
                      stroke="#d4c2ad" 
                      strokeWidth="1.2" 
                    />
                  </svg>
                </motion.div>

                {/* 5. 🔴 INTERTWINED TWIN HEARTS WAX SEAL */}
                {envelopeState === "sealed" && (
                  <motion.div
                    onClick={handleOpenEnvelope}
                    whileHover={{ scale: 1.12, rotate: 3 }}
                    whileTap={{ scale: 0.92 }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 sm:w-24 h-20 sm:h-24 rounded-full cursor-pointer flex items-center justify-center group"
                    style={{
                      zIndex: 40
                    }}
                    title="Click to break the wax seal and open the letter"
                  >
                    <div 
                      className="absolute inset-0 rounded-full shadow-[0_8px_30px_rgba(244,114,182,0.8),inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-3px_6px_rgba(90,20,35,0.7)] group-hover:shadow-[0_0_45px_rgba(251,191,36,0.9),0_10px_35px_rgba(244,114,182,0.9)] transition-all animate-pulse"
                      style={{
                        background: "radial-gradient(circle at 35% 35%, #fca5a5 0%, #e17188 40%, #be3b59 75%, #881b33 100%)",
                        border: "2px solid rgba(255, 228, 230, 0.6)"
                      }}
                    />

                    <div className="absolute inset-2.5 sm:inset-3 rounded-full border border-rose-200/70 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center">
                      <svg className="w-8 sm:w-10 h-8 sm:h-10 fill-rose-100 drop-shadow-[0_1px_3px_rgba(60,10,20,0.9)]" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" opacity="0.95" />
                        <path d="M7 14 C9 12, 13 10, 17 8 M10 11 C11 10, 12 9, 13 8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                      </svg>
                    </div>

                    <div className="absolute -top-7 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 border border-amber-200 text-[9px] font-sans font-black uppercase tracking-widest text-stone-950 whitespace-nowrap shadow-[0_0_15px_rgba(251,191,36,0.6)]">
                      ✨ Click Seal
                    </div>
                  </motion.div>
                )}

              </div>

              {/* Action Controls & Instruction */}
              <div className="pt-8 flex flex-col items-center gap-3.5">
                {envelopeState === "sealed" ? (
                  <>
                    <motion.button
                      onClick={handleOpenEnvelope}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-10 py-4 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-stone-950 font-sans font-black text-sm uppercase tracking-widest shadow-[0_0_50px_rgba(244,114,182,0.7),0_0_30px_rgba(251,191,36,0.5)] hover:shadow-[0_0_70px_rgba(251,191,36,0.9)] transition-all cursor-pointer flex items-center gap-3 border border-amber-200 relative overflow-hidden group"
                    >
                      <span className="text-xl">💌</span>
                      <span>Break Seal & Open Letter</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                    </motion.button>
                    
                    <p className="text-xs text-amber-200 font-sans tracking-widest uppercase font-semibold flex items-center gap-1.5 animate-pulse drop-shadow-md">
                      <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Tap the rose gold wax seal to unseal our forever love letter
                    </p>
                  </>
                ) : envelopeState === "letter_out" ? (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleEnterFullWebsite}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4.5 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-stone-950 font-sans font-black text-sm sm:text-base uppercase tracking-widest shadow-[0_0_60px_rgba(244,114,182,0.9),0_0_40px_rgba(251,191,36,0.7)] hover:shadow-[0_0_80px_rgba(251,191,36,1)] transition-all cursor-pointer flex items-center gap-3 border-2 border-amber-200 relative overflow-hidden group"
                  >
                    <span>Step Into Our Starlit Terrace 🌹</span>
                    <ChevronDown className="w-5 h-5 text-stone-950 animate-bounce" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  </motion.button>
                ) : null}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌹 PHASE 2: MAIN PROPOSAL SCROLLABLE JOURNEY */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-12 sm:space-y-20 relative z-20 text-center">
        
        {/* 1. HERO SECTION: FULL MOON & ROSE BLOSSOM TRIBUTE */}
        <section className="space-y-6 sm:space-y-8 pt-4 sm:pt-6">
          
          <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/60 border border-amber-400/40 text-[11px] sm:text-xs font-sans text-amber-200 uppercase tracking-[0.25em] font-bold shadow-xl backdrop-blur-xl">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" /> Written Under The Starlit Sky
          </div>

          <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-6xl md:text-7xl font-normal italic leading-tight py-1 sm:py-2 flex items-center justify-center flex-wrap gap-x-3 gap-y-1">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-rose-100 to-pink-100 drop-shadow-[0_4px_25px_rgba(244,114,182,0.4)]">
                {headlineClean}
              </span>
              <span className="inline-block not-italic text-rose-500 drop-shadow-[0_0_16px_rgba(244,63,94,0.7)] text-3xl sm:text-5xl select-none animate-pulse">
                🌹
              </span>
            </h1>
            <p className="text-xs sm:text-base md:text-lg text-rose-200/85 font-sans font-light italic leading-relaxed max-w-xl mx-auto">
              "Underneath a sky full of stars, amidst thousands of blooming roses, there is only you."
            </p>
          </div>

          {/* Live Love Stats Counter (macOS Liquid Glass) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-md mx-auto pt-2 text-center">
            <div className="liquid-water-pill p-3 sm:p-3.5 rounded-2xl">
              <div className="macos-water-lens-edge" />
              <div className="liquid-specular-edge" />
              <div className="liquid-caustic-ambient" />
              <div className="relative z-10">
                <span className="text-lg sm:text-2xl font-serif font-black text-amber-300 block">∞</span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-sans text-rose-200/80 font-semibold">Shared Smiles</span>
              </div>
            </div>
            <div className="liquid-water-pill p-3 sm:p-3.5 rounded-2xl">
              <div className="macos-water-lens-edge" />
              <div className="liquid-specular-edge" />
              <div className="liquid-caustic-ambient" />
              <div className="relative z-10">
                <span className="text-lg sm:text-2xl font-serif font-black text-rose-300 block">100%</span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-sans text-rose-200/80 font-semibold">Devotion</span>
              </div>
            </div>
            <div className="liquid-water-pill p-3 sm:p-3.5 rounded-2xl">
              <div className="macos-water-lens-edge" />
              <div className="liquid-specular-edge" />
              <div className="liquid-caustic-ambient" />
              <div className="relative z-10">
                <span className="text-lg sm:text-2xl font-serif font-black text-pink-300 block">Forever</span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-sans text-rose-200/80 font-semibold">Destiny</span>
              </div>
            </div>
          </div>

          {/* Terrace Panorama Feature Card (macOS Liquid Water Glass Frame) */}
          <div className="pt-2 sm:pt-4 flex justify-center">
            <div className="liquid-water-card w-full max-w-lg p-3 sm:p-5 rounded-[36px] sm:rounded-[48px] group">
              <div className="macos-water-lens-edge" />
              <div className="liquid-specular-edge" />
              <div className="liquid-water-bottom-edge" />
              <div className="liquid-caustic-ambient" />
              <div className="liquid-sheen-sweep" />
              <div className="w-full aspect-[4/3] rounded-[26px] sm:rounded-[36px] overflow-hidden border border-white/20 relative shadow-inner z-10">
                <img 
                  src="/images/proposal-terrace-bg.jpg" 
                  alt="Our Romantic Terrace" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 brightness-95" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] text-amber-200 font-sans font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Moon className="w-3 h-3 text-amber-300" /> Starlight & Roses
                </div>

                <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 text-center px-4">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] font-sans text-rose-100 font-black drop-shadow-lg block">
                    {partnerName} & {creatorName} • Forever Sealed 💖
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rose Petal & Candlelight Divider */}
          <div className="flex items-center justify-center gap-4 pt-4 sm:pt-6">
            <div className="h-[1px] w-20 sm:w-32 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 fill-rose-400/40 animate-pulse" />
            <div className="h-[1px] w-20 sm:w-32 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
          </div>

        </section>

        {/* 2. THREE EDITORIAL CHAPTERS OF US (macOS LIQUID GLASS CARDS) */}
        <section className="space-y-12">
          
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] font-sans text-amber-300 font-bold block">
              The Story of Us
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-rose-100 italic">Three Moments That Changed Everything</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Chapter 1 Card (macOS Liquid Glass) */}
            <div className="liquid-water-card p-8 rounded-[36px] space-y-4 group">
              <div className="macos-water-lens-edge" />
              <div className="liquid-specular-edge" />
              <div className="liquid-water-bottom-edge" />
              <div className="liquid-caustic-ambient" />
              <div className="liquid-sheen-sweep" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-inner backdrop-blur-md">
                    <Flame className="w-5 h-5 fill-amber-300/20" />
                  </div>
                  <span className="text-2xl font-serif italic text-amber-300/60 font-bold">01</span>
                </div>
                <h3 className="text-xl font-bold text-rose-100 italic pt-1">
                  {chapter1Title}
                </h3>
                <p className="text-xs sm:text-sm text-rose-200/90 font-sans font-light leading-relaxed">
                  {chapter1Text}
                </p>
              </div>
            </div>

            {/* Chapter 2 Card (macOS Liquid Glass) */}
            <div className="liquid-water-card p-8 rounded-[36px] space-y-4 group">
              <div className="macos-water-lens-edge" />
              <div className="liquid-specular-edge" />
              <div className="liquid-water-bottom-edge" />
              <div className="liquid-caustic-ambient" />
              <div className="liquid-sheen-sweep" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shadow-inner backdrop-blur-md">
                    <Heart className="w-5 h-5 fill-rose-300/20" />
                  </div>
                  <span className="text-2xl font-serif italic text-rose-300/60 font-bold">02</span>
                </div>
                <h3 className="text-xl font-bold text-rose-100 italic pt-1">
                  {chapter2Title}
                </h3>
                <p className="text-xs sm:text-sm text-rose-200/90 font-sans font-light leading-relaxed">
                  {chapter2Text}
                </p>
              </div>
            </div>

            {/* Chapter 3 Card (macOS Liquid Glass) */}
            <div className="liquid-water-card p-8 rounded-[36px] space-y-4 group">
              <div className="macos-water-lens-edge" />
              <div className="liquid-specular-edge" />
              <div className="liquid-water-bottom-edge" />
              <div className="liquid-caustic-ambient" />
              <div className="liquid-sheen-sweep" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-inner backdrop-blur-md">
                    <Stars className="w-5 h-5 fill-amber-300/20" />
                  </div>
                  <span className="text-2xl font-serif italic text-amber-300/60 font-bold">03</span>
                </div>
                <h3 className="text-xl font-bold text-rose-100 italic pt-1">
                  {chapter3Title}
                </h3>
                <p className="text-xs sm:text-sm text-rose-200/90 font-sans font-light leading-relaxed">
                  {chapter3Text}
                </p>
              </div>
            </div>

          </div>

        </section>

        {/* 🌌 3. OUR CELESTIAL CONSTELLATION MAP (macOS LIQUID GLASS) */}
        {enableConstellation && (
          <section className="liquid-water-card p-8 sm:p-12 rounded-[40px] sm:rounded-[48px] space-y-8 relative">
            <div className="macos-water-lens-edge" />
            <div className="liquid-specular-edge" />
            <div className="liquid-water-bottom-edge" />
            <div className="liquid-caustic-ambient" />
            <div className="liquid-sheen-sweep" />
            
            <div className="space-y-2 relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-300/40 text-xs font-sans text-amber-200 font-bold uppercase tracking-widest backdrop-blur-md">
                <Stars className="w-3.5 h-3.5 text-amber-400" /> Celestial Alignment
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-rose-100 italic">Our Constellation Map</h2>
              <p className="text-xs sm:text-sm text-rose-200/80 font-sans font-light max-w-md mx-auto">
                Tap each glowing star node to reveal the cosmic alignment that drew our souls together.
              </p>
            </div>

            {/* Interactive Star Constellation Line Hub */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 relative z-10">
              {constellationNodes.map((node) => {
                const isSelected = activeConstellation === node.id;
                return (
                  <motion.button
                    key={`node-${node.id}`}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveConstellation(node.id)}
                    className={`px-5 py-2.5 rounded-full text-xs font-sans font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 relative overflow-hidden ${
                      isSelected
                        ? "bg-gradient-to-r from-amber-400 via-rose-300 to-amber-300 text-stone-950 shadow-[0_0_35px_rgba(251,191,36,0.8)] border border-amber-200 scale-105"
                        : "liquid-water-pill text-rose-100"
                    }`}
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isSelected ? "text-stone-950 animate-spin" : "text-amber-300"}`} />
                    <span>{node.title}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Active Constellation Focus Card (macOS Liquid Glass) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeConstellation}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="liquid-water-card p-7 sm:p-9 rounded-[32px] max-w-xl mx-auto text-center space-y-3 relative z-10"
              >
                <div className="macos-water-lens-edge" />
                <div className="liquid-specular-edge" />
                <div className="liquid-water-bottom-edge" />
                <div className="liquid-caustic-ambient" />
                <div className="relative z-10 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center mx-auto text-amber-300 shadow-inner">
                    <Stars className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-sans text-amber-300 font-extrabold block">
                    {constellationNodes[activeConstellation]?.subtitle || constellationNodes[0]?.subtitle}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif italic text-rose-100 font-normal">
                    "{constellationNodes[activeConstellation]?.title || constellationNodes[0]?.title}"
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-200/90 font-serif italic leading-relaxed pt-1 max-w-md mx-auto">
                    "{constellationNodes[activeConstellation]?.quote || constellationNodes[0]?.quote}"
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

          </section>
        )}

        {/* 🌟 4. THE SACRED LIFETIME PROMISES (macOS LIQUID GLASS) */}
        {enablePromises && (
          <section className="space-y-10">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-300/40 text-xs font-sans text-amber-200 font-bold uppercase tracking-widest backdrop-blur-md">
                <Stars className="w-3.5 h-3.5 text-amber-400" /> Sacred Vows & Commitments
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-rose-100 italic">
                Our Infinite Promises
              </h2>
              <p className="text-xs sm:text-sm text-rose-200/80 font-sans font-light max-w-md mx-auto">
                Tap each glowing star card to reveal a lifetime vow written exclusively for you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {sacredPromises.map((promise, idx) => {
                const isUnlocked = unlockedPromises[idx];
                return (
                  <motion.div
                    key={`promise-${idx}`}
                    onClick={() => togglePromise(idx)}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    className={`liquid-water-card p-7 rounded-[32px] cursor-pointer group ${
                      isUnlocked
                        ? "border-amber-300/50 shadow-[0_0_40px_rgba(251,191,36,0.3)]"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <div className="macos-water-lens-edge" />
                    <div className="liquid-specular-edge" />
                    <div className="liquid-water-bottom-edge" />
                    <div className="liquid-caustic-ambient" />
                    <div className="liquid-sheen-sweep" />

                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center justify-between pb-3.5 border-b border-white/15">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                          isUnlocked 
                            ? "bg-amber-400/25 text-amber-300 border border-amber-300/60 shadow-inner" 
                            : "bg-white/10 text-rose-200 border border-white/20"
                        }`}>
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-sans uppercase font-black tracking-widest text-amber-300/90">
                          Promise 0{idx + 1}
                        </span>
                      </div>

                      <h3 className="text-lg font-serif italic text-rose-100 font-bold pt-3 pb-1">
                        {promise.title}
                      </h3>

                      <p className={`text-xs font-sans leading-relaxed transition-all duration-300 ${
                        isUnlocked ? "text-rose-200/95 font-light" : "text-rose-300/40 blur-[4px] select-none"
                      }`}>
                        {promise.text}
                      </p>

                      {!isUnlocked && (
                        <div className="absolute inset-0 -m-7 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-[32px] transition-colors">
                          <span className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 via-rose-300 to-amber-300 text-stone-950 text-[10px] font-sans font-black uppercase tracking-widest shadow-[0_0_20px_rgba(251,191,36,0.6)] border border-amber-200 flex items-center gap-1.5 hover:scale-105 transition-transform">
                            <Sparkles className="w-3 h-3 text-stone-950" /> Tap to Reveal
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </section>
        )}

        {/* 🎟️ 5. REDEEMABLE LOVE COUPONS (macOS LIQUID GLASS) */}
        {enableLoveCoupons && (
          <section className="space-y-10">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-300/40 text-xs font-sans text-rose-200 font-bold uppercase tracking-widest backdrop-blur-md">
                <Ticket className="w-3.5 h-3.5 text-rose-400" /> Tokens of Affection
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-rose-100 italic">Redeemable Love Tokens</h2>
              <p className="text-xs sm:text-sm text-rose-200/80 font-sans font-light max-w-md mx-auto">
                Exclusive keepsake vouchers for {partnerName}. Tap "Redeem" to claim your special moment anytime!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {loveCoupons.map((coupon) => {
                const IconComp = coupon.icon;
                const isClaimed = claimedCoupons[coupon.id];
                return (
                  <motion.div
                    key={`coupon-${coupon.id}`}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="liquid-water-card p-7 rounded-[34px] flex flex-col justify-between group"
                  >
                    <div className="macos-water-lens-edge" />
                    <div className="liquid-specular-edge" />
                    <div className="liquid-water-bottom-edge" />
                    <div className="liquid-caustic-ambient" />
                    <div className="liquid-sheen-sweep" />

                    <div className="space-y-3.5 relative z-10">
                      <div className="flex items-center justify-between border-b border-white/15 pb-3">
                        <span className="px-3.5 py-1 rounded-full bg-white/10 text-rose-100 text-[10px] font-sans font-black uppercase tracking-widest border border-white/20 backdrop-blur-md">
                          {coupon.badge}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-inner">
                          <IconComp className="w-4 h-4" />
                        </div>
                      </div>

                      <h3 className="text-lg font-serif italic text-rose-100 font-bold">
                        {coupon.title}
                      </h3>

                      <p className="text-xs text-rose-200/90 font-sans font-light leading-relaxed">
                        {coupon.desc}
                      </p>
                    </div>

                    <div className="pt-6 flex items-center justify-between border-t border-white/15 mt-4 relative z-10">
                      <span className="text-[9px] text-amber-200/80 font-sans tracking-widest uppercase font-bold">
                        Valid for Lifetime ♡
                      </span>
                      {isClaimed ? (
                        <span className="px-4 py-2 rounded-full bg-emerald-500/25 border border-emerald-400/60 text-emerald-300 text-[10px] font-sans font-black tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Claimed ♡
                        </span>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.94 }}
                          onClick={() => claimCoupon(coupon.id)}
                          className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 via-rose-300 to-amber-300 text-stone-950 text-[10px] font-sans font-black tracking-widest uppercase shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:shadow-[0_0_30px_rgba(251,191,36,0.9)] transition-all cursor-pointer border border-amber-200 relative overflow-hidden group/btn"
                        >
                          <span className="relative z-10 flex items-center gap-1">Redeem ✨</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none" />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </section>
        )}

        {/* 💖 6. WHAT I ADORE ABOUT YOU (macOS LIQUID GLASS) */}
        {enableReasonsWhy && (
          <section className="space-y-10">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-300/40 text-xs font-sans text-rose-200 font-bold uppercase tracking-widest backdrop-blur-md">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" /> In Every Small Detail
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-rose-100 italic">Why You Are My Favorite Person</h2>
              <p className="text-xs sm:text-sm text-rose-200/80 font-sans font-light max-w-md mx-auto">
                It’s not just the grand milestones—it’s the million quiet, beautiful moments that make you irreplaceable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {microThings.map((thing, idx) => {
                const IconComponent = thing.icon;
                return (
                  <motion.div 
                    key={`thing-${idx}`}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="liquid-water-card p-7 rounded-[32px] space-y-3.5 group"
                  >
                    <div className="macos-water-lens-edge" />
                    <div className="liquid-specular-edge" />
                    <div className="liquid-water-bottom-edge" />
                    <div className="liquid-caustic-ambient" />
                    <div className="relative z-10 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-rose-300 group-hover:scale-110 transition-transform shadow-inner backdrop-blur-md">
                        <IconComponent className="w-5 h-5 text-amber-300" />
                      </div>

                      <h3 className="text-lg font-serif italic text-rose-100 font-bold">
                        {thing.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-rose-200/90 font-sans font-light leading-relaxed">
                        {thing.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </section>
        )}

        {/* 📜 7. SECRET WHISPERS (3D FLIP macOS LIQUID GLASS CARDS) */}
        {enableWhispers && (
          <section className="space-y-10">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-300/40 text-xs font-sans text-amber-200 font-bold uppercase tracking-widest backdrop-blur-md">
                <Feather className="w-3.5 h-3.5 text-amber-400" /> Private Love Notes
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-rose-100 italic">Whispers in the Night</h2>
              <p className="text-xs sm:text-sm text-rose-200/80 font-sans font-light max-w-md mx-auto">
                Tap any wax-sealed parchment card to flip it over in 3D and read an intimate secret letter.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              {whisperCards.map((card) => {
                const isFlipped = flippedCards[card.id];
                return (
                  <div
                    key={`whisper-${card.id}`}
                    onClick={() => toggleFlipWhisper(card.id)}
                    className="cursor-pointer perspective-[1200px] min-h-[230px]"
                  >
                    <motion.div
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="w-full h-full relative"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Front Face (macOS Liquid Glass Sealed Card) */}
                      <div 
                        className={`liquid-water-card absolute inset-0 p-7 rounded-[34px] flex flex-col justify-between ${
                          isFlipped ? "pointer-events-none" : ""
                        }`}
                        style={{
                          backfaceVisibility: "hidden"
                        }}
                      >
                        <div className="macos-water-lens-edge" />
                        <div className="liquid-specular-edge" />
                        <div className="liquid-water-bottom-edge" />
                        <div className="liquid-caustic-ambient" />
                        <div className="liquid-sheen-sweep" />

                        <div className="space-y-2.5 relative z-10">
                          <div className="flex items-center justify-between border-b border-white/15 pb-2">
                            <span className="text-[10px] uppercase font-sans tracking-widest text-amber-300 font-extrabold">
                              Secret Letter 0{card.id + 1}
                            </span>
                            <span className="text-sm">💌</span>
                          </div>
                          <h3 className="text-xl font-serif italic text-rose-100 font-bold">
                            {card.title}
                          </h3>
                          <p className="text-xs text-rose-200/90 font-sans italic leading-relaxed">
                            "{card.preview}"
                          </p>
                        </div>

                        <div className="pt-4 flex items-center justify-between border-t border-white/15 relative z-10">
                          <span className="px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/50 text-[10px] uppercase font-sans tracking-widest text-amber-200 font-bold flex items-center gap-1.5 shadow-sm backdrop-blur-md">
                            <RotateCcw className="w-3 h-3 text-amber-300" /> Tap to Flip & Read
                          </span>
                          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/25 flex items-center justify-center text-rose-200 text-xs shadow-inner">
                            ♡
                          </div>
                        </div>
                      </div>

                      {/* Back Face (Unfolded Parchment Letter) */}
                      <div 
                        className={`absolute inset-0 p-7 rounded-[34px] bg-gradient-to-b from-[#fffefc] via-[#f9f2e4] to-[#ede1ce] text-stone-900 border-2 border-[#d6c4ae] shadow-2xl flex flex-col justify-between ${
                          !isFlipped ? "pointer-events-none" : ""
                        }`}
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                          boxShadow: "0 25px 50px rgba(0,0,0,0.7)"
                        }}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between border-b border-[#dfcfbd] pb-2">
                            <span className="text-[10px] uppercase font-sans tracking-widest text-[#846859] font-black">
                              For {partnerName} ♡
                            </span>
                            <span className="text-sm">🌹</span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#4a352c] font-serif italic leading-relaxed pt-1">
                            "{card.letter}"
                          </p>
                        </div>

                        <div className="pt-2 text-right border-t border-[#dfcfbd]/60">
                          <span className="text-xs text-[#7a6053] font-sans font-bold">
                            — Forever yours, {creatorName}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>

          </section>
        )}

        {/* ✈️ 8. OUR FOREVER BUCKET LIST (macOS LIQUID GLASS) */}
        {enableBucketList && (
          <section className="liquid-water-card p-6 sm:p-12 rounded-[36px] sm:rounded-[48px] space-y-7 text-left relative">
            <div className="macos-water-lens-edge" />
            <div className="liquid-specular-edge" />
            <div className="liquid-water-bottom-edge" />
            
            <div className="space-y-2 text-center max-w-md mx-auto relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-300/40 text-xs font-sans text-amber-200 font-bold uppercase tracking-widest backdrop-blur-md">
                <Compass className="w-3.5 h-3.5 text-amber-400" /> Adventures Ahead
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-rose-100 italic">Our Forever Bucket List</h2>
              <p className="text-xs sm:text-sm text-rose-200/80 font-sans font-light">
                Milestones and magical dreams we will conquer hand-in-hand. Tap to check off our journey!
              </p>
            </div>

            <div className="space-y-3 max-w-2xl mx-auto pt-1 relative z-10">
              {bucketList.map((item, idx) => {
                const isChecked = checkedBucketItems[idx];
                return (
                  <motion.div
                    key={`bucket-${idx}`}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleBucketItem(idx)}
                    className={`liquid-water-pill p-3.5 sm:p-4 rounded-2xl cursor-pointer flex items-start sm:items-center gap-3.5 transition-all duration-300 ${
                      isChecked
                        ? "bg-gradient-to-r from-rose-500/25 via-pink-500/20 to-amber-500/20 border-rose-300/50 shadow-[0_0_20px_rgba(244,114,182,0.25)]"
                        : "border-white/20 hover:border-white/35"
                    }`}
                  >
                    {/* Satisfying Tactile Circular Checkmark */}
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 mt-0.5 sm:mt-0 ${
                      isChecked 
                        ? "bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 border border-amber-200 text-stone-950 shadow-[0_0_15px_rgba(244,114,182,0.6)] scale-105" 
                        : "border-2 border-rose-300/40 bg-white/[0.04] text-transparent hover:border-amber-300/80"
                    }`}>
                      {isChecked && (
                        <motion.div
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 450, damping: 20 }}
                        >
                          <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-stone-950 stroke-[3]" />
                        </motion.div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className={`text-xs sm:text-sm font-sans leading-snug select-none transition-all block ${
                        isChecked 
                          ? "text-rose-100 font-medium line-through opacity-85" 
                          : "text-rose-200/90 font-light"
                      }`}>
                        {item.text}
                      </span>
                    </div>

                    {isChecked && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-wider text-amber-300/90 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 flex-shrink-0">
                        <Sparkles className="w-3 h-3 text-amber-300" /> Done
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>

          </section>
        )}

        {/* 📸 10. MEMORY VAULT & POLAROIDS */}
        {enableMemoryVault && (
          <section className="space-y-10">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-300/40 text-xs font-sans text-amber-200 font-bold uppercase tracking-widest backdrop-blur-md">
                <Camera className="w-3.5 h-3.5 text-amber-400" /> Memory Keepsakes
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-rose-100 italic">Moments Etched in Starlight</h2>
              <p className="text-xs sm:text-sm text-rose-200/80 font-sans font-light max-w-md mx-auto">
                Frames from our shared memories that I will treasure through every chapter.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {memoryKeepsakes.map((card, idx) => (
                <motion.div
                  key={`memory-${idx}`}
                  whileHover={{ y: -8, rotate: idx % 2 === 0 ? 1.5 : -1.5, scale: 1.02 }}
                  className="liquid-water-card p-5 rounded-[28px] text-stone-900 space-y-3 group"
                >
                  <div className="macos-water-lens-edge" />
                  <div className="liquid-specular-edge" />
                  <div className="liquid-water-bottom-edge" />
                  <div className="liquid-caustic-ambient" />
                  
                  <div className="relative z-10 space-y-3">
                    <div className="w-12 h-3.5 bg-amber-200/70 mx-auto rounded-sm -mt-2 opacity-80 rotate-1 shadow-sm" />

                    <div className="w-full aspect-[4/3] rounded-2xl bg-stone-900 overflow-hidden relative shadow-inner border border-stone-300/40">
                      <img 
                        src="/images/proposal-terrace-bg.jpg" 
                        alt={card.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95" 
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-sans font-bold text-amber-200 uppercase tracking-widest border border-amber-300/30">
                        {card.tag}
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <h4 className="text-base font-serif italic text-rose-100 font-bold">
                        {card.title}
                      </h4>
                      <p className="text-[11px] font-serif italic text-rose-200/85 leading-relaxed">
                        "{card.desc}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </section>
        )}

        {/* 💍 12. THE PROPOSAL GRAND CLIMAX BOX (macOS LIQUID WATER GLASS) */}
        <section className="liquid-water-card p-8 sm:p-14 rounded-[48px] space-y-10 relative text-center border border-white/30 shadow-[0_0_100px_rgba(244,114,182,0.35)]">
          <div className="macos-water-lens-edge" />
          <div className="liquid-specular-edge" />
          <div className="liquid-water-bottom-edge" />
          <div className="liquid-caustic-ambient" />
          <div className="liquid-sheen-sweep" />
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-4 max-w-xl mx-auto">
              <span className="text-xs uppercase tracking-[0.35em] font-sans text-amber-300 font-black block">
                The Question That Changes Tomorrow
              </span>
              <h2 className="text-4xl sm:text-6xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-rose-100 to-pink-100 italic leading-snug drop-shadow-[0_2px_25px_rgba(244,114,182,0.5)]">
                "{proposalQuestion}"
              </h2>
            </div>

            {/* Interactive Decision Action Hub */}
            {!hasAccepted ? (
              <div className="space-y-8 max-w-md mx-auto pt-4">
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative min-h-[120px]">
                  
                  {/* 💍 The Glorious "YES!" Button */}
                  <motion.button
                    onClick={handleAcceptProposal}
                    disabled={isSubmittingAcceptance}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.94 }}
                    className="px-12 py-5 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-stone-950 font-sans font-black text-lg sm:text-xl shadow-[0_0_60px_rgba(244,114,182,0.9),0_0_100px_rgba(251,191,36,0.7)] hover:shadow-[0_0_90px_rgba(251,191,36,1)] transition-all cursor-pointer flex items-center gap-3 border-2 border-amber-200 relative overflow-hidden group animate-pulse"
                  >
                    <span className="text-2xl animate-bounce">💍</span>
                    <span>YES! Forever & Always! 💖</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  </motion.button>

                  {/* 🙈 Playful Dodge Button ("Let Me Think") */}
                  {enableDodgeButton && (
                    <motion.button
                      onMouseEnter={handleDodge}
                      onTouchStart={handleDodge}
                      animate={{ x: dodgePosition.x, y: dodgePosition.y }}
                      transition={{ type: "spring", stiffness: 360, damping: 24 }}
                      className="px-6 py-3.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/30 text-rose-200/90 font-sans font-bold text-xs uppercase tracking-wider shadow-lg backdrop-blur-xl cursor-pointer transition-colors"
                    >
                      {dodgePhrases[dodgeCount % dodgePhrases.length]}
                    </motion.button>
                  )}

                </div>

                <p className="text-xs text-amber-200/90 font-sans italic">
                  P.S. Saying yes means endless stargazing, warm laughs, and a lifetime of shared sunsets. ✨
                </p>

              </div>
            ) : (
              /* 🏆 THE LOVE PACT & CERTIFICATE OF FOREVER (macOS LIQUID GLASS) */
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="space-y-8 max-w-xl mx-auto pt-2"
              >
                <div className="liquid-water-card p-8 sm:p-10 rounded-[40px] border border-white/35 space-y-6 text-left relative">
                  <div className="macos-water-lens-edge" />
                  <div className="liquid-specular-edge" />
                  <div className="liquid-water-bottom-edge" />
                  <div className="liquid-caustic-ambient" />
                  <div className="liquid-sheen-sweep" />

                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/20 pb-4">
                      <div>
                        <span className="text-[10px] font-sans font-black text-amber-300 uppercase tracking-widest block">
                          Certificate of Forever
                        </span>
                        <h4 className="text-2xl sm:text-3xl font-serif font-bold text-rose-100 italic">
                          The Official Love Pact 📜
                        </h4>
                      </div>
                      <Award className="w-10 h-10 text-amber-300" />
                    </div>

                    <div className="space-y-3 font-sans text-xs sm:text-sm text-rose-200/90 leading-relaxed">
                      <p>
                        <strong className="text-rose-100 font-serif text-base">{partnerName}</strong> has officially answered with a joyful <strong className="text-amber-300 font-black">YES!</strong> to <strong className="text-rose-100 font-serif text-base">{creatorName}</strong>.
                      </p>
                      <p className="italic text-amber-200/90 font-serif text-sm">
                        "From this day onward, every laugh belongs to us, every sunset is ours to share, and every tomorrow is a promise kept."
                      </p>
                    </div>

                    {/* Secret Note from Creator */}
                    {secretLoveNote && (
                      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#fef3c7]/95 to-[#fef9c3]/90 border border-amber-300/80 shadow-lg space-y-2 text-stone-900">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-sans tracking-widest text-rose-900 font-black block">
                            Secret Love Letter 💌
                          </span>
                          <span className="text-sm">🌹</span>
                        </div>
                        <p className="text-xs sm:text-sm text-stone-800 font-serif italic leading-relaxed">
                          "{secretLoveNote}"
                        </p>
                      </div>
                    )}

                    {/* Partner Response Note Form */}
                    {!noteSubmitted ? (
                      <form onSubmit={handleSendPartnerNote} className="space-y-3 pt-2">
                        <label className="text-[11px] uppercase tracking-wider text-rose-300 font-sans font-bold block">
                          Write a note back to {creatorName}:
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                          <input
                            type="text"
                            placeholder="e.g. You made my entire year! I love you so much ❤️"
                            value={partnerNote}
                            onChange={(e) => setPartnerNote(e.target.value)}
                            className="w-full min-w-0 flex-1 px-4 py-3.5 rounded-2xl bg-white/[0.08] border border-white/25 text-xs text-rose-100 placeholder-rose-200/50 focus:outline-none focus:border-amber-300 backdrop-blur-md"
                          />
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            type="submit"
                            disabled={isSubmittingAcceptance || !partnerNote.trim()}
                            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 text-stone-950 font-sans font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-md flex-shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" /> Send Note
                          </motion.button>
                        </div>
                      </form>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-400/40 text-emerald-200 text-xs font-sans flex items-center gap-2 backdrop-blur-md">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Your sweet note has been sent to {creatorName}! 💖</span>
                      </div>
                    )}

                    {/* Share on WhatsApp */}
                    <div className="pt-3 text-center">
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={whatsappShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-3xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-sans font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(37,211,102,0.4)] transition-all"
                      >
                        <MessageCircle className="w-4 h-4" /> Share The Joy on WhatsApp
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* 🥂 13. CELEBRATION DATE / SPECIAL MOMENT (macOS LIQUID GLASS) */}
        {celebrationDateTime && (
          <section className="liquid-water-card p-8 sm:p-10 rounded-[40px] space-y-4 text-center max-w-xl mx-auto relative">
            <div className="macos-water-lens-edge" />
            <div className="liquid-specular-edge" />
            <div className="liquid-water-bottom-edge" />
            <div className="liquid-caustic-ambient" />
            <div className="liquid-sheen-sweep" />

            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/25 flex items-center justify-center mx-auto text-amber-300 shadow-inner backdrop-blur-md">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs uppercase tracking-[0.25em] font-sans text-amber-300 font-extrabold block">
                  {celebrationTitle}
                </span>
                <p className="text-2xl font-serif text-rose-100 italic">
                  {celebrationDateTime}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 🌹 14. FOOTER (CLEAN ROMANTIC SIGNATURE, STRICTLY ZERO QR CODE) */}
        <footer className="pt-12 pb-8 border-t border-rose-300/20 space-y-4 text-center font-sans">
          <p className="text-xs text-rose-300/80">
            Crafted with infinite love under the starlit sky by <strong className="text-rose-100">{creatorName}</strong> for <strong className="text-rose-100">{partnerName}</strong>.
          </p>
          <p className="text-[10px] text-rose-400/50 uppercase tracking-widest">
            Sealed with Love • SealedVibe
          </p>
        </footer>

      </main>

    </div>
  );
}

