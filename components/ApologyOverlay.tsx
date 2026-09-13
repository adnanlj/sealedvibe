"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import ScratchCard from "./ScratchCard";
import HeartbeatPulsator from "./EndingSurprises/HeartbeatPulsator";
import CinematicCredits from "./CinematicCredits";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  HeartHandshake,
  Download,
  Mail,
  Volume2,
  VolumeX,
  Music
} from "lucide-react";

// Web Audio API Fallback Engine for Romantic Ambient Harmonies (Piano / Soft Acoustic Chords)
class RomanticApologyAudioEngine {
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
      this.playWarmAmbientPad();
      this.scheduleHarmonicMelody();
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

  private playWarmAmbientPad() {
    if (!this.ctx || !this.isPlaying) return;
    // Ambient warm lush chord (F3, A3, C4, E4)
    const baseFreqs = [174.61, 220.00, 261.63, 329.63];
    baseFreqs.forEach((freq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.012, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
    });
  }

  private scheduleHarmonicMelody() {
    // Gentle heartfelt notes (C Major / F Lydian scale)
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 523.25, 587.33];
    const melody = [0, 2, 4, 3, 2, 0, 4, 5, 7, 5, 4, 2, 0, 3, 2, 0];
    let step = 0;

    this.timer = setInterval(() => {
      if (!this.ctx || !this.isPlaying) return;
      const freq = notes[melody[step % melody.length]];
      step++;
      this.playSoftBell(freq);
    }, 650);
  }

  private playSoftBell(freq: number) {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.exponentialRampToValueAtTime(250, now + 1.4);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.035, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.45);
    } catch (e) {}
  }
}

interface ApologyOverlayProps {
  data: {
    slug: string;
    creatorName: string;
    recipientName: string;
    relationshipType: string;
    occasion: string;
    vibeTheme?: string; // dreamy, cinematic, minimal, playful
    endingSurprise: {
      surpriseType: string;
      surpriseData: any;
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
      response?: "pending" | "accepted" | "declined";
    };
    backgroundType?: string;
    customBackgroundUrl?: string;
    youtubeUrl?: string;
    songName?: string;
    fontStyle?: string;
  };
  onAccept: () => void;
}

const occasionLabels: Record<string, {
  header: string;
  button: string;
  celebrationTitle: string;
  celebrationText: string;
}> = {
  apology: {
    header: "Apology",
    button: "Accept Apology & SealedVibe",
    celebrationTitle: "Connection Rebuilt!",
    celebrationText: "You have accepted the apology. A bridge has been mended, and trust is being rebuilt.",
  },
  birthday: {
    header: "Birthday",
    button: "Accept Wishes & Say Thanks",
    celebrationTitle: "Wishes Accepted!",
    celebrationText: "You have received the birthday wishes. Let's celebrate another year of shared memories!",
  },
  appreciation: {
    header: "Appreciation",
    button: "Say Thanks & SealedVibe",
    celebrationTitle: "Appreciation Received!",
    celebrationText: "You have received the appreciation message. It is a reminder of how special your bond is.",
  },
  anniversary: {
    header: "Anniversary",
    button: "Celebrate & Renew Bond",
    celebrationTitle: "Happy Anniversary!",
    celebrationText: "Your love story is registered on the ledger. Here is to all the years behind and ahead of us! 💖",
  },
};

const getDateEmojis = (type: string, dateName?: string) => {
  const name = dateName?.toLowerCase() || "";
  switch (type?.toLowerCase()) {
    case "movie":
      if (name.includes("marvel") || name.includes("spider") || name.includes("avenger")) {
        return { primary: "🎬", secondary: "🍿", icons: "🎟️ 🕸️ 🕷️" };
      }
      return { primary: "🎬", secondary: "🍿", icons: "🎟️ 🎥 ✨" };
    case "dinner":
      return { primary: "🕯️", secondary: "🍝", icons: "🍷 🍕 🍴" };
    case "coffee":
      return { primary: "☕", secondary: "🥐", icons: "🥯 💬 🧁" };
    case "walk":
      return { primary: "🌅", secondary: "🌳", icons: "👟 🍂 🌸" };
    case "concert":
      return { primary: "🎵", secondary: "🎫", icons: "🎸 🎤 ✨" };
    default:
      return { primary: "✨", secondary: "🌟", icons: "🎁 💖 🗺️" };
  }
};

const extractYoutubeId = (url: string) => {
  if (!url) return "";
  const cleanUrl = url.trim();
  
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  const regExp = /(?:https?:\/\/)?(?:www\.|m\.|music\.)?(?:youtube(?:-nocookie)?\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const match = cleanUrl.match(regExp);
  if (match && match[1]) {
    return match[1];
  }

  const fallbackMatch = cleanUrl.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:[&\?\/#]|$)/);
  if (fallbackMatch && fallbackMatch[1]) {
    return fallbackMatch[1];
  }

  return "";
};

export default function ApologyOverlay({ data, onAccept }: ApologyOverlayProps) {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [status, setStatus] = useState<string>(data.status);
  const [showCelebrationModal, setShowCelebrationModal] = useState<boolean>(data.status === "accepted");
  const [loading, setLoading] = useState<boolean>(false);
  const [unlockedStars, setUnlockedStars] = useState<number[]>([]);
  const [activeToast, setActiveToast] = useState<{ title: string; text: string } | null>(null);

  const [isOpenLetter, setIsOpenLetter] = useState<boolean>(false);
  const isOpenLetterRef = useRef<boolean>(false);
  const [isPlayingSong, setIsPlayingSong] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const playerRef = useRef<any>(null);
  const audioEngineRef = useRef<RomanticApologyAudioEngine | null>(null);

  useEffect(() => {
    audioEngineRef.current = new RomanticApologyAudioEngine();
    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    const songUrl = data.youtubeUrl;
    if (!songUrl) return;

    const videoId = extractYoutubeId(songUrl);
    if (!videoId) return;

    if (!document.getElementById("youtube-api-script")) {
      const tag = document.createElement("script");
      tag.id = "youtube-api-script";
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    let checkedTimes = 0;
    const checkInterval = setInterval(() => {
      checkedTimes++;
      if ((window as any).YT && (window as any).YT.Player) {
        clearInterval(checkInterval);
        if (playerRef.current) return;

        try {
          playerRef.current = new (window as any).YT.Player("apology-yt-audio", {
            height: "200",
            width: "200",
            videoId: videoId,
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              loop: 1,
              playlist: videoId,
              playsinline: 1,
              enablejsapi: 1,
              origin: typeof window !== "undefined" ? window.location.origin : "",
            },
            events: {
              onReady: (event: any) => {
                try {
                  event.target.setVolume(100);
                  event.target.unMute();
                  // If user has already opened the letter, play immediately
                  if (isOpenLetterRef.current) {
                    event.target.playVideo();
                    if (audioEngineRef.current) {
                      audioEngineRef.current.stop();
                    }
                    setIsPlayingSong(true);
                  }
                } catch (e: any) {}
              },
              onStateChange: (event: any) => {
                // If YouTube starts playing, stop Web Audio fallback
                if (event.data === 1) {
                  if (audioEngineRef.current) {
                    audioEngineRef.current.stop();
                  }
                  setIsPlayingSong(true);
                  setIsAudioMuted(false);
                }
              },
              onError: () => {
                // If YouTube video embed is blocked on mobile, start Web Audio ambient engine
                if (isOpenLetterRef.current && audioEngineRef.current) {
                  audioEngineRef.current.start();
                }
              }
            },
          });
        } catch (err: any) {
          console.error("YT init error", err);
        }
      } else if (checkedTimes > 60) {
        clearInterval(checkInterval);
      }
    }, 100);

    return () => {
      clearInterval(checkInterval);
    };
  }, [data.youtubeUrl]);

  const handleOpenLetter = () => {
    isOpenLetterRef.current = true;
    setIsOpenLetter(true);
    setIsPlayingSong(true);
    setIsAudioMuted(false);

    if (data.youtubeUrl) {
      if (playerRef.current && typeof playerRef.current.playVideo === "function") {
        try {
          playerRef.current.unMute();
          playerRef.current.setVolume(100);
          playerRef.current.playVideo();
        } catch (e) {
          console.warn("Direct YT play call prevented by mobile browser policy", e);
        }
      }
    } else {
      // Only start romantic audio engine if no custom YouTube song was provided
      if (audioEngineRef.current) {
        audioEngineRef.current.start();
      }
    }
  };

  const toggleSound = () => {
    if (isAudioMuted) {
      // Unmute
      setIsAudioMuted(false);
      setIsPlayingSong(true);
      if (data.youtubeUrl && playerRef.current && typeof playerRef.current.playVideo === "function") {
        try {
          playerRef.current.unMute();
          playerRef.current.setVolume(100);
          playerRef.current.playVideo();
        } catch (e) {}
      } else if (!data.youtubeUrl && audioEngineRef.current) {
        audioEngineRef.current.start();
      }
    } else {
      // Mute
      setIsAudioMuted(true);
      setIsPlayingSong(false);
      if (playerRef.current && typeof playerRef.current.pauseVideo === "function") {
        try {
          playerRef.current.pauseVideo();
        } catch (e) {}
      }
      if (audioEngineRef.current) {
        audioEngineRef.current.stop();
      }
    }
  };

  // Resolve theme palette colors dynamically based on background type and favorite colors
  const getThemePalette = () => {
    if (data.favorites?.colorPalette && data.favorites.colorPalette.length > 0) {
      const filterColors = data.favorites.colorPalette.filter(Boolean);
      if (filterColors.length > 0) return filterColors;
    }
    if (data.backgroundType === "sakura") {
      return ["#ec4899", "#fbcfe8", "#f472b6"]; // Soft pinks & cherry tones
    }
    if (data.backgroundType === "cyber_grid") {
      return ["#10b981", "#a78bfa", "#06b6d4"]; // Terminal matrix green & purple
    }
    if (data.backgroundType === "aurora") {
      return ["#8b5cf6", "#ec4899", "#3b82f6"]; // Cosmic aurora spectrum
    }
    return ["#a855f7", "#ec4899", "#3b82f6"]; // Default particles
  };
  const colors = getThemePalette();
  const primaryColor = colors[0];
  const secondaryColor = colors[1] || colors[0];

  const getSubHeader = () => {
    switch (occasion) {
      case "birthday":
        return "A Birthday Tribute 🎂";
      case "appreciation":
        return "A Token of Gratitude ✨";
      case "anniversary":
        return "Our Love Story 💖";
      case "apology":
      default:
        return "A Relational Letter 🩹";
    }
  };

  const getDisplayHeadline = () => {
    return data.aiGeneratedData.headline || "";
  };

  const getEnjoyableSignature = () => {
    const name = data.creatorName;
    switch (occasion) {
      case "birthday":
        return `Handcrafted with love by ${name} to celebrate you! 🎂✨`;
      case "appreciation":
        return `From ${name}, just because you're awesome! 🌟`;
      case "anniversary":
        return `Crafted with love by ${name} (cheers to us!) 🥂💖`;
      case "apology":
      default:
        return `From ${name}, with a very hopeful heart ❤️`;
    }
  };

  const [dateResponse, setDateResponse] = useState<string>(data.dateInvitation?.response || "pending");
  const [dateLoading, setDateLoading] = useState<boolean>(false);
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });

  // Touch Swipe Gesture support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    // If on surprise slide (scratchcard/heartbeat) or touching interactive elements, disable swipe navigation
    if (activeSlideType === "surprise" || activeSlideType === "compliments") {
      touchStartX.current = null;
      touchEndX.current = null;
      return;
    }
    const target = e.target as HTMLElement;
    if (target && (target.tagName === "CANVAS" || target.closest("canvas") || target.closest(".gold-card-container") || target.closest("button") || target.closest("input") || target.closest("textarea"))) {
      touchStartX.current = null;
      touchEndX.current = null;
      return;
    }
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const getSlideLabel = (type: string) => {
    switch (type) {
      case "cover": return "Cover";
      case "attributes": return "Relational Credits";
      case "act1": return "Act I: Reflection";
      case "act2": return "Act II: Metaphor";
      case "memories": return "Shared Memories";
      case "act3": return "Act III: Reconciliation";
      case "compliments": return "Five Stars";
      case "surprise": return "Ending Surprise";
      case "dateInvitation": return "Invitation";
      case "credits": return "Credits";
      default: return "Slide";
    }
  };

  const moveNoButton = () => {
    // Generate random translations between -140px and 140px
    const randomX = (Math.random() - 0.5) * 280;
    const randomY = (Math.random() - 0.5) * 140;
    setNoBtnPos({ x: randomX, y: randomY });
  };

  const occasion = data.occasion || "apology";
  const labels = occasionLabels[occasion] || occasionLabels.apology;
  const vibe = data.vibeTheme || "dreamy";

  const rawNarrative = data.aiGeneratedData?.apologyNarrative || "";
  let act1 = "";
  let act2 = "";
  let act3 = "";

  if (rawNarrative.includes("[BREAK]")) {
    const parts = rawNarrative.split("[BREAK]");
    act1 = parts[0]?.trim() || "";
    act2 = parts[1]?.trim() || "";
    act3 = parts[2]?.trim() || "";
  } else if (rawNarrative.includes("\n\n")) {
    const parts = rawNarrative.split("\n\n").filter(p => p.trim());
    act1 = parts[0]?.trim() || rawNarrative;
    act2 = parts[1]?.trim() || "Every small moment and quiet memory we've shared remains deeply meaningful to me.";
    act3 = parts[2]?.trim() || "Thank you for taking the time to read this and for being part of my journey.";
  } else {
    const sentences = rawNarrative.match(/[^.!?]+[.!?]+/g) || [rawNarrative];
    if (sentences.length >= 3) {
      const chunkSize = Math.ceil(sentences.length / 3);
      act1 = sentences.slice(0, chunkSize).join(" ").trim();
      act2 = sentences.slice(chunkSize, chunkSize * 2).join(" ").trim();
      act3 = sentences.slice(chunkSize * 2).join(" ").trim();
    } else {
      act1 = rawNarrative;
      act2 = "Looking back at our shared memories and late-night conversations, I realize how irreplaceable your bond is to me.";
      act3 = "Whatever comes next, I'm truly grateful for your presence in my life and hope for a bright new chapter together.";
    }
  }

  const hasCompliments = data.complimentStars?.enabled && data.complimentStars.list && data.complimentStars.list.length > 0;
  const hasDateInvitation = data.dateInvitation?.enabled;

  const slides: string[] = ["cover", "attributes", "act1", "act2", "memories", "act3"];
  if (hasCompliments) slides.push("compliments");
  slides.push("surprise");
  if (hasDateInvitation) slides.push("dateInvitation");
  slides.push("credits");

  const totalSlides = slides.length;
  const activeSlideType = slides[activeSlide];

  const complimentsSlideIndex = slides.indexOf("compliments");
  const creditsSlideIndex = slides.indexOf("credits");

  // Keyboard navigation for Arrow keys & Space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showCelebrationModal) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        // If compliments index is locked, prevent arrow key navigation forward!
        if (activeSlideType === "compliments" && unlockedStars.length < 5) {
          return;
        }
        setActiveSlide((prev) => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSlide((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, showCelebrationModal, activeSlide, activeSlideType, unlockedStars.length, totalSlides]);

  const handleNext = () => {
    if (activeSlideType === "compliments" && unlockedStars.length < 5) {
      return;
    }
    setActiveSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  const handlePrev = () => {
    setActiveSlide((prev) => Math.max(prev - 1, 0));
  };

  const handleDateResponse = async (response: "accepted" | "declined") => {
    setDateLoading(true);
    setDateResponse(response); // Optimistic UI update immediately

    if (response === "accepted") {
      try {
        const palette = (data.favorites?.colorPalette && data.favorites.colorPalette.length > 0)
          ? data.favorites.colorPalette
          : ["#ec4899", "#8b5cf6", "#3b82f6", "#10b981"];
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: palette,
        });
      } catch (e) {
        console.error("Confetti trigger error:", e);
      }
    }

    try {
      await fetch("/api/respond-date", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: data.slug, response }),
      });
    } catch (err) {
      console.error("Failed to sync date response to server:", err);
    } finally {
      setDateLoading(false);
    }
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: data.slug }),
      });

      if (res.ok) {
        setStatus("accepted");
        setShowCelebrationModal(true);
        try {
          const palette = (data.favorites?.colorPalette && data.favorites.colorPalette.length > 0)
            ? data.favorites.colorPalette
            : ["#ec4899", "#8b5cf6", "#3b82f6", "#10b981"];
          confetti({
            particleCount: 180,
            spread: 100,
            origin: { y: 0.6 },
            colors: palette,
          });
        } catch (e) {
          console.error("Confetti error:", e);
        }
        onAccept();
      }
    } catch (err) {
      console.error("Accept error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = () => {
    // 1. Create off-screen canvas
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const themeBgGrad = ctx.createLinearGradient(0, 0, 1200, 850);
    if (data.backgroundType === "sakura") {
      themeBgGrad.addColorStop(0, "#0c060a");
      themeBgGrad.addColorStop(0.5, "#1a0b14");
      themeBgGrad.addColorStop(1, "#080406");
    } else if (data.backgroundType === "cyber_grid") {
      themeBgGrad.addColorStop(0, "#030805");
      themeBgGrad.addColorStop(0.5, "#08140c");
      themeBgGrad.addColorStop(1, "#020503");
    } else if (data.backgroundType === "candlelight") {
      themeBgGrad.addColorStop(0, "#0e0603");
      themeBgGrad.addColorStop(0.5, "#1c0d06");
      themeBgGrad.addColorStop(1, "#080302");
    } else if (data.backgroundType === "fireflies") {
      themeBgGrad.addColorStop(0, "#030804");
      themeBgGrad.addColorStop(0.5, "#0a1c0d");
      themeBgGrad.addColorStop(1, "#020502");
    } else if (data.backgroundType === "lanterns") {
      themeBgGrad.addColorStop(0, "#06040a");
      themeBgGrad.addColorStop(0.5, "#13091c");
      themeBgGrad.addColorStop(1, "#040306");
    } else {
      themeBgGrad.addColorStop(0, "#08070d");
      themeBgGrad.addColorStop(0.5, "#0d0b1a");
      themeBgGrad.addColorStop(1, "#05040a");
    }
    
    // Draw background
    ctx.fillStyle = themeBgGrad;
    ctx.fillRect(0, 0, 1200, 850);

    // Draw central ambient glow matching the active theme's colors
    const orbGrad = ctx.createRadialGradient(600, 425, 50, 600, 425, 450);
    orbGrad.addColorStop(0, `${envPrimary}15`);
    orbGrad.addColorStop(0.5, `${envSecondary}05`);
    orbGrad.addColorStop(1, "transparent");
    ctx.fillStyle = orbGrad;
    ctx.fillRect(0, 0, 1200, 850);

    // Draw ambient stardust dots (60 twinkling points of light)
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    for (let i = 0; i < 60; i++) {
      const sx = ((i * 37) % 1140) + 30;
      const sy = ((i * 29) % 790) + 30;
      const sOpacity = 0.15 + (i % 3) * 0.25;
      const sSize = 1.0 + (i % 2) * 1.2;
      ctx.fillStyle = `rgba(255, 255, 255, ${sOpacity})`;
      ctx.beginPath();
      ctx.arc(sx, sy, sSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw premium borders matching the dynamic pastel theme colors
    ctx.strokeStyle = `${envPrimary}60`;
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 790);

    ctx.strokeStyle = `${envSecondary}30`;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(42, 42, 1116, 766);

    // Draw elegant custom geometric corner ornaments
    const drawCornerOrnament = (cx: number, cy: number, rot: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = envPrimary;
      ctx.lineWidth = 2.5;
      
      // Outer corner line accent
      ctx.beginPath();
      ctx.moveTo(0, 35);
      ctx.lineTo(0, 0);
      ctx.lineTo(35, 0);
      ctx.stroke();

      // Inner corner dot
      ctx.fillStyle = envSecondary;
      ctx.beginPath();
      ctx.arc(9, 9, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawCornerOrnament(42, 42, 0);
    drawCornerOrnament(1158, 42, Math.PI / 2);
    drawCornerOrnament(1158, 808, Math.PI);
    drawCornerOrnament(42, 808, -Math.PI / 2);

    // Write Header Title
    let mainTitle = "CERTIFICATE OF RECONNECTION";
    let subTitle = "RELATIONSHIP COMPILED & DEPLOYED SUCCESSFULLY // RECONNECTION PROTOCOL v1.0";
    let explanationText = "This degree certifies that the active emotional thread connection between";
    let rules = [
      "1. Argument threads shall be resolved before thread-sleep.",
      "2. Communication ports will remain open and unblocked.",
      "3. Mutual appreciation will be pinged at regular intervals.",
    ];

    if (occasion === "birthday") {
      mainTitle = "SPACE-TIME SURVIVAL DEGREE";
      subTitle = "365-DAY SOLAR ORBIT EXECUTION REGISTERED // v" + new Date().getFullYear();
      explanationText = "This degree certifies that the stellar space-time path between";
      rules = [
        "1. Celebrate solar orbits with high priority threads.",
        "2. Maximize shared memory memory allocation.",
        "3. Ignore age-related overflow exceptions.",
      ];
    } else if (occasion === "appreciation") {
      mainTitle = "DEGREE OF EMOTIONAL GRATITUDE";
      subTitle = "IMMUTABLE APPRECIATION DECRYPTION PAYLOAD // COMPANIONSHIP REGISTRY";
      explanationText = "This degree certifies that the lifelong companionship and trust between";
      rules = [
        "1. Acknowledge support logs without rate limits.",
        "2. Maintain high-availability listening ports.",
        "3. Secure the trust database with end-to-end respect.",
      ];
    } else if (occasion === "anniversary") {
      mainTitle = "CERTIFICATE OF LIFELONG UNION";
      subTitle = "IMMUTABLE DEVOTION PROTOCOL ENABLED // LOVE MATRIX REGISTRY";
      explanationText = "This degree certifies that the eternal romantic bond and partnership between";
      rules = [
        "1. Resolve conflict threads before system shutdown.",
        "2. Guarantee high-priority allocation for date nights.",
        "3. Synchronize life dreams and heartbeat frequency.",
      ];
    }

    // Draw Main Title with gorgeous blur drop-shadow
    ctx.font = "bold 44px 'Orbitron', 'Inter', monospace, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.shadowColor = envPrimary;
    ctx.shadowBlur = 15;
    ctx.fillText(mainTitle, 600, 140);
    ctx.shadowBlur = 0; // reset shadow

    // Subtitle
    ctx.font = "bold 13px 'Inter', monospace, sans-serif";
    ctx.fillStyle = envSecondary;
    ctx.fillText(subTitle, 600, 185);

    // Elegant Divider Line
    const dividerGrad = ctx.createLinearGradient(300, 0, 900, 0);
    dividerGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    dividerGrad.addColorStop(0.5, envPrimary);
    dividerGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = dividerGrad;
    ctx.fillRect(300, 220, 600, 2.5);

    // Explanation text
    ctx.font = "italic 16px 'Inter', Georgia, serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(explanationText, 600, 280);

    // Creator Name (Signature/Italic Serif gradient style)
    ctx.font = "italic bold 54px 'Playfair Display', 'Georgia', serif";
    const creatorNameGrad = ctx.createLinearGradient(0, 310, 0, 360);
    creatorNameGrad.addColorStop(0, "#ffffff");
    creatorNameGrad.addColorStop(1, envPrimary);
    ctx.fillStyle = creatorNameGrad;
    ctx.fillText(data.creatorName, 600, 350);

    // "and"
    ctx.font = "italic 18px 'Inter', Georgia, serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("and", 600, 395);

    // Recipient Name (Signature/Italic Serif gradient style)
    ctx.font = "italic bold 54px 'Playfair Display', 'Georgia', serif";
    const recipientNameGrad = ctx.createLinearGradient(0, 420, 0, 480);
    recipientNameGrad.addColorStop(0, "#ffffff");
    recipientNameGrad.addColorStop(1, envSecondary);
    ctx.fillStyle = recipientNameGrad;
    ctx.fillText(data.recipientName, 600, 465);

    // Vows / Commitments frosted glass box
    ctx.fillStyle = "rgba(10, 10, 15, 0.75)";
    ctx.strokeStyle = `${envPrimary}25`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(180, 520, 840, 165, 20);
    ctx.fill();
    ctx.stroke();

    // Commitments header
    ctx.font = "bold 11px 'Inter', monospace, sans-serif";
    ctx.fillStyle = envPrimary;
    ctx.fillText("MUTUAL COMMITMENTS & PROTOCOL RULES", 600, 550);

    // Commitments list
    ctx.font = "14px 'Inter', sans-serif";
    ctx.fillStyle = "#e2e8f0";
    ctx.textAlign = "left";
    
    // Draw subtle bullets before each commitment
    const drawRule = (ruleText: string, yPos: number) => {
      ctx.fillStyle = envSecondary;
      ctx.beginPath();
      ctx.arc(220, yPos - 5, 3.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "#e2e8f0";
      ctx.fillText(ruleText.substring(3), 235, yPos);
    };

    drawRule(rules[0], 595);
    drawRule(rules[1], 625);
    drawRule(rules[2], 655);

    // Draw Seal of Trust (gorgeous premium wax stamp)
    ctx.textAlign = "center";
    const sealX = 600;
    const sealY = 730;

    // Wax seal outer ring (un-even organic circle style)
    ctx.fillStyle = `${envPrimary}d0`;
    ctx.shadowColor = `${envPrimary}44`;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(sealX, sealY + 25, 28, 0, Math.PI * 2);
    ctx.fill();

    // Wax seal inner ridge ring
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(sealX, sealY + 25, 23, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow

    // Heart stamp embossed in white/gold in the center
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    const syVal = sealY + 25;
    ctx.moveTo(sealX, syVal - 7);
    ctx.bezierCurveTo(sealX, syVal - 13, sealX - 10, syVal - 13, sealX - 10, syVal - 3);
    ctx.bezierCurveTo(sealX - 10, syVal + 4, sealX, syVal + 11, sealX, syVal + 14);
    ctx.bezierCurveTo(sealX, syVal + 11, sealX + 10, syVal + 4, sealX + 10, syVal - 3);
    ctx.bezierCurveTo(sealX + 10, syVal - 13, sealX, syVal - 13, sealX, syVal - 7);
    ctx.fill();

    ctx.font = "bold 9px 'Inter', monospace, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("COMPILED WITH LOVE", sealX, sealY + 62);

    // Signatures
    ctx.font = "13px 'Inter', sans-serif";
    ctx.fillStyle = "#94a3b8";
    
    ctx.textAlign = "left";
    ctx.fillText("Compiled by: " + data.creatorName, 180, 750);
    ctx.strokeStyle = `${envPrimary}35`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(180, 732);
    ctx.lineTo(380, 732);
    ctx.stroke();

    ctx.textAlign = "right";
    ctx.fillText("Accepted by: " + data.recipientName, 1020, 750);
    ctx.strokeStyle = `${envSecondary}35`;
    ctx.beginPath();
    ctx.moveTo(820, 732);
    ctx.lineTo(1020, 732);
    ctx.stroke();

    // Unique Degree hash
    ctx.font = "9px 'Inter', monospace, sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "center";
    const dateStr = new Date().toISOString().slice(0, 10);
    const hash = `${data.slug.toUpperCase()}-${dateStr}`;
    ctx.fillText("VERIFICATION HASH: " + hash, 600, 815);

    // Trigger download
    const link = document.createElement("a");
    link.download = `reconnection-certificate-${data.slug}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Vibe Theme styling configurations
  const getVibeStyles = () => {
    switch (vibe) {
      case "cinematic":
        return {
          font: "font-mono",
          cardClass: "backdrop-blur-sm shadow-2xl rounded-2xl sm:rounded-[32px] p-5 sm:p-8 md:p-10 bg-white/[0.015] border border-white/5",
          cardStyle: {
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(8px)",
            boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.45)"
          },
          containerClass: "relative w-full min-h-[100dvh] flex flex-col justify-between p-3.5 sm:p-6 sm:border-y-[30px] border-black bg-neutral-950/20",
          containerStyle: {},
          headlineClass: "text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-widest text-neutral-100",
          headlineStyle: { textShadow: `0 0 15px ${primaryColor}22` }
        };
      case "minimal":
        return {
          font: "font-sans tracking-tight",
          cardClass: "backdrop-blur-[4px] shadow-xl rounded-2xl sm:rounded-[24px] p-5 sm:p-8 md:p-10 bg-white/[0.01] border border-white/[0.04]",
          cardStyle: {
            border: "1px solid rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(6px)",
            boxShadow: "inset 0 1px 0px rgba(255, 255, 255, 0.03)"
          },
          containerClass: "relative w-full min-h-[100dvh] flex flex-col justify-between p-3.5 sm:p-6 bg-grid-pattern bg-[size:40px_40px]",
          containerStyle: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
          headlineClass: "text-2xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-white",
          headlineStyle: { textShadow: `0 0 10px ${primaryColor}40` }
        };
      case "playful":
        return {
          font: "font-sans font-bold",
          cardClass: "backdrop-blur-md shadow-2xl rounded-2xl sm:rounded-[32px] px-5 py-6 sm:px-8 sm:py-10 bg-white/[0.02] border border-white/10",
          cardStyle: {
            border: `2px solid ${primaryColor}15`,
            backdropFilter: "blur(10px)",
            boxShadow: "inset 0 1.5px 1.5px rgba(255, 255, 255, 0.12), 0 20px 40px rgba(0, 0, 0, 0.3)"
          },
          containerClass: "relative w-full min-h-[100dvh] flex flex-col justify-between p-3.5 sm:p-6",
          containerStyle: { backgroundColor: "rgba(0, 0, 0, 0.15)" },
          headlineClass: "text-2xl sm:text-4xl md:text-5xl font-extrabold drop-shadow-md",
          headlineStyle: { color: primaryColor }
        };
      case "dreamy":
      default:
        return {
          font: "font-serif",
          cardClass: "backdrop-blur-md shadow-3xl rounded-2xl sm:rounded-[32px] p-5 sm:p-8 md:p-10 bg-white/[0.02] border border-white/8",
          cardStyle: {
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            boxShadow: `inset 0 1px 1px rgba(255, 255, 255, 0.12), 0 30px 60px -15px rgba(0, 0, 0, 0.45), 0 0 30px ${primaryColor}08`
          },
          containerClass: "relative w-full min-h-[100dvh] flex flex-col justify-between p-3.5 sm:p-6",
          containerStyle: { backgroundColor: "rgba(0, 0, 0, 0.2)" },
          headlineClass: "text-2xl sm:text-4xl md:text-5xl font-extrabold",
          headlineStyle: {
            color: "#ffffff",
            textShadow: `0 0 20px ${primaryColor}44`
          }
        };
    }
  };

  const theme = getVibeStyles();

  // Dynamically resolve typography class styles based on chosen font preset
  const getTypographyClasses = () => {
    const style = data.fontStyle || "classic";
    switch (style) {
      case "modern":
        return {
          font: "font-sans-modern",
          headlineClass: "font-sans-modern font-bold tracking-tight text-white",
          bodyClass: "font-sans text-slate-300 leading-relaxed font-light",
          nameClass: "font-sans-modern font-black tracking-tight"
        };
      case "retro":
        return {
          font: "font-mono-retro",
          headlineClass: "font-mono-retro font-bold uppercase tracking-widest text-neutral-100",
          bodyClass: "font-mono-retro text-neutral-300 leading-relaxed text-[11px] sm:text-xs",
          nameClass: "font-mono-retro font-extrabold uppercase tracking-wider text-xs"
        };
      case "handwritten":
        return {
          font: "font-handwritten",
          headlineClass: "font-handwritten text-4xl sm:text-6xl font-bold tracking-wide text-pink-100",
          bodyClass: "font-sans text-slate-300 font-light text-[15px] leading-loose sm:leading-loose",
          nameClass: "font-handwritten text-5xl sm:text-7xl font-bold"
        };
      case "classic":
      default:
        return {
          font: "font-serif-elegant",
          headlineClass: "font-serif-elegant font-normal italic tracking-wide text-neutral-100",
          bodyClass: "font-sans text-slate-300 leading-relaxed font-light",
          nameClass: "font-serif-elegant font-bold italic"
        };
    }
  };
  const fontPreset = getTypographyClasses();

  // Helper to convert any hex color to a soft, romantic pastel variant
  const toPastelColor = (hex: string) => {
    if (!hex || typeof hex !== 'string') return '#c7d2fe';
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2];
    }
    if (cleanHex.length !== 6) return hex;
    
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    
    // Blend with white (0xff) to soften the saturation to 65% white
    const mix = 0.65;
    const pr = Math.round(r * (1 - mix) + 255 * mix);
    const pg = Math.round(g * (1 - mix) + 255 * mix);
    const pb = Math.round(b * (1 - mix) + 255 * mix);
    
    return `#${pr.toString(16).padStart(2, '0')}${pg.toString(16).padStart(2, '0')}${pb.toString(16).padStart(2, '0')}`;
  };

  // Dynamically resolve colors specifically for the envelope screen to match chosen background theme
  const getEnvelopeColors = () => {
    const bgType = data.backgroundType || "";
    switch (bgType) {
      case "constellations":
        return ["#fde047", "#fef3c7", "#93c5fd"]; // Pastel starry gold, soft moon cream, light sky blue
      case "raindrops":
        return ["#93c5fd", "#a5f3fc", "#c7d2fe"]; // Pastel sky blue, soft cyan, light lavender
      case "candlelight":
        return ["#fcd34d", "#fed7aa", "#fca5a5"]; // Soft gold, pastel peach, light rose
      case "fireflies":
        return ["#a7f3d0", "#d9f99d", "#6ee7b7"]; // Mint green, soft lime, light emerald
      case "lanterns":
        return ["#fdba74", "#fde047", "#d8b4fe"]; // Soft orange, pastel yellow, light lavender purple
      case "sakura":
        return ["#fbcfe8", "#fda4af", "#ffe4e6"]; // Cherry pink, soft rose, light white-blossom pink
      case "cyber_grid":
        return ["#a7f3d0", "#a5f3fc", "#c7d2fe"]; // Soft matrix green, pastel cyan, light purple
      default:
        // Use default theme palette colors (uses user's favorite colors) but convert to pastel
        return colors.map(toPastelColor);
    }
  };

  const getEnvelopeBgClass = () => {
    const bgType = data.backgroundType || "";
    switch (bgType) {
      case "constellations":
        return "bg-[#02010c]/65 backdrop-blur-[6px]";
      case "raindrops":
        return "bg-[#07080e]/65 backdrop-blur-[6px]";
      case "candlelight":
        return "bg-[#0d0705]/65 backdrop-blur-[6px]";
      case "fireflies":
        return "bg-[#030a04]/65 backdrop-blur-[6px]";
      case "lanterns":
        return "bg-[#05040a]/65 backdrop-blur-[6px]";
      case "sakura":
        return "bg-[#050204]/65 backdrop-blur-[6px]";
      case "cyber_grid":
        return "bg-black/70 backdrop-blur-[6px]";
      default:
        return "bg-neutral-950/65 backdrop-blur-[6px]";
    }
  };

  const envColors = getEnvelopeColors();
  const envPrimary = envColors[0];
  const envSecondary = envColors[1] || envColors[0];
  const envBgClass = getEnvelopeBgClass();

  // Slide Animation transitions
  const slideVariants = {
    initial: { opacity: 0, scale: 0.97, y: 15 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.97, y: -15, transition: { duration: 0.4, ease: "easeIn" } }
  } as const;

  const isCardSlide = ["attributes", "act1", "act2", "memories", "act3", "compliments", "dateInvitation"].includes(activeSlideType);

  return (
    <div className={`relative w-full min-h-screen ${fontPreset.font} select-none overflow-hidden`}>
      {/* Gorgeous Envelope Splash Screen */}
      <AnimatePresence>
        {!isOpenLetter && (
          <motion.div
            key="envelope-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${envBgClass}`}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at center, ${envPrimary}0c 0%, transparent 70%)` }} />
            
            {/* Ambient stardust nodes in envelope splash */}
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full pointer-events-none opacity-30"
                style={{
                  top: `${(i * 19) % 90 + 5}%`,
                  left: `${(i * 29) % 90 + 5}%`,
                  animation: `twinkle ${1.5 + (i % 3) * 0.5}s infinite ease-in-out`,
                  animationDelay: `${i * 0.2}s`,
                  backgroundColor: envColors[i % envColors.length]
                }}
              />
            ))}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              className="w-full max-w-sm p-8 rounded-3xl border border-white/10 bg-slate-950/70 text-center space-y-6 relative overflow-hidden"
              style={{
                borderColor: `${envPrimary}20`,
                boxShadow: `0 20px 50px -15px rgba(0,0,0,0.8), 0 0 40px ${envPrimary}15`,
                backdropFilter: "blur(12px)"
              }}
            >
              {/* Dynamic top gradient line based on user colors */}
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundImage: `linear-gradient(to right, ${envPrimary}, ${envSecondary})` }} />
              
              {/* Envelope Icon */}
              <motion.div
                onClick={handleOpenLetter}
                className="mx-auto w-24 h-24 rounded-2xl border border-white/10 flex items-center justify-center cursor-pointer shadow-2xl relative overflow-hidden group"
                style={{ borderColor: `${envPrimary}30`, backgroundImage: `linear-gradient(to bottom right, ${envPrimary}10, ${envSecondary}05)` }}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: `${envPrimary}15` }} />
                <Mail className="w-12 h-12 transition-transform duration-300 group-hover:scale-110" style={{ color: envPrimary, filter: `drop-shadow(0 0 8px ${envPrimary}dd)` }} />
              </motion.div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white tracking-wider font-mono uppercase">Private Message Received</h2>
                <p className="text-xs text-slate-450 leading-relaxed">
                  You have received a special cinematic page crafted with love by <span className="font-semibold" style={{ color: envPrimary }}>{data.creatorName}</span>.
                </p>
              </div>

              {data.youtubeUrl && (
                <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5 w-fit mx-auto animate-pulse">
                  <span>🎵 Custom audio track loaded</span>
                </div>
              )}

              <button
                onClick={handleOpenLetter}
                style={{ backgroundImage: `linear-gradient(to right, ${envPrimary}, ${envSecondary})` }}
                className="w-full py-4 rounded-xl text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95 cursor-pointer hover:brightness-110"
              >
                Open Envelope ✉️
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration success screen if accepted */}
      {showCelebrationModal && (
        <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 ${envBgClass}`}>
          <div
            className="w-full max-w-md bg-slate-950/70 border border-white/10 rounded-[32px] p-8 text-center space-y-6 relative overflow-hidden shadow-2xl"
            style={{
              borderColor: `${envPrimary}20`,
              backdropFilter: "blur(12px)",
              boxShadow: `0 25px 60px rgba(0, 0, 0, 0.8), 0 0 45px ${envPrimary}15`
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundImage: `linear-gradient(to right, ${envPrimary}, ${envSecondary})` }} />
            <div
              className="mx-auto w-20 h-20 rounded-full flex items-center justify-center border"
              style={{
                backgroundColor: `${envPrimary}15`,
                borderColor: `${envPrimary}35`,
                color: envPrimary
              }}
            >
              <HeartHandshake className="w-10 h-10 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-white">{labels.celebrationTitle}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                You've accepted <span className="font-semibold" style={{ color: envPrimary }}>{data.creatorName}'s</span> message. 
                {labels.celebrationText}
              </p>
            </div>
            <div className="flex justify-center items-center gap-1.5 text-xs text-slate-400 border border-white/5 py-2.5 px-4 rounded-xl bg-white/5 w-fit mx-auto" suppressHydrationWarning>
              <Calendar className="w-4 h-4" style={{ color: envPrimary }} /> 
              Connected on {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            
            <div className="pt-2 flex flex-col items-center gap-2.5">
              <button
                onClick={downloadCertificate}
                style={{ backgroundImage: `linear-gradient(to right, ${envPrimary}, ${envSecondary})` }}
                className="w-full px-5 py-3 rounded-xl text-white text-xs font-bold tracking-wider uppercase transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-2 hover:brightness-110"
              >
                <Download className="w-4 h-4" /> Download SealedVibeion Certificate 📜
              </button>
              <button
                onClick={() => setShowCelebrationModal(false)}
                className="w-full px-5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer shadow-md active:scale-95"
              >
                Keep Browsing & Review Credits
              </button>
              <p className="text-[10px] text-slate-400 font-mono">You can always view this again from the final credits slide.</p>
            </div>
          </div>
        </div>
      )}

      {/* Slide Container Frame */}
      <div className={theme.containerClass} style={theme.containerStyle}>
        
        {/* Top Header Tracker */}
        <header className="w-full flex justify-between items-center text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400/80 font-bold z-20 pt-8 sm:pt-0 px-1">
          <span>CREATED BY {data.creatorName.toUpperCase()}</span>
          <span>{labels.header} for {data.recipientName}</span>
        </header>

          {/* Central Active Slide Display */}
          <div 
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="flex-1 flex items-center justify-center max-w-3xl w-full mx-auto py-3 sm:py-8 relative z-10"
          >
            <AnimatePresence mode="wait">
              {activeSlideType === "cover" && (
                <motion.div 
                  key="slide0" 
                  variants={slideVariants} 
                  initial="initial" 
                  animate="animate" 
                  exit="exit" 
                  className="text-center space-y-4 sm:space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-12"
                >
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-extrabold block mb-2 sm:mb-3" style={{ color: primaryColor, textShadow: `0 0 15px ${primaryColor}40` }}>{getSubHeader()}</span>
                  <h1 className={`${fontPreset.headlineClass} text-2xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight px-2 sm:px-4`} style={{ textShadow: `0 0 40px ${primaryColor}50`, ...theme.headlineStyle }}>{getDisplayHeadline()}</h1>
                  <p className="text-xs sm:text-lg text-slate-300/90 font-light tracking-wide max-w-xl mx-auto mt-2 sm:mt-4" suppressHydrationWarning>{getEnjoyableSignature()}</p>
                  <div className="pt-6 sm:pt-10 flex justify-center">
                    <button 
                      onClick={handleNext} 
                      className="px-8 py-4 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-bold tracking-widest uppercase flex items-center gap-2.5 cursor-pointer transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 select-none relative group"
                      style={{
                        boxShadow: `0 10px 30px -10px ${primaryColor}40`
                      }}
                    >
                      Open Letter 💌 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}

              {isCardSlide && (
                <motion.div 
                  key="card-shell" 
                  variants={slideVariants} 
                  initial="initial" 
                  animate="animate" 
                  exit="exit" 
                  className={`${theme.cardClass} w-full`} 
                  style={theme.cardStyle}
                >
                  <AnimatePresence mode="wait">
                    {activeSlideType === "attributes" && (
                      <motion.div key="slide1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="w-full">
                        <h3 className="text-[10px] uppercase tracking-widest font-bold mb-4" style={{ color: primaryColor }}>Relational Credits</h3>
                        <div className="space-y-6 py-4">
                          <div className="border-l-2 pl-4 space-y-1" style={{ borderColor: `${primaryColor}30` }}>
                            <h4 className="text-[11px] text-slate-400 uppercase tracking-widest font-extrabold">Known For</h4>
                            <p className="text-sm font-medium text-slate-200 italic">"{data.aiGeneratedData.characterAttributes.knownFor}"</p>
                          </div>
                          <div className="border-l-2 pl-4 space-y-1" style={{ borderColor: `${primaryColor}30` }}>
                            <h4 className="text-[11px] text-slate-400 uppercase tracking-widest font-extrabold">Acclaimed For</h4>
                            <p className="text-sm font-medium text-slate-200 italic">"{data.aiGeneratedData.characterAttributes.acclaimedFor}"</p>
                          </div>
                          <div className="border-l-2 pl-4 space-y-1" style={{ borderColor: `${primaryColor}30` }}>
                            <h4 className="text-[11px] text-slate-400 uppercase tracking-widest font-extrabold">Remembered For</h4>
                            <p className="text-sm font-medium text-slate-200 italic">"{data.aiGeneratedData.characterAttributes.rememberedFor}"</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeSlideType === "act1" && (
                      <motion.div key="slide2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="w-full">
                        <h3 className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: primaryColor }}>
                          {occasion === "birthday" ? "Act I: The Celebration 🎂" : occasion === "appreciation" ? "Act I: The Gratitude ✨" : occasion === "anniversary" ? "Act I: The Journey 💖" : "Act I: The Greeting 💌"}
                        </h3>
                        <p className="text-sm sm:text-base leading-relaxed font-light text-slate-200">
                          {act1}
                        </p>
                      </motion.div>
                    )}

                    {activeSlideType === "act2" && (
                      <motion.div key="slide3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="w-full">
                        <h3 className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: primaryColor }}>
                          {occasion === "birthday" ? "Act II: The Memories 🌟" : occasion === "appreciation" ? "Act II: The Connection 💫" : occasion === "anniversary" ? "Act II: The Chronicle 🥂" : "Act II: The Metaphor 🌿"}
                        </h3>
                        <p className="text-sm sm:text-base leading-relaxed font-light text-slate-200">
                          {act2}
                        </p>
                      </motion.div>
                    )}

                    {activeSlideType === "memories" && (
                      <motion.div key="slide4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="w-full">
                        <h3 className="text-[10px] uppercase tracking-widest font-bold mb-6 flex items-center gap-1.5" style={{ color: primaryColor }}><Sparkles className="w-4 h-4" /> Shared Memories</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {data.aiGeneratedData.memoriesList.map((mem, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between min-h-[100px]">
                              <span className="text-[10px] font-bold" style={{ color: `${primaryColor}cc` }}>Memory #{i + 1}</span>
                              <p className="text-xs text-slate-300 leading-relaxed font-normal mt-2">
                                "{mem}"
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeSlideType === "act3" && (
                      <motion.div key="slide5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="w-full">
                        <h3 className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: primaryColor }}>
                          {occasion === "birthday" ? "Act III: The Birthday Wish 🎁" : occasion === "appreciation" ? "Act III: The Appreciation 💖" : occasion === "anniversary" ? "Act III: The Future & Promise 💍" : "Act III: The Reconciliation 🕊️"}
                        </h3>
                        <p className="text-sm sm:text-base leading-relaxed font-light text-slate-200">
                          {act3}
                        </p>
                      </motion.div>
                    )}

                    {hasCompliments && activeSlideType === "compliments" && (
                      <motion.div key="slideCompliments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="w-full">
                        <div className="text-center space-y-1.5 mb-4">
                          <h3 className="text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5" style={{ color: primaryColor }}>
                            <Sparkles className="w-4 h-4 animate-pulse" style={{ color: primaryColor }} /> Stardust Compliments
                          </h3>
                          <p className="text-xs text-slate-300">
                            Tap on the 5 glowing stars floating in the night sky to unlock secret memories.
                          </p>
                        </div>

                        {/* Night Sky Box */}
                        <div className="relative w-full h-[220px] bg-slate-950/70 rounded-2xl overflow-hidden border border-white/5 shadow-inner flex items-center justify-center group/sky transition-all duration-700 ease-in-out hover:shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black transition-all duration-700 group-hover/sky:from-purple-950/50" />
                          <div 
                            className="absolute inset-0 opacity-0 group-hover/sky:opacity-20 transition-opacity duration-1000 blur-[20px] pointer-events-none"
                            style={{
                              background: `radial-gradient(circle at 50% 50%, ${primaryColor} 0%, transparent 60%)`,
                            }}
                          />

                          {/* Twinkling Background Stardust */}
                          {Array.from({ length: 24 }).map((_, i) => {
                            const left = ((i * 19) % 94) + 3;
                            const top = ((i * 13) % 86) + 7;
                            const delay = (i * 0.3) % 4.5;
                            const duration = 2.5 + (i * 0.6) % 3.5;
                            const size = 1 + (i % 2);
                            return (
                              <div
                                key={`bg-star-${i}`}
                                className="absolute rounded-full bg-white/40 pointer-events-none transition-all duration-1000 group-hover/sky:bg-pink-300/60"
                                style={{
                                  left: `${left}%`,
                                  top: `${top}%`,
                                  width: `${size}px`,
                                  height: `${size}px`,
                                  animation: `twinkle ${duration}s infinite ease-in-out`,
                                  animationDelay: `${delay}s`,
                                }}
                              />
                            );
                          })}

                          {/* Pulsating Glowing Stars */}
                          {[
                            { id: 0, top: "25%", left: "15%" },
                            { id: 1, top: "60%", left: "32%" },
                            { id: 2, top: "18%", left: "50%" },
                            { id: 3, top: "65%", left: "70%" },
                            { id: 4, top: "30%", left: "85%" },
                          ].map((star) => {
                            const isUnlocked = unlockedStars.includes(star.id);
                            const delayVal = `${star.id * 0.4}s`;
                            return (
                              <button
                                key={star.id}
                                onClick={() => {
                                  if (!isUnlocked) {
                                    setUnlockedStars((prev) => [...prev, star.id]);
                                    const comp = data.complimentStars?.list[star.id];
                                    if (comp) {
                                      setActiveToast(comp);
                                    }
                                    // Local sparkle burst
                                    confetti({
                                      particleCount: 30,
                                      spread: 60,
                                      origin: {
                                        x: parseFloat(star.left) / 100,
                                        y: 0.3 + (parseFloat(star.top) / 100) * 0.4
                                      },
                                      colors: data.favorites.colorPalette
                                    });
                                  }
                                }}
                                style={{ 
                                  top: star.top, 
                                  left: star.left,
                                  animationDelay: delayVal
                                }}
                                className={`absolute p-3 rounded-full cursor-pointer star-drift-${star.id} ${
                                  isUnlocked
                                    ? "text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.95)]"
                                    : "text-blue-300/40 hover:text-white drop-shadow-[0_0_10px_rgba(14,165,233,0.5)] hover:drop-shadow-[0_0_18px_rgba(14,165,233,0.95)]"
                                }`}
                              >
                                {/* Inner glowing core halo */}
                                <div 
                                  className={`absolute inset-0 rounded-full transition-all duration-500 blur-[10px] pointer-events-none ${
                                    isUnlocked
                                      ? "bg-yellow-400/40 animate-pulse scale-125"
                                      : "bg-cyan-400/15 group-hover/sky:bg-cyan-400/30 animate-pulse scale-110"
                                  }`}
                                  style={{ animationDelay: delayVal }}
                                />
                                <svg
                                  className={`w-6 h-6 transition-transform relative z-10 ${isUnlocked ? "rotate-[72deg] fill-yellow-400" : "fill-none stroke-current stroke-2"}`}
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                              </button>
                            );
                          })}

                          {/* Compliment Toast popup inside sky */}
                          <AnimatePresence>
                            {activeToast && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="absolute bottom-3 left-3 right-3 p-3 rounded-xl text-left space-y-1 backdrop-blur-md shadow-2xl z-30"
                                style={{
                                  backgroundColor: "rgba(10, 10, 15, 0.95)",
                                  border: `1px solid ${primaryColor}40`
                                }}
                              >
                                <div className="flex justify-between items-start">
                                  <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: primaryColor }}>Unveiled Memory ✨</span>
                                  <button
                                    onClick={() => setActiveToast(null)}
                                    className="text-[9px] text-slate-400 hover:text-white uppercase tracking-widest font-mono font-bold"
                                  >
                                    [ Close ]
                                  </button>
                                </div>
                                <h4 className="text-xs font-bold text-white leading-tight">{activeToast.title}</h4>
                                <p className="text-[10px] text-slate-200 leading-normal font-sans">{activeToast.text}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Unlock Progress HUD overlay */}
                          <div
                            className="absolute top-2.5 right-3 text-[9px] font-mono font-bold border px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm select-none"
                            style={{
                              color: primaryColor,
                              backgroundColor: "rgba(0,0,0,0.6)",
                              borderColor: `${primaryColor}30`
                            }}
                          >
                            Unlocked: {unlockedStars.length} / 5 Secrets
                          </div>
                        </div>

                        {/* List of already unlocked compliments */}
                        <div data-lenis-prevent className="space-y-1.5 mt-4 max-h-[120px] overflow-y-auto pr-1 text-left scrollbar-thin">
                          {data.complimentStars?.list.map((comp, idx) => {
                            const isUnlocked = unlockedStars.includes(idx);
                            return (
                              <button
                                key={idx}
                                disabled={!isUnlocked}
                                onClick={() => {
                                  setActiveToast(comp);
                                }}
                                className="w-full p-2 rounded-lg border transition-all text-left flex items-start gap-2.5"
                                style={
                                  isUnlocked
                                    ? {
                                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                                        borderColor: `${primaryColor}30`,
                                        color: "#e2e8f0"
                                      }
                                    : {
                                        backgroundColor: "rgba(255, 255, 255, 0.01)",
                                        borderColor: "rgba(255, 255, 255, 0.05)",
                                        color: "#64748b",
                                        opacity: 0.5
                                      }
                                }
                              >
                                <div
                                  className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5 flex-shrink-0"
                                  style={
                                    isUnlocked
                                      ? {
                                          backgroundColor: `${primaryColor}20`,
                                          color: primaryColor
                                        }
                                      : {
                                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                                          color: "#475569"
                                        }
                                  }
                                >
                                  {idx + 1}
                                </div>
                                <div className="flex-1 space-y-0.5 min-w-0">
                                  <h5 className="text-[10px] font-bold truncate">{isUnlocked ? comp.title : "Locked Secret Star"}</h5>
                                  <p className="text-[9px] leading-relaxed font-sans truncate">{isUnlocked ? comp.text : "Tap a glowing star in the night sky map to reveal."}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {unlockedStars.length < 5 ? (
                          <p className="text-[10px] text-pink-400 font-bold mt-3 animate-pulse">
                            🔒 Find all 5 secret stars to unlock the path forward!
                          </p>
                        ) : (
                          <p className="text-[10px] text-green-400 font-bold mt-3 animate-bounce">
                            🔓 All secrets unlocked! Slide forward to reveal the ending surprise →
                          </p>
                        )}
                      </motion.div>
                    )}

                    {activeSlideType === "dateInvitation" && data.dateInvitation && (
                      <motion.div key="slideDateInvitation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="w-full relative overflow-hidden space-y-6">
                        <div className="absolute top-4 right-4 text-xl opacity-60 animate-bounce duration-1000">
                          {getDateEmojis(data.dateInvitation.dateType || "", data.dateInvitation.dateName || "").primary}
                        </div>
                        <div className="absolute top-4 left-4 text-xl opacity-60 animate-bounce duration-2000">
                          {getDateEmojis(data.dateInvitation.dateType || "", data.dateInvitation.dateName || "").secondary}
                        </div>

                        {/* Header Title with Emojis */}
                        <div className="text-center space-y-2 pt-2">
                          <h3 className="text-[10px] uppercase tracking-widest font-black flex items-center justify-center gap-1.5" style={{ color: primaryColor }}>
                            <span>{getDateEmojis(data.dateInvitation.dateType || "", data.dateInvitation.dateName || "").primary}</span>
                            <span>Our Next Chapter</span>
                            <span>{getDateEmojis(data.dateInvitation.dateType || "", data.dateInvitation.dateName || "").secondary}</span>
                          </h3>
                          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide uppercase">
                            {(data.dateInvitation.dateName || "").toUpperCase()}? {getDateEmojis(data.dateInvitation.dateType || "", data.dateInvitation.dateName || "").icons}
                          </h2>
                        </div>

                        {/* Narrative */}
                        <div className="space-y-4 py-2 text-left">
                          <p className="text-sm font-semibold" style={{ color: primaryColor }}>
                            {data.dateInvitation.nickname || data.recipientName}... 🤍
                          </p>
                          <p className="text-xs sm:text-sm leading-relaxed font-light text-slate-200 whitespace-pre-wrap">
                            {data.dateInvitation.letterText}
                          </p>
                        </div>

                        {/* Official Question Callout */}
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5 text-center shadow-inner">
                          <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Official Invitation</p>
                          <p className="text-sm sm:text-base font-bold text-white leading-snug">
                            Will you go on a <span className="text-pink-400 font-black">{data.dateInvitation.dateType} date</span> with me on <span className="text-blue-400 font-mono">{data.dateInvitation.dateDate || ""}</span>, {data.dateInvitation.nickname || data.recipientName}? 🤍 {getDateEmojis(data.dateInvitation.dateType || "").secondary}
                          </p>
                        </div>

                        {/* Action Choices */}
                        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
                          {dateResponse === "pending" ? (
                            <>
                              <button
                                onClick={() => handleDateResponse("accepted")}
                                disabled={dateLoading}
                                style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                                className="w-full sm:w-auto px-8 py-3 rounded-full text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-lg cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                              >
                                Yes, I will ❤️
                              </button>
                              <motion.button
                                onMouseEnter={moveNoButton}
                                onTouchStart={moveNoButton}
                                onClick={() => handleDateResponse("declined")}
                                animate={{ x: noBtnPos.x, y: noBtnPos.y }}
                                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                                disabled={dateLoading}
                                className="w-full sm:w-auto px-6 py-3 rounded-full bg-zinc-900 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer active:scale-95 disabled:opacity-50 select-none relative z-10"
                              >
                                No ❌
                              </motion.button>
                            </>
                          ) : dateResponse === "accepted" ? (
                            <div className="w-full p-4 rounded-xl border border-green-500/20 bg-green-500/10 text-center space-y-1.5 animate-float">
                              <span className="text-lg">💖 🎉</span>
                              <p className="text-sm font-bold text-white">Date Invitation Accepted!</p>
                              <p className="text-xs text-slate-300">A promise is registered. You said yes to the date on {data.dateInvitation.dateDate || ""}! 💙</p>
                            </div>
                          ) : (
                            <div className="w-full p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-center space-y-1.5">
                              <span className="text-lg">😢 💔</span>
                              <p className="text-sm font-bold text-white">Invitation Declined</p>
                              <p className="text-xs text-slate-300">You declined the date. SealedVibeion settings remain recorded.</p>
                              <button
                                onClick={() => {
                                  setDateResponse("pending");
                                  setNoBtnPos({ x: 0, y: 0 });
                                }}
                                className="text-[9px] uppercase tracking-wider hover:underline font-mono font-bold mt-1"
                                style={{ color: primaryColor }}
                              >
                                [ Change Response ]
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {activeSlideType === "surprise" && (
                <motion.div key="slideSurprise" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="w-full space-y-6">
                  <div className="flex justify-center w-full">
                    {data.endingSurprise?.surpriseType === "heartbeat" ? (
                      <HeartbeatPulsator message={data.endingSurprise.surpriseData?.message || "Our hearts beat in harmony."} />
                    ) : (
                      <ScratchCard secretMessage={data.endingSurprise?.surpriseData?.message || data.endingSurprise?.surpriseData?.caption || "You mean the world to me."} />
                    )}
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-xs font-mono tracking-wider animate-pulse" style={{ color: `${primaryColor}cc` }}>
                      ✨ Interact to reveal your surprise, then go to the next slide →
                    </p>
                  </div>
                </motion.div>
              )}
                        {activeSlideType === "credits" && (
              <motion.div key="slideCredits" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="w-full space-y-8">
                <CinematicCredits credits={data.aiGeneratedData.credits} accentColor={primaryColor} />
                
                <div className="flex flex-col items-center gap-3.5 text-center">
                  <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                    Connections are built on listening, growing, and sharing. Tap below if you are ready to reconnect.
                  </p>
                  
                  <button
                    onClick={handleAccept}
                    disabled={loading || status === "accepted"}
                    className={`w-full sm:w-auto px-8 py-3.5 rounded-full text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-85 active:scale-95 ${
                      status === "accepted"
                        ? "bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/20"
                        : "hover:scale-[1.02]"
                    }`}
                    style={status !== "accepted" ? { backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` } : {}}
                  >
                    <Heart className={`w-4 h-4 ${status === "accepted" ? "fill-white text-white animate-pulse" : "fill-white"}`} /> 
                    {status === "accepted" ? "Connection Restored ✓" : labels.button}
                  </button>

                  {status === "accepted" && (
                    <button
                      onClick={() => setShowCelebrationModal(true)}
                      className="text-[9px] hover:underline tracking-widest uppercase font-black font-mono transition-all pt-1"
                      style={{ color: `${primaryColor}dd` }}
                    >
                      [ View SealedVibeion Certificate ]
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Audio Controller */}
        {isOpenLetter && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-3 py-1.5 shadow-2xl">
            <button
              onClick={toggleSound}
              className="flex items-center gap-2 text-xs font-mono font-medium text-slate-200 hover:text-white transition-colors cursor-pointer"
              title={isAudioMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isAudioMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-2 bg-pink-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-0.5 h-3 bg-pink-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-0.5 h-1.5 bg-pink-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[10px] text-pink-300 font-bold uppercase hidden sm:inline">{data.songName || "Playing"}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Bottom Slide Navigation Bar */}
        <footer 
          className="w-full flex justify-between items-center py-2 px-3.5 sm:py-2.5 sm:px-5 z-30 max-w-[300px] sm:max-w-sm mx-auto rounded-full mt-2 sm:mt-4 mb-3 sm:mb-4 bg-[#0c091a]/90 border border-white/20 shadow-2xl backdrop-blur-2xl select-none"
          style={{
            boxShadow: `inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 12px 36px rgba(0, 0, 0, 0.75), 0 0 20px ${primaryColor}15`
          }}
        >
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            disabled={activeSlide === 0}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-20 disabled:hover:bg-transparent text-slate-200 transition-all cursor-pointer active:scale-90 flex-shrink-0"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {/* Center Progress & Slide Name */}
          <div className="flex flex-col items-center justify-center px-2 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold font-mono tracking-wider text-slate-300">
              <span style={{ color: primaryColor }}>{activeSlide + 1}</span>
              <span className="text-slate-500 font-sans">/</span>
              <span className="text-slate-400">{totalSlides}</span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-300 font-sans truncate max-w-[110px] hidden sm:inline">
                {getSlideLabel(slides[activeSlide])}
              </span>
            </div>

            {/* Glowing Smooth Progress Bar */}
            <div className="w-24 sm:w-32 h-1.5 rounded-full bg-white/10 overflow-hidden mt-1 relative">
              <motion.div 
                className="h-full rounded-full"
                initial={false}
                animate={{ width: `${((activeSlide + 1) / totalSlides) * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ 
                  backgroundColor: primaryColor,
                  boxShadow: `0 0 8px ${primaryColor}ee`
                }}
              />
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={activeSlide === totalSlides - 1 || (activeSlideType === "compliments" && unlockedStars.length < 5)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-20 disabled:hover:bg-transparent text-slate-200 transition-all cursor-pointer active:scale-90 flex-shrink-0"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </footer>

        {/* 🎵 YouTube Audio Embed Container (Positioned offscreen with 200px dimensions so mobile browser decodes audio) */}
        <div
          className="fixed -top-[9999px] -left-[9999px] w-48 h-48 pointer-events-none opacity-0 overflow-hidden"
          aria-hidden="true"
        >
          <div id="apology-yt-audio" />
        </div>

      </div>
    </div>
  );
}
