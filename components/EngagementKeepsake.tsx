"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Sparkles, 
  Calendar, 
  Volume2, 
  VolumeX, 
  Send, 
  CheckCircle2, 
  Share2, 
  Users, 
  Navigation, 
  Loader2,
  Heart,
  MapPin,
  ExternalLink,
  Crown,
  QrCode
} from "lucide-react";
import QRCodeModal from "./QRCodeModal";

interface EngagementKeepsakeProps {
  data: {
    slug: string;
    creatorName: string;
    recipientName?: string;
    occasion?: string;
    youtubeUrl?: string;
    songName?: string;
    weddingData?: {
      coupleNames?: string;
      invitationType?: string;
      weddingDate?: string;
      weddingTime?: string;
      venueName?: string;
      venueAddress?: string;
      venueMapsUrl?: string;
      hashtag?: string;
      hostNames?: string;
      monogram?: string;
      guestRsvps?: Array<{
        name: string;
        attendance: string;
        headcount: number;
        message?: string;
        submittedAt: Date | string;
      }>;
    };
  };
}

// Web Audio API Fallback Engine for Romantic Acoustic Guitar & Harpsichord Arpeggio
class RomanticEngagementAudioEngine {
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
      this.playWarmPad();
      this.scheduleAcousticMelody();
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

  private playWarmPad() {
    if (!this.ctx || !this.isPlaying) return;
    const baseFreqs = [130.81, 196.00, 261.63, 329.63]; // C3, G3, C4, E4
    baseFreqs.forEach((freq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(350, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.012, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
    });
  }

  private scheduleAcousticMelody() {
    // Romantic acoustic melody (C Major / A Minor: C4, D4, E4, G4, A4, C5, D5, E5)
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
    const melody = [0, 2, 4, 7, 5, 4, 2, 0, 1, 3, 5, 7, 6, 4, 2, 0];
    let step = 0;

    this.timer = setInterval(() => {
      if (!this.ctx || !this.isPlaying) return;
      const freq = notes[melody[step % melody.length]];
      step++;
      this.pluckAcousticNote(freq);
    }, 600);
  }

  private pluckAcousticNote(freq: number) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(freq * 2.2, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.7);
    } catch (e) {}
  }
}

export default function EngagementKeepsake({ data }: EngagementKeepsakeProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpAttendance, setRsvpAttendance] = useState("attending");
  const [rsvpHeadcount, setRsvpHeadcount] = useState(2);
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const youtubePlayerRef = useRef<any>(null);
  const audioEngineRef = useRef<RomanticEngagementAudioEngine | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const videoId = extractId(data.youtubeUrl);

  const isOpenedRef = useRef(false);

  useEffect(() => {
    isOpenedRef.current = isOpened;
  }, [isOpened]);

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
            youtubePlayerRef.current = new (window as any).YT.Player("engagement-yt-audio", {
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
                    // If user already clicked the wax seal before YT loaded, start playing immediately!
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

  const wedding = data.weddingData || {};
  let coupleNames = wedding.coupleNames || "";
  if (!coupleNames || coupleNames.toLowerCase().includes("family") || coupleNames.toLowerCase().includes("friend")) {
    coupleNames = (data.recipientName && !data.recipientName.toLowerCase().includes("family") && !data.recipientName.toLowerCase().includes("friend"))
      ? data.recipientName
      : (data.creatorName ? `${data.creatorName} & Partner` : "Groom & Bride");
  }
  const namesArray = coupleNames.includes("&") ? coupleNames.split("&").map(n => n.trim()) : [coupleNames, "Partner"];
  const groomName = namesArray[0] || (data.creatorName || "Groom");
  const brideName = namesArray[1] || "Bride";

  const targetDateStr = wedding.weddingDate || "2030-11-20";
  const ceremonyTimeStr = wedding.weddingTime || "6:30 PM";
  const venueName = wedding.venueName || "The Botanical Meadow & Garden Lawn";
  const venueAddress = wedding.venueAddress || "Lakeview Promenade, Rosewood Greens, Grand Celebration Grounds";
  const venueMapsUrl = wedding.venueMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(venueName + " " + venueAddress)}`;
  const hashtag = wedding.hashtag || `#${groomName.replace(/\s+/g, "")}${brideName.replace(/\s+/g, "")}Engagement`;
  const hostNames = wedding.hostNames || "Together with our families, cordially invite you to celebrate our engagement & ring ceremony";
  const monogram = wedding.monogram || `${groomName.charAt(0)} & ${brideName.charAt(0)}`;
  const songTitle = data.songName || "Background Music";

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const target = new Date(`${targetDateStr}T18:30:00`).getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  // Floating rose petals canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const petals: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      angle: number;
      rotationSpeed: number;
      color: string;
    }> = [];

    const colors = ["#fbcfe8", "#fda4af", "#fecdd3", "#fff1f2", "#fcd34d"];
    const count = width < 768 ? 20 : 35;

    for (let i = 0; i < count; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 0.7 + 0.4,
        speedX: (Math.random() - 0.5) * 0.5,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach(p => {
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
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.55;
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    setIsPlayingMusic(true);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    if (data.youtubeUrl) {
      if (youtubePlayerRef.current && typeof youtubePlayerRef.current.playVideo === "function") {
        try {
          youtubePlayerRef.current.unMute();
          youtubePlayerRef.current.setVolume(100);
          youtubePlayerRef.current.playVideo();
        } catch (e) {
          console.warn("Direct YT play prevented by browser policy", e);
        }
      }
    } else {
      // Only start romantic audio engine if no custom YouTube song was provided
      if (audioEngineRef.current) {
        audioEngineRef.current.start();
      }
    }

    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#f472b6", "#fbbf24", "#34d399", "#fbcfe8", "#ffffff"]
      });
    } catch (e) {}

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: data.slug, event: "open" })
    }).catch(() => {});
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

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    setIsSubmittingRsvp(true);
    try {
      const res = await fetch("/api/rsvp-wedding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: data.slug,
          name: rsvpName.trim(),
          attendance: rsvpAttendance,
          headcount: Number(rsvpHeadcount) || 1,
          message: rsvpMessage.trim()
        })
      });

      if (res.ok) {
        setRsvpSuccess(true);
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.7 }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const formatWeddingDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen text-[#2a241e] font-serif relative overflow-x-hidden selection:bg-rose-500/20 selection:text-rose-950 bg-[#faf7f2]">
      
      {/* 🌸 FULL-SCREEN 4K BOTANICAL FLORAL GAZEBO ARCH WALLPAPER BACKDROP */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{
          backgroundImage: "url('/images/engagement_arch_bg.png')",
          backgroundAttachment: "fixed"
        }}
      />

      {/* Light Ethereal Glass Tint Overlay for Clean PC & Mobile Readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#faf7f2]/60 via-[#fdfbf7]/75 to-[#f7f3eb]/85 pointer-events-none z-0 backdrop-blur-[2px]" />

      {/* 🎵 YouTube Audio Embed Container (Positioned offscreen with minimal dimensions so browser decodes audio) */}
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
        <div id="engagement-yt-audio" />
      </div>

      {/* Floating Petals Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      {/* Floating Action Controller Hub */}
      {isOpened && (
        <div className="fixed top-5 right-5 z-40 flex items-center gap-2">
          {/* QR Code Invitation Button */}
          <button
            onClick={() => setShowQrModal(true)}
            className="px-3.5 py-2.5 rounded-full bg-white/90 border border-[#2d5a3c]/30 text-[#2d5a3c] shadow-xl backdrop-blur-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer font-sans font-bold text-xs"
            title="View & Download Botanical QR Invitation Card"
          >
            <QrCode className="w-4 h-4 text-[#2d5a3c]" />
            <span className="hidden sm:inline">QR Code</span>
          </button>

          {/* Floating Audio Controller */}
          <button
            onClick={toggleMusic}
            className="px-4 py-2.5 rounded-full bg-white/90 border border-[#2d5a3c]/30 text-[#2d5a3c] shadow-xl backdrop-blur-md flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer font-sans font-bold text-xs"
          >
            {isPlayingMusic ? (
              <>
                <Volume2 className="w-4 h-4 animate-pulse text-[#2d5a3c]" />
                <span className="truncate max-w-[140px]">{songTitle}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-stone-400" />
                <span className="text-stone-400">Muted</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 🌿 PHASE 1: BOTANICAL WAX SEAL ENTRANCE MODAL */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="engagement-prelude"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97, pointerEvents: "none" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#f8f5ee]/95"
          >
            {/* Backdrop behind modal */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-70"
              style={{ backgroundImage: "url('/images/engagement_arch_bg.png')" }}
            />
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />

            <div className="w-full max-w-lg p-8 sm:p-12 rounded-[40px] bg-[#fdfcf9]/95 border-2 border-[#d4af37]/50 text-center space-y-7 relative overflow-hidden shadow-2xl backdrop-blur-xl">
              
              {/* Gold Top & Bottom Shimmer Stripes */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

              {/* Host Welcoming Line */}
              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs text-[#556b2f] font-sans font-bold uppercase tracking-[0.25em] block">
                  A Joyful Announcement
                </span>
                <p className="text-xs sm:text-sm text-stone-600 font-sans font-light italic leading-relaxed">
                  {hostNames}
                </p>
              </div>

              {/* Couple Names in Grand Script */}
              <div className="space-y-2">
                <h1 className="text-5xl sm:text-7xl font-normal text-[#221c16] italic drop-shadow-sm tracking-tight leading-tight">
                  {coupleNames}
                </h1>
                <p className="text-xs text-[#2d5a3c] font-sans tracking-widest uppercase font-bold">
                  {hashtag} • Ring Ceremony Invitation
                </p>
              </div>

              {/* Interactive Sage Green Wax Seal Button */}
              <div className="pt-2 flex justify-center">
                <motion.div
                  onClick={handleOpenInvitation}
                  whileHover={{ scale: 1.08, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-28 h-28 rounded-full bg-gradient-to-br from-[#4a6b47] via-[#3a5837] to-[#253f23] border-4 border-white/60 shadow-[0_0_40px_rgba(45,90,60,0.4)] flex flex-col items-center justify-center cursor-pointer relative group"
                >
                  <span className="text-2xl mb-0.5 group-hover:scale-125 transition-transform duration-300">💍</span>
                  <span className="text-sm font-bold text-[#e6f3e4] tracking-wider font-mono">
                    {monogram}
                  </span>
                  <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </div>

              <div className="space-y-1.5 pt-2">
                <p className="text-xs text-[#2d5a3c] font-sans uppercase tracking-widest animate-pulse font-bold">
                  Tap the Wax Seal to Enter the Garden ✨
                </p>
                <div className="text-[10px] text-stone-400 font-sans">
                  Curated with love by {data.creatorName}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌸 PHASE 2: MAIN ENGAGEMENT SCROLLABLE EXPERIENCE (OPTIMIZED FOR PC & MOBILE) */}
      <main className="max-w-4xl mx-auto px-6 py-16 sm:py-24 space-y-24 relative z-20 text-center">
        
        {/* 1. HERO SECTION & ROMANTIC COUPLE CENTERPIECE */}
        <section className="space-y-8 pt-4">
          
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/80 border border-[#2d5a3c]/30 text-xs font-sans text-[#2d5a3c] uppercase tracking-[0.25em] font-bold shadow-md backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#558b2f]" /> Joyful Celebration of Love & Promise
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-sm sm:text-base text-stone-600 font-light italic leading-relaxed">
              {hostNames}
            </p>
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-normal text-[#221c16] italic leading-tight drop-shadow-sm py-2">
              {coupleNames}
            </h1>
            <p className="text-xs sm:text-sm text-[#2d5a3c] font-sans tracking-[0.2em] uppercase font-bold">
              {venueName} • {formatWeddingDate(targetDateStr)}
            </p>
          </div>

          {/* 🌟 GORGEOUS ROMANTIC COUPLE CENTERPIECE ARTWORK */}
          <div className="pt-2 flex justify-center">
            <div className="w-full max-w-md p-3 rounded-[40px] bg-white/90 border-2 border-[#d4af37]/40 shadow-2xl relative overflow-hidden group backdrop-blur-md">
              <div className="w-full aspect-[2/3] rounded-[32px] overflow-hidden border border-stone-200 relative shadow-inner">
                <img 
                  src="/images/animated_couple.jpg" 
                  alt={coupleNames} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="text-xs uppercase tracking-[0.3em] font-sans text-white font-extrabold drop-shadow-md">
                    Two Rings • One Promise 💍
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Floral Divider */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-[#2d5a3c]/40 to-transparent" />
            <Heart className="w-5 h-5 text-[#2d5a3c] fill-[#2d5a3c]/20" />
            <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-[#2d5a3c]/40 to-transparent" />
          </div>

        </section>

        {/* 2. LIVE REAL-TIME COUNTDOWN CLOCK */}
        <section className="p-8 sm:p-12 rounded-[40px] bg-white/90 border-2 border-[#d4af37]/40 shadow-2xl backdrop-blur-md space-y-8 relative overflow-hidden">
          
          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-[0.25em] font-sans text-[#556b2f] font-bold block">
              The Auspicious Countdown
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#221c16] italic">Until The Ring Ceremony Begins</h2>
            <p className="text-xs text-stone-500 font-sans font-light italic pt-1">
              {formatWeddingDate(targetDateStr)} • Ceremony at {ceremonyTimeStr}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-5 max-w-xl mx-auto font-sans">
            
            <div className="p-3 sm:p-5 rounded-2xl bg-[#faf7f2] border border-[#d4af37]/30 text-center shadow-md flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-4xl font-extrabold text-[#2d5a3c] block font-mono leading-tight">{timeLeft.days}</span>
              <span className="text-[8px] sm:text-[11px] text-stone-500 uppercase tracking-widest font-bold mt-1">Days</span>
            </div>

            <div className="p-3 sm:p-5 rounded-2xl bg-[#faf7f2] border border-[#d4af37]/30 text-center shadow-md flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-4xl font-extrabold text-[#2d5a3c] block font-mono leading-tight">{timeLeft.hours}</span>
              <span className="text-[8px] sm:text-[11px] text-stone-500 uppercase tracking-widest font-bold mt-1">Hours</span>
            </div>

            <div className="p-3 sm:p-5 rounded-2xl bg-[#faf7f2] border border-[#d4af37]/30 text-center shadow-md flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-4xl font-extrabold text-[#2d5a3c] block font-mono leading-tight">{timeLeft.minutes}</span>
              <span className="text-[8px] sm:text-[11px] text-stone-500 uppercase tracking-widest font-bold mt-1">Mins</span>
            </div>

            <div className="p-3 sm:p-5 rounded-2xl bg-[#faf7f2] border border-[#d4af37]/30 text-center shadow-md flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-4xl font-extrabold text-[#2d5a3c] block font-mono leading-tight">{timeLeft.seconds}</span>
              <span className="text-[8px] sm:text-[11px] text-stone-500 uppercase tracking-widest font-bold mt-1">Secs</span>
            </div>

          </div>

        </section>

        {/* 3. CELEBRATION VENUE & GOOGLE MAPS NAVIGATION */}
        <section className="p-8 sm:p-12 rounded-[40px] bg-white/90 border-2 border-[#d4af37]/40 shadow-2xl backdrop-blur-md space-y-6 text-center">
          
          <div className="w-14 h-14 rounded-2xl bg-[#2d5a3c]/10 border border-[#2d5a3c]/30 flex items-center justify-center mx-auto text-[#2d5a3c] shadow-sm">
            <MapPin className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] font-sans text-[#556b2f] font-bold block">
              The Celebration Venue
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold text-[#221c16] italic">
              {venueName}
            </h3>
            <p className="text-xs sm:text-sm font-sans text-stone-600 max-w-md mx-auto font-light leading-relaxed">
              {venueAddress}
            </p>
          </div>

          <div className="pt-2">
            <a
              href={venueMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#2d5a3c] hover:bg-[#23472e] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-xl shadow-emerald-950/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Navigation className="w-4 h-4" /> Open in Google Maps
            </a>
          </div>

        </section>

        {/* 4. GUEST RSVP & BLESSINGS TERMINAL */}
        <section className="p-8 sm:p-12 rounded-[40px] bg-[#2d5a3c] text-white shadow-2xl space-y-8 text-center relative overflow-hidden">
          
          <div className="space-y-2 max-w-md mx-auto">
            <span className="text-xs uppercase tracking-[0.25em] font-sans text-[#cbe5c8] font-bold block">
              Will You Join Our Celebration?
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold italic">
              Kindly Confirm Your Presence
            </h3>
            <p className="text-xs sm:text-sm font-sans text-[#d4e8d2] font-light leading-relaxed">
              Your presence and blessings mean the world to us as we exchange rings.
            </p>
          </div>

          {rsvpSuccess ? (
            <div className="p-8 rounded-3xl bg-white/10 border border-white/20 text-center space-y-3 max-w-md mx-auto">
              <CheckCircle2 className="w-12 h-12 text-amber-300 mx-auto" />
              <h4 className="text-xl font-bold font-serif italic">RSVP Received with Joy!</h4>
              <p className="text-xs font-sans text-stone-200">
                Thank you, {rsvpName}! Your response has been recorded for the couple.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-4 max-w-md mx-auto font-sans text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#cbe5c8]">Your Name / Family Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Guest Name & Family"
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-xs text-white placeholder-stone-300 focus:outline-none focus:border-amber-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#cbe5c8]">Attendance</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpAttendance("attending")}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all border text-center ${
                      rsvpAttendance === "attending"
                        ? "bg-amber-400 text-[#1b3321] border-amber-400 shadow-md font-black"
                        : "bg-white/10 text-white border-white/20"
                    }`}
                  >
                    ✨ Attending with Joy
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpAttendance("declined")}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all border text-center ${
                      rsvpAttendance === "declined"
                        ? "bg-rose-400 text-white border-rose-400 shadow-md font-black"
                        : "bg-white/10 text-white border-white/20"
                    }`}
                  >
                    💖 Blessings Only
                  </button>
                </div>
              </div>

              {rsvpAttendance === "attending" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#cbe5c8]">Number of Attending Guests</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={rsvpHeadcount}
                    onChange={(e) => setRsvpHeadcount(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs text-white font-mono focus:outline-none focus:border-amber-300"
                  />
                </div>
              )}

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#cbe5c8]">Blessings / Message (Optional)</label>
                  <span className={`text-[9px] font-mono font-bold ${
                    (rsvpMessage.trim() ? rsvpMessage.trim().split(/\s+/).filter(Boolean).length : 0) > 90 ? "text-amber-300" : "text-[#cbe5c8]/70"
                  }`}>
                    {rsvpMessage.trim() ? rsvpMessage.trim().split(/\s+/).filter(Boolean).length : 0} / 100 words
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder="Wishing you a lifetime of love and joy (max 100 words)..."
                  value={rsvpMessage}
                  onChange={(e) => {
                    const text = e.target.value;
                    const words = text.trim().split(/\s+/).filter(Boolean);
                    if (words.length <= 100 || text.length < rsvpMessage.length) {
                      setRsvpMessage(text);
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs text-white placeholder-stone-300 resize-none focus:outline-none focus:border-amber-300"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingRsvp || !rsvpName.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 hover:from-amber-200 text-[#1b3321] font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer transition-all disabled:opacity-50"
              >
                {isSubmittingRsvp ? "Submitting RSVP..." : "Confirm RSVP"}
              </button>
            </form>
          )}

        </section>

        {/* 🌿 WE CAN'T WAIT TO CELEBRATE WITH YOU (ENGAGEMENT FINALE CARD) */}
        <section className="p-6 sm:p-12 rounded-[30px] sm:rounded-[38px] bg-gradient-to-b from-white/95 via-[#fcfbf7]/95 to-[#f7f5ed]/95 border-2 border-emerald-700/20 shadow-[0_20px_70px_rgba(45,90,60,0.12)] backdrop-blur-xl space-y-6 text-center font-serif text-stone-800 relative overflow-hidden">
          
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-emerald-800/10 border border-emerald-700/20 text-xs font-sans text-emerald-800 uppercase tracking-[0.25em] font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> With Love &amp; Gratitude
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 font-['Cormorant_Garamond',Georgia,serif] italic leading-tight">
              We Can&apos;t Wait to Celebrate With You! 💍🌿
            </h2>
            <p className="text-xs sm:text-base text-stone-600 font-['Cormorant_Garamond',Georgia,serif] italic leading-relaxed">
              &ldquo;Your presence, warm blessings, and love mean the absolute world to us as we exchange our rings and begin this sacred new chapter of togetherness. We eagerly await sharing our joy and celebrating this beautiful day with you.&rdquo;
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 my-4">
            <div className="h-[1px] flex-1 max-w-[120px] bg-gradient-to-r from-transparent via-emerald-700/30 to-emerald-700/60" />
            <span className="text-xs text-emerald-700">✦ 💍 ✦</span>
            <div className="h-[1px] flex-1 max-w-[120px] bg-gradient-to-l from-transparent via-emerald-700/30 to-emerald-700/60" />
          </div>

          {/* Couple Sign-off */}
          <div className="space-y-2">
            <span className="text-[11px] font-sans uppercase tracking-[0.3em] text-emerald-800/80 font-bold block">
              Eagerly Awaiting Your Presence
            </span>
            <p className="text-2xl sm:text-3xl font-bold font-['Playfair_Display',Georgia,serif] text-[#1b3321] drop-shadow-sm">
              {coupleNames}
            </p>
            {hashtag && (
              <div className="inline-block pt-1.5">
                <span className="px-4 py-1.5 rounded-full bg-emerald-700/10 border border-emerald-700/20 text-xs font-mono font-bold text-emerald-900 tracking-wider shadow-sm">
                  {hashtag}
                </span>
              </div>
            )}
          </div>

        </section>

        {/* Footer */}
        <footer className="pt-8 text-center text-xs font-sans text-stone-500 border-t border-stone-300/60 space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2d5a3c]/10 border border-[#2d5a3c]/30 hover:bg-[#2d5a3c]/20 text-[#2d5a3c] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              <QrCode className="w-4 h-4 text-[#2d5a3c]" /> Scan & Download Botanical QR Card
            </button>
          </div>
          <p>Crafted with love on SealedVibe • {coupleNames}</p>
        </footer>

      </main>

      {/* 🌿 Botanical Engagement QR Code & Printable Card Modal */}
      <QRCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        type="engagement"
        names={coupleNames}
        title="Engagement & Ring Ceremony"
        date={targetDateStr}
        time={ceremonyTimeStr}
        venue={venueName}
        url={typeof window !== "undefined" ? `${window.location.origin}/p/${data.slug}` : `https://www.sealedvibe.in/p/${data.slug}`}
      />
    </div>
  );
}
