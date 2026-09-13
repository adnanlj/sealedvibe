"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Volume2,
  VolumeX,
  Share2,
  CheckCircle2,
  Users,
  Navigation,
  CalendarPlus,
  Wine,
  PartyPopper,
  Music,
  Disc,
  Glasses,
  Flame,
  Star,
  Cake,
  Crown,
  QrCode
} from "lucide-react";
import QRCodeModal from "./QRCodeModal";

interface BirthdayPartyInviteProps {
  data: {
    slug: string;
    creatorName: string;
    recipientName: string;
    occasion: string;
    youtubeUrl?: string;
    songName?: string;
    birthdayPartyData?: {
      birthdayPersonName?: string;
      ageMilestone?: string;
      eventTitle?: string;
      hostNames?: string;
      tagline?: string;
      partyDate?: string;
      partyTime?: string;
      venueName?: string;
      venueAddress?: string;
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
        attendance: string;
        headcount: number;
        djSong?: string;
        message?: string;
        submittedAt: Date;
      }>;
    };
  };
}

// 🎈 Interactive Web Audio Synth for Celebration Melody & Sound Effects
class PartyAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlayingSynthMelody = false;
  private melodyInterval: any = null;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // 🍾 Crisp Champagne Cork Pop Sound Simulation
  playCorkPop() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.08);

      gain.gain.setValueAtTime(0.8, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.09);

      // High fizz sparkle
      const bufferSize = this.ctx.sampleRate * 0.3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.value = 4500;
      noiseFilter.Q.value = 3.0;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, t + 0.02);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t + 0.02);
    } catch (e) {}
  }

  // 🥂 Crystal Toast Clink Sound Simulation
  playToastClink() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      [2800, 3920, 5200].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.25 / (idx + 1), t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.95);
      });
    } catch (e) {}
  }

  // 🎵 Soft Celebration Music Chords Fallback (guarantees sound if YouTube is blocked/fails)
  startCelebrationChords() {
    try {
      this.init();
      if (!this.ctx || this.isPlayingSynthMelody) return;
      this.isPlayingSynthMelody = true;

      const chords = [
        [261.63, 329.63, 392.00, 523.25], // C major
        [220.00, 261.63, 329.63, 440.00], // A minor
        [174.61, 220.00, 261.63, 349.23], // F major
        [196.00, 246.94, 293.66, 392.00]  // G major
      ];

      let chordIdx = 0;
      const playNextChord = () => {
        if (!this.ctx || !this.isPlayingSynthMelody) return;
        const now = this.ctx.currentTime;
        const currentChord = chords[chordIdx % chords.length];

        currentChord?.forEach((freq) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 2.9);
        });

        chordIdx++;
      };

      playNextChord();
      this.melodyInterval = setInterval(playNextChord, 2800);
    } catch (e) {}
  }

  stopCelebrationChords() {
    this.isPlayingSynthMelody = false;
    if (this.melodyInterval) {
      clearInterval(this.melodyInterval);
      this.melodyInterval = null;
    }
  }
}

// ⚜️ Elegant Vintage Gold Filigree Divider Component
function VintageGoldDivider({ className = "my-4" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-[1px] w-12 sm:w-28 bg-gradient-to-r from-transparent to-[#d4af37]" />
      <span className="text-[#d4af37] text-sm select-none">⚜️</span>
      <div className="h-[1px] w-12 sm:w-28 bg-gradient-to-l from-transparent to-[#d4af37]" />
    </div>
  );
}

// 🎈 Corner 3D Photorealistic Balloon Clusters (Matching the reference screenshot!)
function CornerBalloonsTopRight() {
  return (
    <div className="absolute top-0 right-0 w-36 h-36 sm:w-64 sm:h-64 pointer-events-none z-10 overflow-visible select-none">
      <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible drop-shadow-xl">
        <defs>
          {/* Champagne Gold Balloon Gradient */}
          <radialGradient id="goldBalloonGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#fdf0cd" />
            <stop offset="60%" stopColor="#eed180" />
            <stop offset="90%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#8c6d1f" />
          </radialGradient>

          {/* Blush Pink Balloon Gradient */}
          <radialGradient id="pinkBalloonGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#fce7f3" />
            <stop offset="70%" stopColor="#f9a8d4" />
            <stop offset="100%" stopColor="#f472b6" />
          </radialGradient>

          {/* Rose Gold Balloon Gradient */}
          <radialGradient id="roseGoldGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#ffe4e6" />
            <stop offset="70%" stopColor="#f4b5a6" />
            <stop offset="100%" stopColor="#c98579" />
          </radialGradient>

          {/* Ivory White Balloon Gradient */}
          <radialGradient id="ivoryBalloonGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fffdfa" />
            <stop offset="80%" stopColor="#fef3e2" />
            <stop offset="100%" stopColor="#e5dec9" />
          </radialGradient>
        </defs>

        {/* Back Balloon (Gold) */}
        <g transform="translate(160, -10) rotate(12)">
          <ellipse cx="30" cy="40" rx="36" ry="46" fill="url(#goldBalloonGrad)" filter="drop-shadow(0 6px 12px rgba(140,109,31,0.25))" />
          <path d="M 27 86 L 33 86 L 30 92 Z" fill="#d4af37" />
          <path d="M 30 92 Q 38 120 22 150 T 35 180" stroke="#d4af37" strokeWidth="1.5" fill="none" opacity="0.6" />
        </g>

        {/* Back Balloon (Rose Gold) */}
        <g transform="translate(190, 50) rotate(-10)">
          <ellipse cx="25" cy="45" rx="34" ry="44" fill="url(#roseGoldGrad)" filter="drop-shadow(0 6px 12px rgba(201,133,121,0.3))" />
          <path d="M 22 89 L 28 89 L 25 95 Z" fill="#c98579" />
        </g>

        {/* Front Balloon (Blush Pink) */}
        <g transform="translate(120, 20) rotate(-5)">
          <ellipse cx="40" cy="50" rx="42" ry="52" fill="url(#pinkBalloonGrad)" filter="drop-shadow(0 8px 16px rgba(244,114,182,0.35))" />
          <ellipse cx="28" cy="35" rx="14" ry="24" fill="#ffffff" opacity="0.45" transform="rotate(-25 28 35)" />
          <path d="M 37 102 L 43 102 L 40 108 Z" fill="#f472b6" />
          <path d="M 40 108 Q 48 140 32 170 T 45 210" stroke="#d4af37" strokeWidth="1.5" fill="none" opacity="0.7" />
        </g>

        {/* Front Balloon (Ivory Cream White) */}
        <g transform="translate(160, 90) rotate(15)">
          <ellipse cx="35" cy="45" rx="38" ry="48" fill="url(#ivoryBalloonGrad)" filter="drop-shadow(0 8px 16px rgba(212,175,55,0.2))" />
          <ellipse cx="25" cy="32" rx="12" ry="22" fill="#ffffff" opacity="0.55" transform="rotate(-25 25 32)" />
          <path d="M 32 93 L 38 93 L 35 99 Z" fill="#d4af37" />
          <path d="M 35 99 Q 25 130 45 160" stroke="#d4af37" strokeWidth="1.5" fill="none" opacity="0.7" />
        </g>

        {/* Golden Foil Confetti & Ribbon Streamers */}
        <rect x="110" y="80" width="10" height="6" fill="#d4af37" transform="rotate(35 110 80)" />
        <rect x="145" y="145" width="8" height="5" fill="#f5d061" transform="rotate(-20 145 145)" />
        <rect x="90" y="40" width="7" height="4" fill="#d4af37" transform="rotate(15 90 40)" />
        <circle cx="100" cy="95" r="2.5" fill="#d4af37" />
        <circle cx="130" cy="160" r="3" fill="#e8a598" />
        <circle cx="155" cy="45" r="2" fill="#f5d061" />
        <path d="M 120 70 Q 128 85 122 100 T 130 115" stroke="#d4af37" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 175 140 Q 185 155 178 170 T 186 185" stroke="#f5d061" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function CornerBalloonsBottomLeft() {
  return (
    <div className="absolute bottom-0 left-0 w-36 h-36 sm:w-64 sm:h-64 pointer-events-none z-10 overflow-visible select-none">
      <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible drop-shadow-xl">
        {/* Back Balloon (Rose Gold) */}
        <g transform="translate(-10, 140) rotate(-15)">
          <ellipse cx="40" cy="40" rx="36" ry="46" fill="url(#roseGoldGrad)" filter="drop-shadow(0 6px 12px rgba(201,133,121,0.25))" />
          <path d="M 37 86 L 43 86 L 40 92 Z" fill="#c98579" />
        </g>

        {/* Back Balloon (Ivory White) */}
        <g transform="translate(10, 80) rotate(10)">
          <ellipse cx="35" cy="45" rx="36" ry="46" fill="url(#ivoryBalloonGrad)" filter="drop-shadow(0 6px 12px rgba(212,175,55,0.2))" />
          <ellipse cx="25" cy="32" rx="12" ry="22" fill="#ffffff" opacity="0.55" transform="rotate(-25 25 32)" />
        </g>

        {/* Front Balloon (Gold) */}
        <g transform="translate(45, 120) rotate(-8)">
          <ellipse cx="40" cy="50" rx="42" ry="52" fill="url(#goldBalloonGrad)" filter="drop-shadow(0 8px 16px rgba(140,109,31,0.35))" />
          <ellipse cx="28" cy="35" rx="14" ry="24" fill="#ffffff" opacity="0.5" transform="rotate(-25 28 35)" />
          <path d="M 37 102 L 43 102 L 40 108 Z" fill="#d4af37" />
          <path d="M 40 108 Q 30 135 50 165" stroke="#d4af37" strokeWidth="1.5" fill="none" opacity="0.7" />
        </g>

        {/* Front Balloon (Blush Pink) */}
        <g transform="translate(-20, 180) rotate(8)">
          <ellipse cx="45" cy="45" rx="40" ry="50" fill="url(#pinkBalloonGrad)" filter="drop-shadow(0 8px 16px rgba(244,114,182,0.35))" />
          <ellipse cx="32" cy="32" rx="13" ry="23" fill="#ffffff" opacity="0.45" transform="rotate(-25 32 32)" />
        </g>

        {/* Golden Foil Confetti & Ribbon Streamers */}
        <rect x="75" y="105" width="9" height="5" fill="#d4af37" transform="rotate(-25 75 105)" />
        <rect x="110" y="145" width="8" height="5" fill="#f5d061" transform="rotate(30 110 145)" />
        <rect x="40" y="65" width="7" height="4" fill="#e8a598" transform="rotate(15 40 65)" />
        <circle cx="85" cy="90" r="2.5" fill="#d4af37" />
        <circle cx="120" cy="130" r="3" fill="#f5d061" />
        <circle cx="60" cy="155" r="2" fill="#d4af37" />
        <path d="M 65 110 Q 55 125 68 140 T 60 155" stroke="#d4af37" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 95 65 Q 105 80 98 95 T 106 110" stroke="#f5d061" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function BirthdayPartyInvite({ data }: BirthdayPartyInviteProps) {
  const party = data.birthdayPartyData || {};
  const birthdayName = party.birthdayPersonName || (party as any).personName || data.recipientName || "Birthday Star";
  const eventTitle = party.eventTitle || `${birthdayName}'s Birthday Celebration`;
  const ageMilestone = party.ageMilestone || "Milestone Birthday";
  const targetDateStr = party.partyDate || "2029-08-18";
  const targetTimeStr = party.partyTime || "7:00 PM Onwards";
  const venueName = party.venueName || "The Grand Imperial Ballroom";
  const venueAddress = party.venueAddress || "108 Royal Heritage Promenade, Golden Greens";

  const [isOpened, setIsOpened] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState<"attending" | "declined">("attending");
  const [headcount, setHeadcount] = useState(1);
  const [djSong, setDjSong] = useState("");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [totalHeadcount, setTotalHeadcount] = useState(
    party.guestRsvps?.filter((r) => r.attendance === "attending").reduce((acc, r) => acc + (r.headcount || 1), 0) || 18
  );

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioEngineRef = useRef<PartyAudioEngine | null>(null);
  const youtubePlayerRef = useRef<any>(null);
  const isOpenedRef = useRef(false);

  useEffect(() => {
    isOpenedRef.current = isOpened;
  }, [isOpened]);

  // Initialize Audio Engine & Ensure Page Scrolling
  useEffect(() => {
    audioEngineRef.current = new PartyAudioEngine();
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    document.body.style.touchAction = "auto";
  }, []);

  // Format Display Date (e.g., "03 JUNE 2029")
  const formatDisplayDate = (dateString: string) => {
    try {
      const parts = dateString.split("-");
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).toUpperCase();
      }
      const d = new Date(dateString);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).toUpperCase();
      }
      return dateString.toUpperCase();
    } catch (e) {
      return dateString.toUpperCase();
    }
  };

  // Live Countdown Ticker
  useEffect(() => {
    const calculateTime = () => {
      try {
        let eventDate = new Date(`${targetDateStr}T19:00:00`);
        if (isNaN(eventDate.getTime())) {
          eventDate = new Date(targetDateStr);
        }
        const now = new Date();
        const difference = eventDate.getTime() - now.getTime();

        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      } catch (e) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  // Robust YouTube Background Audio Player Initializer
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
            youtubePlayerRef.current = new (window as any).YT.Player("party-yt-audio", {
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
                    // If user clicked before player ready, start playing immediately!
                    if (isOpenedRef.current) {
                      event.target.playVideo();
                      if (audioEngineRef.current) {
                        audioEngineRef.current.stopCelebrationChords();
                      }
                      setIsPlayingMusic(true);
                    }
                  } catch (e) {}
                },
                onError: () => {
                  if (isOpenedRef.current && audioEngineRef.current) {
                    audioEngineRef.current.startCelebrationChords();
                  }
                },
              },
            });
          } catch (e) {}
        }
      }
    }, 150);

    return () => clearInterval(checkInterval);
  }, [data.youtubeUrl]);

  // 🎈 Floating Golden Dust & Foil Canvas Physics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    interface ConfettiFlake {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      rotation: number;
      rotSpeed: number;
      color: string;
      opacity: number;
    }

    const flakes: ConfettiFlake[] = [];
    const flakeCount = Math.min(width < 768 ? 25 : 45, 50);
    const flakeColors = ["#d4af37", "#f5d061", "#e8a598", "#ffd700", "#f9a8d4"];

    for (let i = 0; i < flakeCount; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 4 + 2,
        speedY: Math.random() * 0.45 + 0.15,
        speedX: (Math.random() - 0.5) * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        color: flakeColors[Math.floor(Math.random() * flakeColors.length)],
        opacity: Math.random() * 0.55 + 0.25,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      flakes.forEach((f) => {
        f.y += f.speedY;
        f.x += f.speedX;
        f.rotation += f.rotSpeed;

        if (f.y > height + 20) {
          f.y = -20;
          f.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotation);
        ctx.globalAlpha = f.opacity;
        ctx.fillStyle = f.color;
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(212, 175, 55, 0.35)";
        ctx.fillRect(-f.size / 2, -f.size / 4, f.size, f.size * 0.6);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 🍾 Open Party Invitation Handler
  const handleOpenInvitation = () => {
    setIsOpened(true);
    setIsPlayingMusic(true);

    if (audioEngineRef.current) {
      audioEngineRef.current.playCorkPop();
    }

    let ytStarted = false;
    if (youtubePlayerRef.current && typeof youtubePlayerRef.current.playVideo === "function") {
      try {
        youtubePlayerRef.current.unMute();
        youtubePlayerRef.current.setVolume(100);
        youtubePlayerRef.current.playVideo();
        ytStarted = true;
      } catch (e) {}
    }

    // If YouTube didn't start or was missing, start the melodic harmonic chords!
    if (!ytStarted && audioEngineRef.current) {
      audioEngineRef.current.startCelebrationChords();
    }

    try {
      // Golden Champagne & Rose Gold Confetti Burst
      confetti({
        particleCount: 160,
        spread: 95,
        origin: { y: 0.55 },
        colors: ["#ffd700", "#f59e0b", "#f7c6cc", "#e8a598", "#ffffff", "#d4af37"],
      });
    } catch (e) {}
  };

  // 🥂 Floating "Toast the Birthday Star" Button Handler
  const handleToastClink = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.playToastClink();
    }
    try {
      confetti({
        particleCount: 75,
        spread: 85,
        origin: { y: 0.8 },
        colors: ["#ffd700", "#d4af37", "#f7c6cc", "#e8a598", "#ffffff"],
        shapes: ["star", "circle"],
        scalar: 1.15,
      });
    } catch (e) {}
  };

  // Toggle Background Music
  const toggleMusic = () => {
    if (isPlayingMusic) {
      if (youtubePlayerRef.current && typeof youtubePlayerRef.current.pauseVideo === "function") {
        try {
          youtubePlayerRef.current.pauseVideo();
        } catch (e) {}
      }
      if (audioEngineRef.current) {
        audioEngineRef.current.stopCelebrationChords();
      }
      setIsPlayingMusic(false);
    } else {
      let ytStarted = false;
      if (youtubePlayerRef.current && typeof youtubePlayerRef.current.playVideo === "function") {
        try {
          youtubePlayerRef.current.unMute();
          youtubePlayerRef.current.playVideo();
          ytStarted = true;
        } catch (e) {}
      }
      if (!ytStarted && audioEngineRef.current) {
        audioEngineRef.current.startCelebrationChords();
      }
      setIsPlayingMusic(true);
    }
  };

  // 1-Click Google Calendar Generator
  const getGoogleCalendarUrl = (title: string, timeStr: string, venue: string) => {
    try {
      const calTitle = encodeURIComponent(`${title} - ${eventTitle}`);
      const details = encodeURIComponent(
        `Birthday Celebration of ${birthdayName}!\nVenue: ${venue}`
      );
      const location = encodeURIComponent(venue || venueName);

      let dateParam = "";
      try {
        const cleanDate = targetDateStr.trim();
        const parsed = new Date(`${cleanDate}T19:00:00`);
        if (!isNaN(parsed.getTime())) {
          const startISO = parsed.toISOString().replace(/-|:|\.\d+/g, "");
          const end = new Date(parsed.getTime() + 4 * 60 * 60 * 1000); // 4 hours party duration
          const endISO = end.toISOString().replace(/-|:|\.\d+/g, "");
          dateParam = `&dates=${startISO}/${endISO}`;
        }
      } catch (e) {}

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&details=${details}&location=${location}${dateParam}`;
    } catch (e) {
      return "#";
    }
  };

  // Handle RSVP Submission
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setRsvpLoading(true);
    try {
      const res = await fetch("/api/rsvp-wedding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: data.slug,
          name: guestName.trim(),
          attendance,
          headcount: attendance === "attending" ? Number(headcount) || 1 : 0,
          djSong: djSong.trim() || undefined,
          message: rsvpMessage.trim() || undefined,
        }),
      });

      const resData = await res.json();
      if (res.ok) {
        setRsvpSubmitted(true);
        if (resData.totalAttending) {
          setTotalHeadcount(resData.totalAttending);
        }
        confetti({
          particleCount: 180,
          spread: 90,
          origin: { y: 0.65 },
          colors: ["#ffd700", "#d4af37", "#f7c6cc", "#e8a598", "#ffffff"],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRsvpLoading(false);
    }
  };

  // WhatsApp Invite Share Handler
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🎉 You're Invited to ${birthdayName}'s Birthday Celebration!\n\n✨ Event: ${eventTitle}\n📅 Date: ${formatDisplayDate(
        targetDateStr
      )}\n📍 Venue: ${venueName}\n\nTap here to view the VIP Invitation & RSVP:\n${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const itinerary = (party.itinerary && party.itinerary.length > 0)
    ? party.itinerary
    : ((party as any).timeline && (party as any).timeline.length > 0)
    ? (party as any).timeline
    : [
    { title: "Welcome High Tea & Cocktails", time: "7:00 PM", desc: "Signature artisanal mocktails, champagne flutes, and hors d'oeuvres.", icon: "🍸" },
    { title: "Grand Birthday Cake Cutting", time: "8:30 PM", desc: "Gather around for the grand cake cutting and champagne toasts.", icon: "🎂" },
    { title: "Gourmet Dinner & Celebration Toasts", time: "9:15 PM", desc: "A curated feast with live acoustic melodies and heartfelt toasts.", icon: "🥂" },
    { title: "DJ Music & Dance Floor Open", time: "10:15 PM", desc: "Celebratory tracks, dancing under the stars, and unforgettable memories.", icon: "🪩" },
  ];

  return (
    <div className="min-h-screen text-[#2b2118] font-sans relative overflow-x-hidden selection:bg-[#d4af37]/30 selection:text-[#8c6d1f] bg-[#fffdf9]">
      
      {/* 🔮 Radiant Sun-Dappled Warm Cream & Gold Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#eed180]/35 via-[#fce7f3]/25 to-transparent blur-[100px]" />
        <div className="absolute top-[30%] right-[-5%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-bl from-[#fef3c7]/40 via-[#ffe4e6]/30 to-transparent blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-t from-[#fed7aa]/35 to-transparent blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#d4af3718_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      {/* Hidden YouTube Audio Player */}
      <div className="fixed -top-[9999px] -left-[9999px] w-48 h-48 pointer-events-none opacity-0 overflow-hidden" aria-hidden="true">
        <div id="party-yt-audio" />
      </div>

      {/* 🎈 Floating Golden Flakes Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      {/* 🎛️ Floating Action Hub Controls */}
      {isOpened && (
        <>
          {/* Top Floating Controls */}
          <div className="fixed top-5 right-5 z-40 flex items-center gap-2">
            {/* QR Code Invitation Button */}
            <button
              onClick={() => setShowQrModal(true)}
              className="px-3.5 py-2 rounded-full bg-white/95 border border-[#d4af37]/70 text-[#8c6d1f] shadow-lg shadow-amber-950/10 backdrop-blur-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              title="View & Download QR Code Card"
            >
              <QrCode className="w-4 h-4 text-[#d4af37]" />
              <span className="text-[11px] font-bold font-mono tracking-wider text-[#6b4e2e] hidden sm:inline">QR CODE</span>
            </button>

            {/* Top Audio Toggle */}
            <button
              onClick={toggleMusic}
              className="px-4 py-2 rounded-full bg-white/95 border border-[#d4af37]/70 text-[#8c6d1f] shadow-lg shadow-amber-950/10 backdrop-blur-md flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              title={isPlayingMusic ? "Mute Party Music" : "Play Party Music"}
            >
              {isPlayingMusic ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#d4af37] animate-pulse" />
                  <span className="text-[11px] font-bold font-mono tracking-wider text-[#6b4e2e] hidden sm:inline">MUSIC ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span className="text-[11px] font-bold font-mono tracking-wider text-slate-400 hidden sm:inline">MUTED</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom-Right "Toast the Star 🥂" Button */}
          <motion.button
            onClick={handleToastClink}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="fixed bottom-6 right-6 z-40 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-gradient-to-r from-[#d4af37] via-[#eed180] to-[#e8a598] text-[#1a1411] font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xl shadow-amber-950/25 flex items-center gap-2 cursor-pointer border border-[#ffffff]/90 backdrop-blur-md"
          >
            <Wine className="w-4 h-4 text-[#1a1411]" />
            <span className="hidden sm:inline">Toast the Birthday Star 🥂</span>
            <span className="sm:hidden">Toast 🥂</span>
          </motion.button>
        </>
      )}

      {/* 🍾 VIP OPENING PRELUDE (CHAMPAGNE POP TICKET) */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="vip-prelude"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, pointerEvents: "none" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#fffdf9]/95 backdrop-blur-xl"
          >
            {/* VIP Golden Hairline Framed Prelude Card */}
            <div className="w-full max-w-md p-8 sm:p-10 rounded-[38px] bg-white border-2 border-[#d4af37]/70 text-center space-y-6 relative overflow-hidden shadow-2xl shadow-amber-950/20 backdrop-blur-2xl">
              
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#d4af37] via-[#e8a598] to-[#eed180]" />
              <div className="absolute inset-3 rounded-[30px] border border-[#d4af37]/35 pointer-events-none" />

              {/* VIP Badge Header */}
              <div className="pt-2 flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#eed180]/40 to-[#fce7f3]/50 border border-[#d4af37]/60 flex items-center justify-center shadow-md">
                  <Cake className="w-7 h-7 text-[#8c6d1f]" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eed180]/25 border border-[#d4af37]/50 text-[10px] font-black uppercase tracking-[0.25em] text-[#8c6d1f]">
                  <Sparkles className="w-3 h-3 text-[#d4af37]" /> {ageMilestone}
                </div>
              </div>

              {/* Event Announcement */}
              <div className="space-y-1.5 px-2">
                <p className="text-xs text-[#8c6d1f] uppercase tracking-[0.25em] font-bold font-serif">
                  {party.hostNames ? `You're Invited by ${party.hostNames}` : "Save the Date • We Invite You to Celebrate"}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1a1411] tracking-tight font-serif italic drop-shadow-sm">
                  {eventTitle}
                </h1>
                <p className="text-xs text-[#6b4e2e] font-serif font-bold tracking-wider">
                  {formatDisplayDate(targetDateStr)} • {targetTimeStr}
                </p>
              </div>

              {/* Centerpiece "POP THE CHAMPAGNE" Interactive Button */}
              <div className="pt-2 flex justify-center">
                <motion.button
                  onClick={handleOpenInvitation}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#eed180] to-[#d4af37] hover:from-[#c29d2b] hover:to-[#e5c66d] text-[#1a1411] font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-amber-950/20 flex items-center justify-center gap-2.5 cursor-pointer transition-all border border-[#ffffff]/90"
                >
                  <PartyPopper className="w-5 h-5 text-[#1a1411]" />
                  <span>Pop the Champagne 🍾✨</span>
                </motion.button>
              </div>

              <div className="text-[11px] text-[#8c6d1f] font-mono">
                Tap to unseal the celebration invitation & start music
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 MAIN PARTY INVITATION SCROLLABLE EXPERIENCE */}
      <main className="max-w-3xl mx-auto px-3 sm:px-6 py-10 sm:py-16 space-y-10 sm:space-y-14 relative z-20 text-center">
        
        {/* 1. HERO BIRTHDAY EDITORIAL INVITATION CARD (EXACTLY LIKE YOUR SCREENSHOT!) */}
        <section className="relative rounded-[28px] sm:rounded-[36px] bg-white border-[1.5px] border-[#d4af37]/70 p-4 sm:p-8 shadow-2xl shadow-amber-950/10 overflow-visible">
          
          {/* 🎈 Top-Right 3D Metallic Balloons & Confetti Cluster */}
          <CornerBalloonsTopRight />

          {/* 🎈 Bottom-Left 3D Metallic Balloons & Confetti Cluster */}
          <CornerBalloonsBottomLeft />

          {/* Inner Golden Hairline Frame */}
          <div className="rounded-[20px] sm:rounded-[28px] border border-[#d4af37]/45 p-6 sm:p-14 relative space-y-6 overflow-hidden bg-[#fffdfa]/60">
            
            {/* Top Corner Filigree Accents */}
            <div className="absolute top-2.5 left-2.5 text-[#d4af37] text-xs select-none">❖</div>
            <div className="absolute top-2.5 right-2.5 text-[#d4af37] text-xs select-none">❖</div>
            <div className="absolute bottom-2.5 left-2.5 text-[#d4af37] text-xs select-none">❖</div>
            <div className="absolute bottom-2.5 right-2.5 text-[#d4af37] text-xs select-none">❖</div>

            {/* Top Tag: Save the Date */}
            <div className="space-y-1 pt-2">
              <span className="text-xs sm:text-sm font-serif font-bold uppercase tracking-[0.4em] text-[#3d2e1e] block">
                Save the Date
              </span>
              <p className="font-serif italic text-base sm:text-2xl text-[#6b4e2e]">
                we invite you to celebrate
              </p>
            </div>

            {/* Vintage Golden Divider */}
            <VintageGoldDivider className="my-2 sm:my-3" />

            {/* Centerpiece "happy BIRTHDAY" Typography */}
            <div className="space-y-1 py-1">
              <span className="text-2xl sm:text-4xl font-serif text-[#3d2e1e] tracking-[0.25em] lowercase block font-light">
                happy
              </span>
              <h1 className="text-4xl sm:text-7xl font-serif font-black tracking-[0.16em] text-[#1a1411] uppercase drop-shadow-sm">
                BIRTHDAY
              </h1>
              
              {/* Star Name with Royal Gold Gradient */}
              <div className="pt-2">
                <span className="text-3xl sm:text-5xl font-serif italic font-extrabold bg-gradient-to-r from-[#8c6d1f] via-[#d4af37] to-[#e8a598] bg-clip-text text-transparent drop-shadow-sm inline-block">
                  {birthdayName}
                </span>
              </div>
            </div>

            {/* Vintage Golden Divider */}
            <VintageGoldDivider className="my-2 sm:my-3" />

            {/* Prominent Formatted Date */}
            <div className="space-y-1.5 pb-2">
              <span className="text-base sm:text-2xl font-serif font-bold tracking-[0.3em] text-[#1a1411] block uppercase">
                {formatDisplayDate(targetDateStr)}
              </span>
              <span className="text-xs sm:text-sm font-sans font-bold text-[#8c6d1f] tracking-widest uppercase">
                {targetTimeStr}
              </span>
            </div>

            {/* Host Line & Tagline Capsule */}
            <div className="pt-2 space-y-2 max-w-md mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#eed180]/25 border border-[#d4af37]/50 text-[10px] sm:text-[11px] font-mono text-[#8c6d1f] uppercase tracking-[0.2em] font-extrabold shadow-sm">
                <Crown className="w-3.5 h-3.5 text-[#d4af37]" /> {ageMilestone}
              </div>
              {party.tagline && (
                <p className="text-xs sm:text-sm text-[#6b4e2e] italic font-serif leading-relaxed px-4">
                  "{party.tagline}"
                </p>
              )}
            </div>

          </div>
        </section>

        {/* 2. LIVE COUNTDOWN TICKER SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#8c6d1f]">
            <Clock className="w-4 h-4 text-[#d4af37]" />
            <span>Celebration Countdown</span>
          </div>

          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-lg mx-auto">
            {[
              { label: "DAYS", value: timeLeft.days },
              { label: "HOURS", value: timeLeft.hours },
              { label: "MINS", value: timeLeft.minutes },
              { label: "SECS", value: timeLeft.seconds },
            ].map((slot, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-5 rounded-2xl bg-white border border-[#d4af37]/50 shadow-xl shadow-amber-950/5 flex flex-col items-center justify-center space-y-1 backdrop-blur-md"
              >
                <span className="text-2xl sm:text-4xl font-black text-[#1a1411] font-mono tracking-tight">
                  {String(slot.value).padStart(2, "0")}
                </span>
                <span className="text-[9px] sm:text-[10px] font-extrabold text-[#8c6d1f] tracking-widest uppercase">
                  {slot.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. VENUE, ADDRESS & GOOGLE MAPS CARD */}
        <section className="rounded-[32px] bg-white border border-[#d4af37]/60 p-6 sm:p-10 shadow-xl shadow-amber-950/5 backdrop-blur-xl text-left space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#d4af37] via-[#e8a598] to-[#eed180]" />

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#8c6d1f] uppercase tracking-widest flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" /> Venue Location
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#1a1411] font-serif">
                {venueName}
              </h3>
              <p className="text-xs sm:text-sm text-[#6b4e2e] leading-relaxed max-w-md">
                {venueAddress}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#eed180]/25 border border-[#d4af37]/50 text-[#8c6d1f] flex-shrink-0">
              <Wine className="w-5 h-5" />
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={
                party.venueMapsUrl ||
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${venueName} ${venueAddress}`
                )}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#eed180] to-[#d4af37] hover:from-[#c29d2b] hover:to-[#e5c66d] text-[#1a1411] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer border border-[#ffffff]/90"
            >
              <Navigation className="w-3.5 h-3.5 fill-[#1a1411]" /> Open Google Maps Directions
            </a>

            <a
              href={getGoogleCalendarUrl("Birthday Party", targetTimeStr, venueName)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl border border-[#d4af37]/50 bg-white hover:bg-[#eed180]/15 text-[#8c6d1f] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-[#d4af37]" /> Add to Google Calendar
            </a>
          </div>
        </section>

        {/* 4. DRESS CODE & VIP GUEST NOTES CAPSULE */}
        {(party.dressCode || party.specialNotes) && (
          <section className={`grid ${party.dressCode && party.specialNotes ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 max-w-lg mx-auto"} gap-4 text-left`}>
            
            {/* Dress Code Capsule */}
            {party.dressCode && (
              <div className="p-6 rounded-3xl bg-white border border-[#d4af37]/50 shadow-lg shadow-amber-950/5 space-y-2 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-xs font-bold font-mono text-[#8c6d1f] uppercase tracking-wider">
                    Dress Code Theme
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#1a1411] font-serif">
                  {party.dressCode}
                </h4>
              </div>
            )}

            {/* VIP Rules & Special Notes */}
            {party.specialNotes && (
              <div className="p-6 rounded-3xl bg-white border border-[#e8a598]/60 shadow-lg shadow-amber-950/5 space-y-2 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-[#e8a598]" />
                  <span className="text-xs font-bold font-mono text-[#8c6d1f] uppercase tracking-wider">
                    VIP Guest Guidelines
                  </span>
                </div>
                <p className="text-xs text-[#6b4e2e] leading-relaxed font-medium">
                  {party.specialNotes}
                </p>
              </div>
            )}

          </section>
        )}

        {/* 5. CELEBRATION TIMELINE PROGRAM */}
        <section className="space-y-6 text-left">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8c6d1f]">
              Evening Schedule
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#1a1411] font-serif">
              Celebration Highlights ✨
            </h3>
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            {itinerary.map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[#d4af37]/45 shadow-md hover:border-[#d4af37] transition-all flex items-start gap-4 backdrop-blur-md"
              >
                <div className="w-10 h-10 rounded-xl bg-[#eed180]/25 border border-[#d4af37]/45 flex items-center justify-center text-lg flex-shrink-0">
                  {item.icon || "✨"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-[#1a1411] font-serif truncate">
                      {item.title}
                    </h4>
                    <span className="text-xs font-mono font-bold text-[#8c6d1f] flex-shrink-0 bg-[#eed180]/20 px-2 py-0.5 rounded-md border border-[#d4af37]/35">
                      {item.time}
                    </span>
                  </div>
                  {item.desc && (
                    <p className="text-xs text-[#6b4e2e] leading-relaxed mt-1">
                      {item.desc}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. LIVE RSVP HUB WITH DJ SONG REQUEST BOX */}
        <section className="rounded-[32px] sm:rounded-[40px] bg-white border-2 border-[#d4af37]/70 p-6 sm:p-12 shadow-2xl shadow-amber-950/10 backdrop-blur-2xl text-left space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#d4af37] via-[#eed180] to-[#e8a598]" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4af37]/30 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#8c6d1f] uppercase tracking-widest flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#d4af37]" /> Live Guest Confirmation
              </span>
              <h3 className="text-2xl font-black text-[#1a1411] font-serif">
                Will You Be Joining Us? 🥂
              </h3>
            </div>
            
            <div className="px-3.5 py-1.5 rounded-full bg-[#eed180]/25 border border-[#d4af37]/50 text-xs font-mono font-bold text-[#8c6d1f] self-start sm:self-auto flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{totalHeadcount} Guests Confirmed</span>
            </div>
          </div>

          {rsvpSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-[#eed180]/20 border border-[#d4af37]/60 text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-[#d4af37]/25 border border-[#d4af37]/50 flex items-center justify-center mx-auto text-[#8c6d1f]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[#1a1411] font-serif">
                RSVP Received! We Can't Wait to Celebrate! 🎉
              </h4>
              <p className="text-xs text-[#6b4e2e] max-w-sm mx-auto">
                Thank you, <strong>{guestName}</strong>. Your confirmation and party vibes have been logged for {birthdayName}'s birthday celebration!
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-4">
              
              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1a1411] uppercase tracking-wider">Your Full Name(s)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma / Sanya & Aryan"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#fffdf9] border border-[#d4af37]/50 focus:border-[#d4af37] outline-none text-[#1a1411] text-xs placeholder:text-zinc-400 transition-colors shadow-sm"
                />
              </div>

              {/* Attendance Toggle & Headcount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1a1411] uppercase tracking-wider">Attendance</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAttendance("attending")}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                        attendance === "attending"
                          ? "bg-[#eed180]/30 border-[#d4af37] text-[#8c6d1f] shadow-sm font-black"
                          : "bg-[#fffdf9] border-zinc-200 text-slate-500 hover:bg-zinc-50"
                      }`}
                    >
                      ✓ Attending
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendance("declined")}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                        attendance === "declined"
                          ? "bg-red-50 border-red-300 text-red-600 shadow-sm font-black"
                          : "bg-[#fffdf9] border-zinc-200 text-slate-500 hover:bg-zinc-50"
                      }`}
                    >
                      ✕ Regretfully Decline
                    </button>
                  </div>
                </div>

                {attendance === "attending" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1a1411] uppercase tracking-wider">Total Headcount</label>
                    <select
                      value={headcount}
                      onChange={(e) => setHeadcount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#fffdf9] border border-[#d4af37]/50 focus:border-[#d4af37] outline-none text-[#1a1411] text-xs shadow-sm"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Guest (Just Me)" : `Guests (${num} People)`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* DJ Song Request Box (if enabled) */}
              {(party.allowDjRequests ?? true) && attendance === "attending" && (
                <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#eed180]/20 border border-[#d4af37]/45">
                  <label className="text-xs font-bold text-[#8c6d1f] uppercase tracking-wider flex items-center gap-1.5">
                    <Disc className="w-4 h-4 text-[#d4af37]" /> Nominate a Song for the DJ Playlist 🎧
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Blinding Lights - The Weeknd / Levitating"
                    value={djSong}
                    onChange={(e) => setDjSong(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#d4af37]/40 focus:border-[#d4af37] outline-none text-[#1a1411] text-xs placeholder:text-zinc-400 shadow-sm"
                  />
                </div>
              )}

              {/* Personal Birthday Wish Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1a1411] uppercase tracking-wider">Birthday Wish / Note to the Star (Optional)</label>
                <textarea
                  rows={2}
                  placeholder={`Write a sweet birthday wish for ${birthdayName}...`}
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fffdf9] border border-[#d4af37]/50 focus:border-[#d4af37] outline-none text-[#1a1411] text-xs placeholder:text-zinc-400 shadow-sm resize-none"
                />
              </div>

              {/* Submit RSVP Button */}
              <button
                type="submit"
                disabled={rsvpLoading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#eed180] to-[#d4af37] hover:from-[#c29d2b] hover:to-[#e5c66d] text-[#1a1411] font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-amber-950/15 flex items-center justify-center gap-2 cursor-pointer transition-all border border-[#ffffff]/90 disabled:opacity-50"
              >
                {rsvpLoading ? (
                  <span>Recording Your RSVP...</span>
                ) : (
                  <>
                    <PartyPopper className="w-4 h-4 text-[#1a1411]" />
                    <span>Confirm My Attendance 🥂</span>
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        {/* 7. WE CAN'T WAIT TO CELEBRATE WITH YOU (BIRTHDAY FINALE CARD) */}
        <section className="p-6 sm:p-11 rounded-[32px] sm:rounded-[38px] bg-gradient-to-b from-[#fffcf7]/95 via-[#fff8ef]/95 to-[#faeedf]/95 border-2 border-[#d4af37]/50 shadow-[0_20px_60px_rgba(212,175,55,0.18)] backdrop-blur-xl space-y-6 text-center font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
          
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-xs font-['Cinzel_Decorative',serif] text-[#8c6d1f] uppercase tracking-[0.25em] font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> With Joy &amp; Excitement
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2a1b14] font-['Playfair_Display',Georgia,serif] italic leading-tight">
              We Can&apos;t Wait to Celebrate With You! 🎂✨
            </h2>
            <p className="text-xs sm:text-base text-[#6b4c2a] font-serif italic leading-relaxed">
              &ldquo;Your presence, smiles, and positive energy are what make this milestone truly unforgettable. Get ready for an evening of fabulous music, toasts, laughter, and great memories!&rdquo;
            </p>
          </div>

          {/* Ornamental Divider */}
          <div className="flex items-center justify-center gap-3 my-3">
            <div className="h-[1px] flex-1 max-w-[120px] bg-gradient-to-r from-transparent via-[#d4af37]/40 to-[#d4af37]/70" />
            <span className="text-xs text-[#d4af37]">✦ 🥂 ✦</span>
            <div className="h-[1px] flex-1 max-w-[120px] bg-gradient-to-l from-transparent via-[#d4af37]/40 to-[#d4af37]/70" />
          </div>

          {/* Birthday Star Sign-off */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8c6d1f] block font-sans">
              Eagerly Counting Down to Party With You
            </span>
            <p className="text-2xl sm:text-3xl font-bold font-['Playfair_Display',Georgia,serif] text-transparent bg-clip-text bg-gradient-to-r from-[#925f18] via-[#d4af37] to-[#78350f] drop-shadow-sm">
              {birthdayName}
            </p>
            {party.hostNames && party.hostNames !== birthdayName && (
              <p className="text-xs font-serif text-[#78350f]/80 italic">
                Hosted with love by {party.hostNames}
              </p>
            )}
            <div className="inline-block pt-1">
              <span className="px-4 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-xs font-mono font-bold text-[#8c6d1f] tracking-wider shadow-sm">
                🎉 {ageMilestone} • {eventTitle}
              </span>
            </div>
          </div>

        </section>

        {/* 8. SHARE & FOOTER */}
        <footer className="pt-6 pb-12 text-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/60 hover:bg-[#d4af37]/25 text-[#78350f] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              <QrCode className="w-4 h-4 text-[#d4af37]" /> Scan & Download QR Card
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366]/10 border border-[#25D366]/40 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              <Share2 className="w-4 h-4 text-[#25D366]" /> Share Invitation on WhatsApp
            </button>
          </div>

          <div className="text-[11px] text-[#8c6d1f] font-serif italic">
            Sealed with Love & Elegance • SealedVibe Keepsakes ✨
          </div>
        </footer>

      </main>

      {/* 📱 Themed QR Code & Printable Card Modal */}
      <QRCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        type="birthday_party"
        names={birthdayName}
        title={eventTitle}
        date={targetDateStr}
        time={targetTimeStr}
        venue={venueName}
        url={typeof window !== "undefined" ? `${window.location.origin}/p/${data.slug}` : `https://www.sealedvibe.in/p/${data.slug}`}
      />
    </div>
  );
}
