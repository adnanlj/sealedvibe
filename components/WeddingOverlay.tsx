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
  Crown,
  Heart,
  Clock,
  MapPin,
  CalendarPlus,
  Flower2,
  QrCode
} from "lucide-react";
import QRCodeModal from "./QRCodeModal";

interface WeddingOverlayProps {
  data: {
    slug: string;
    creatorName: string;
    recipientName?: string;
    youtubeUrl?: string;
    songName?: string;
    weddingData?: {
      coupleNames?: string;
      groomName?: string;
      brideName?: string;
      hashtag?: string;
      invitationType?: string;
      weddingDate?: string;
      weddingTime?: string;
      venueName?: string;
      venueAddress?: string;
      venueMapsUrl?: string;
      itinerary?: Array<{
        title: string;
        date: string;
        time: string;
        desc?: string;
        icon?: string;
      }>;
      monogram?: string;
      hostNames?: string;
      groomBio?: string;
      brideBio?: string;
      guestRsvps?: Array<{
        name: string;
        attendance: string;
        headcount: number;
        message?: string;
        submittedAt: Date;
      }>;
    };
  };
}

// Web Audio API Engine for Authentic Royal Indian Wedding Shehnai & Sitar Harmony
class RomanticWeddingAudioEngine {
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
      this.playTanpuraDrone();
      this.scheduleWeddingMelody();
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

  playChime() {
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.04, this.ctx!.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + idx * 0.08 + 1.2);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + idx * 0.08);
        osc.stop(this.ctx!.currentTime + idx * 0.08 + 1.3);
      });
    } catch (e) {}
  }

  private playTanpuraDrone() {
    if (!this.ctx || !this.isPlaying) return;
    const baseFreqs = [103.83, 138.59, 138.59, 277.18];
    
    baseFreqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? "sawtooth" : "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
    });
  }

  private scheduleWeddingMelody() {
    const ragaNotes = [277.18, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25, 554.37];
    const sequence = [0, 2, 3, 4, 3, 2, 0, 4, 5, 7, 6, 5, 4, 3, 4, 2, 0];
    let step = 0;

    this.timer = setInterval(() => {
      if (!this.ctx || !this.isPlaying) return;
      const freq = ragaNotes[sequence[step % sequence.length]];
      step++;
      this.pluckSitarShehnaiNote(freq);
    }, 700);
  }

  private pluckSitarShehnaiNote(freq: number) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq * 2, this.ctx.currentTime);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(freq * 1.5, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.5, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 1.9);
      osc2.stop(now + 1.9);
    } catch (e) {}
  }
}

const formatWeddingDate = (dateStr: string, includeDayName = false) => {
  try {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const clean = dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`;
    const d = new Date(clean);
    if (!isNaN(d.getTime())) {
      const month = months[d.getMonth()];
      const day = d.getDate();
      const year = d.getFullYear();
      const dayName = days[d.getDay()];
      if (includeDayName) {
        return `${dayName}, ${month} ${day}, ${year}`;
      }
      return `${month} ${day}, ${year}`;
    }
  } catch (e) {}
  return dateStr;
};

// 👑 Ornamental Gold Divider with Central Emblem
const RoyalGoldDivider = ({ label }: { label?: string }) => (
  <div className="flex items-center justify-center gap-3 my-6">
    <div className="h-[1px] flex-1 max-w-[140px] bg-gradient-to-r from-transparent via-[#ffd700]/70 to-[#d4af37]" />
    <div className="flex items-center gap-2 text-[#ffd700]">
      <span className="text-xs text-amber-300 drop-shadow-[0_0_4px_rgba(255,215,0,0.6)]">✦</span>
      {label ? (
        <span className="text-[11px] font-['Cinzel_Decorative','Cormorant_Garamond',serif] uppercase tracking-[0.25em] text-[#fff5d6] px-1 font-bold drop-shadow-sm">
          {label}
        </span>
      ) : (
        <Crown className="w-4 h-4 text-[#ffd700] drop-shadow-[0_0_6px_rgba(255,215,0,0.6)]" />
      )}
      <span className="text-xs text-amber-300 drop-shadow-[0_0_4px_rgba(255,215,0,0.6)]">✦</span>
    </div>
    <div className="h-[1px] flex-1 max-w-[140px] bg-gradient-to-l from-transparent via-[#ffd700]/70 to-[#d4af37]" />
  </div>
);

// 🏛️ Palace Arch Outline SVG Motif
const PalaceArchMotif = () => (
  <svg width="70" height="28" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#ffd700] drop-shadow-[0_0_8px_rgba(255,215,0,0.5)] mx-auto mb-1">
    <path d="M 0,40 C 25,40 35,5 50,0 C 65,5 75,40 100,40" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <circle cx="50" cy="12" r="3" fill="currentColor" />
  </svg>
);

// 🎧 Tactical Scratch Audio Synthesizer (Realistic coin scraping on metallic foil)
class RealisticScratchAudioEngine {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private lastSoundTime = 0;

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    if (!this.noiseBuffer && this.ctx) {
      const bufferSize = this.ctx.sampleRate * 1.0;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.025 * white) / 1.025;
        lastOut = data[i];
        data[i] *= 3.8;
      }
      this.noiseBuffer = buffer;
    }
  }

  playScrapeFriction() {
    const now = Date.now();
    if (now - this.lastSoundTime < 38) return;
    this.lastSoundTime = now;

    try {
      this.initContext();
      if (!this.ctx || !this.noiseBuffer) return;

      const source = this.ctx.createBufferSource();
      source.buffer = this.noiseBuffer;
      source.loop = true;

      // Realistic metallic foil bandpass filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2600 + (Math.random() * 600 - 300), this.ctx.currentTime);
      filter.Q.setValueAtTime(3.2, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      const currTime = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.08, currTime);
      gain.gain.exponentialRampToValueAtTime(0.001, currTime + 0.065);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      source.start(currTime);
      source.stop(currTime + 0.075);
    } catch (e) {}
  }
}

// 🪙 Interactive Royal Gold Foil Scratch Card with Ultra-Realistic Physics & Tactile Feel
const RoyalCountdownScratchCard = ({
  timeLeft,
  onRevealed
}: {
  timeLeft: { days: number; hours: number; minutes: number; seconds: number };
  onRevealed?: () => void;
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [coinPos, setCoinPos] = useState<{ x: number; y: number; isDown: boolean } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const strokeCountRef = useRef(0);
  const soundEngineRef = useRef<RealisticScratchAudioEngine | null>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    rot: number;
    vRot: number;
    size: number;
    color: string;
    opacity: number;
    life: number;
  }>>([]);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    soundEngineRef.current = new RealisticScratchAudioEngine();
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, []);

  // Initialize Particle Loop for Flying Gold Foil Shavings
  useEffect(() => {
    if (isRevealed) return;

    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (particlesRef.current.length > 0) {
        const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

        particlesRef.current.forEach((p, idx) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35; // Gravity
          p.vx *= 0.96; // Air resistance
          p.rot += p.vRot;
          p.life -= 0.035;
          p.opacity = Math.max(0, p.life);

          if (p.opacity > 0) {
            ctx.save();
            ctx.translate(p.x * dpr, p.y * dpr);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.shadowColor = "#ffd700";
            ctx.shadowBlur = 4;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
            ctx.restore();
          }
        });

        particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      }

      animFrameIdRef.current = requestAnimationFrame(renderParticles);
    };

    animFrameIdRef.current = requestAnimationFrame(renderParticles);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isRevealed]);

  const spawnFoilShavings = (x: number, y: number, count = 5) => {
    const colors = ["#ffd700", "#ffea75", "#e7ce6d", "#d4af37", "#ffffff", "#b89225"];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      particlesRef.current.push({
        x: x + (Math.random() * 8 - 4),
        y: y + (Math.random() * 8 - 4),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (1.5 + Math.random() * 2),
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.35,
        size: 3 + Math.random() * 4.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        life: 1.0,
      });
    }
  };

  const initFoilCanvas = () => {
    const canvas = canvasRef.current;
    const particleCanvas = particleCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    
    // Main Foil Canvas
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Particle Canvas
    if (particleCanvas) {
      particleCanvas.width = rect.width * dpr;
      particleCanvas.height = rect.height * dpr;
      particleCanvas.style.width = `${rect.width}px`;
      particleCanvas.style.height = `${rect.height}px`;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // 24K Multi-Stop Metallic Gold Foil Gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#c99a2c");
    grad.addColorStop(0.18, "#ffd700");
    grad.addColorStop(0.38, "#fff3b3");
    grad.addColorStop(0.55, "#e5a922");
    grad.addColorStop(0.72, "#ffd700");
    grad.addColorStop(0.88, "#c99a2c");
    grad.addColorStop(1, "#8a5808");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 20);
    ctx.fill();

    // Realistic brushed metal / guilloche micro-lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 1;
    for (let i = -w; i < w * 2; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h * 0.45, h);
      ctx.stroke();
    }

    // Holographic Diagonal Light Sheen Bars
    ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
    for (let i = -w; i < w * 2; i += 45) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 24, 0);
      ctx.lineTo(i - 30, h);
      ctx.lineTo(i - 54, h);
      ctx.closePath();
      ctx.fill();
    }

    // Gilded Embossed Double Border
    ctx.strokeStyle = "rgba(35, 4, 10, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 3]);
    ctx.beginPath();
    ctx.roundRect(8, 8, w - 16, h - 16, 14);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(11, 11, w - 22, h - 22, 12);
    ctx.stroke();

    // Royal Crown Symbol with Embossed Gold Shadow
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "bold 24px 'Cinzel Decorative', Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("👑", w / 2, h / 2 - 27);

    ctx.fillStyle = "#26040c";
    ctx.fillText("👑", w / 2, h / 2 - 28);

    // Headline with Embossed Effect
    ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillText("SCRATCH TO REVEAL", w / 2, h / 2 - 1);

    ctx.fillStyle = "#26040c";
    ctx.fillText("SCRATCH TO REVEAL", w / 2, h / 2 - 2);

    // Subtitle
    ctx.font = "italic 11px 'Cormorant Garamond', Georgia, serif";
    ctx.fillStyle = "#450a14";
    ctx.fillText("Rub with your gold coin to scratch & uncover the royal countdown ✨", w / 2, h / 2 + 18);

    // Coin Instruction Badge
    ctx.font = "bold 10px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#5c0d1b";
    ctx.fillText("🪙 Scratch across the boxes to reveal", w / 2, h / 2 + 36);
  };

  useEffect(() => {
    if (!isRevealed) {
      initFoilCanvas();
      const handleResize = () => {
        if (!isRevealed) initFoilCanvas();
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isRevealed]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setCoinPos({ x, y, isDown: true });

    // Play tactile coin friction scraping audio
    if (soundEngineRef.current) {
      soundEngineRef.current.playScrapeFriction();
    }

    // Haptic feedback for tactile realism on mobile
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try { navigator.vibrate(6); } catch (e) {}
    }

    // Emit flying gold foil flakes from under the coin
    spawnFoilShavings(x, y, 3);

    ctx.globalCompositeOperation = "destination-out";

    // Fine, authentic coin-edge scrape width (8px radius = 16px precise coin contact line)
    const brushRadius = 8;

    // Helper to draw a soft feathered scrape stamp for organic blending
    const drawSoftScrapeStamp = (cx: number, cy: number, radius: number) => {
      const radGrad = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius);
      radGrad.addColorStop(0, "rgba(0, 0, 0, 1)");
      radGrad.addColorStop(0.55, "rgba(0, 0, 0, 0.88)");
      radGrad.addColorStop(0.8, "rgba(0, 0, 0, 0.45)");
      radGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    // Realistic Rough / Gritty Scraping Texture with Soft Edge Blending
    if (lastPointRef.current) {
      const dist = Math.hypot(x - lastPointRef.current.x, y - lastPointRef.current.y);
      const steps = Math.max(1, Math.floor(dist / 2));

      for (let s = 0; s <= steps; s++) {
        const interpX = lastPointRef.current.x + (x - lastPointRef.current.x) * (s / steps);
        const interpY = lastPointRef.current.y + (y - lastPointRef.current.y) * (s / steps);

        drawSoftScrapeStamp(interpX, interpY, brushRadius);

        // Add micro-dabs for authentic jagged foil tear and feathered edge wear
        if (Math.random() < 0.35) {
          const angle = Math.random() * Math.PI * 2;
          const r = brushRadius * 0.65 + Math.random() * 2.5;
          drawSoftScrapeStamp(interpX + Math.cos(angle) * r, interpY + Math.sin(angle) * r, brushRadius * 0.5);
        }
      }
    } else {
      drawSoftScrapeStamp(x, y, brushRadius);
    }

    lastPointRef.current = { x, y };
    strokeCountRef.current += 1;

    if (strokeCountRef.current % 6 === 0) {
      checkScratchPercentage();
    }
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const w = Math.floor(canvas.width);
      const h = Math.floor(canvas.height);
      const sampleGap = 12;
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      let transparentPoints = 0;
      let totalSamples = 0;

      for (let y = 0; y < h; y += sampleGap) {
        for (let x = 0; x < w; x += sampleGap) {
          totalSamples++;
          const alphaIndex = (y * w + x) * 4 + 3;
          if (data[alphaIndex] < 128) {
            transparentPoints++;
          }
        }
      }

      const percent = totalSamples > 0 ? Math.round((transparentPoints / totalSamples) * 100) : 0;
      setScratchProgress(percent);

      // Balanced reveal threshold (58%) tailored for precise 8px coin scratching
      if (percent >= 58) {
        triggerReveal();
      }
    } catch (e) {}
  };

  const triggerReveal = () => {
    if (isRevealed) return;
    setIsRevealed(true);
    setCoinPos(null);
    if (onRevealed) onRevealed();
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Underlying Glowing Countdown Clock */}
      <div
        ref={containerRef}
        className="relative rounded-2xl p-1 bg-gradient-to-b from-[#2a050e] to-[#120204] border border-[#ffd700]/50 shadow-inner"
      >
        <div className="grid grid-cols-4 gap-2 sm:gap-3.5 p-3 sm:p-4 font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-[#180206] to-[#0c0103] border border-[#ffd700]/60 text-center shadow-lg flex flex-col items-center justify-center min-w-0 group hover:border-[#ffd700] transition-colors">
            <span className="text-2xl sm:text-3xl font-bold text-[#ffd700] block font-['Cormorant_Garamond',Georgia,serif] leading-tight tabular-nums drop-shadow-md">
              {timeLeft.days}
            </span>
            <span className="text-[8px] sm:text-[9px] text-[#ffd700] uppercase tracking-widest font-extrabold mt-1">Days</span>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-[#180206] to-[#0c0103] border border-[#ffd700]/60 text-center shadow-lg flex flex-col items-center justify-center min-w-0 group hover:border-[#ffd700] transition-colors">
            <span className="text-2xl sm:text-3xl font-bold text-[#ffd700] block font-['Cormorant_Garamond',Georgia,serif] leading-tight tabular-nums drop-shadow-md">
              {timeLeft.hours}
            </span>
            <span className="text-[8px] sm:text-[9px] text-[#ffd700] uppercase tracking-widest font-extrabold mt-1">Hours</span>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-[#180206] to-[#0c0103] border border-[#ffd700]/60 text-center shadow-lg flex flex-col items-center justify-center min-w-0 group hover:border-[#ffd700] transition-colors">
            <span className="text-2xl sm:text-3xl font-bold text-[#ffd700] block font-['Cormorant_Garamond',Georgia,serif] leading-tight tabular-nums drop-shadow-md">
              {timeLeft.minutes}
            </span>
            <span className="text-[8px] sm:text-[9px] text-[#ffd700] uppercase tracking-widest font-extrabold mt-1">Mins</span>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-[#180206] to-[#0c0103] border border-[#ffd700]/60 text-center shadow-lg flex flex-col items-center justify-center min-w-0 group hover:border-[#ffd700] transition-colors">
            <span className="text-2xl sm:text-3xl font-bold text-[#ffd700] block font-['Cormorant_Garamond',Georgia,serif] leading-tight tabular-nums drop-shadow-md">
              {timeLeft.seconds}
            </span>
            <span className="text-[8px] sm:text-[9px] text-[#ffd700] uppercase tracking-widest font-extrabold mt-1">Secs</span>
          </div>
        </div>

        {/* Scratch Foil Canvas Layer with Particle Physics & 3D Coin Scraper */}
        <AnimatePresence>
          {!isRevealed && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.04, filter: "blur(4px)" }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="absolute inset-0 z-20 rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(255,215,0,0.4)] cursor-none touch-none select-none"
            >
              {/* Foil Scratch Layer */}
              <canvas
                ref={canvasRef}
                className="w-full h-full block rounded-2xl touch-none"
                onPointerDown={(e) => {
                  isDrawingRef.current = true;
                  (e.target as HTMLElement).setPointerCapture(e.pointerId);
                  scratch(e.clientX, e.clientY);
                }}
                onPointerMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  setCoinPos({ x, y, isDown: isDrawingRef.current });

                  if (isDrawingRef.current) {
                    scratch(e.clientX, e.clientY);
                  }
                }}
                onPointerLeave={() => {
                  if (!isDrawingRef.current) setCoinPos(null);
                }}
                onPointerUp={(e) => {
                  isDrawingRef.current = false;
                  lastPointRef.current = null;
                  if (coinPos) setCoinPos({ ...coinPos, isDown: false });
                  try {
                    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
                  } catch (err) {}
                  checkScratchPercentage();
                }}
                onPointerCancel={() => {
                  isDrawingRef.current = false;
                  lastPointRef.current = null;
                  setCoinPos(null);
                }}
              />

              {/* Real-time Flying Foil Particles Shavings Canvas */}
              <canvas
                ref={particleCanvasRef}
                className="absolute inset-0 pointer-events-none z-25"
              />

              {/* 🪙 Realistic 3D Royal Gold Coin Stylus Indicator */}
              {coinPos && (
                <div
                  className="absolute pointer-events-none z-30 transition-transform duration-75 ease-out"
                  style={{
                    left: `${coinPos.x}px`,
                    top: `${coinPos.y}px`,
                    transform: `translate(-50%, -50%) rotate(${coinPos.isDown ? "-22deg" : "-10deg"}) scale(${coinPos.isDown ? 0.95 : 1.08})`,
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fff5d6] via-[#ffd700] to-[#996515] border-2 border-[#fff5d6] shadow-[0_6px_20px_rgba(0,0,0,0.6),0_0_15px_rgba(255,215,0,0.8)] flex items-center justify-center relative group">
                    <div className="absolute inset-0.5 rounded-full border border-black/30" />
                    <span className="text-xs font-black text-[#26040c] drop-shadow-sm font-['Cinzel_Decorative',serif]">⚜</span>
                    {/* Metallic edge sheen */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/30 to-transparent" />
                  </div>
                </div>
              )}

              {/* Quick Reveal Button */}
              <button
                type="button"
                onClick={triggerReveal}
                className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-full bg-[#180206]/90 border border-[#ffd700] text-[#ffd700] text-[9px] font-black uppercase tracking-wider shadow-[0_4px_15px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md z-35"
              >
                Reveal ✨
              </button>

              {/* Progress Indicator with Excitement & Suspense Building */}
              {scratchProgress > 0 && (
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#180206]/90 text-[#ffd700] text-[9px] font-bold border border-[#ffd700]/70 tracking-wider shadow-xl pointer-events-none backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap">
                  <span className="font-mono text-[#fff5d6]">{scratchProgress}%</span>
                  <span className="text-amber-400/60">•</span>
                  <span>
                    {scratchProgress < 30
                      ? "Scratch to uncover digits..."
                      : scratchProgress < 55
                      ? "Celebration moments appearing! ✨"
                      : "Almost revealed! Keep rubbing! 🔥"}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Auspicious Celebration Badge Once Revealed */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#ffd700]/15 border border-[#ffd700]/60 text-[10px] font-bold text-[#ffd700] font-['Plus_Jakarta_Sans',sans-serif] uppercase tracking-wider shadow-sm"
        >
          <span>✨</span> The Royal Celebration Unlocked <span>✨</span>
        </motion.div>
      )}
    </div>
  );
};

export default function WeddingOverlay({ data }: WeddingOverlayProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const audioEngineRef = useRef<RomanticWeddingAudioEngine | null>(null);
  const youtubePlayerRef = useRef<any>(null);

  // RSVP Form State
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState<"attending" | "declined">("attending");
  const [headcount, setHeadcount] = useState(2);
  const [message, setMessage] = useState("");
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [totalHeadcount, setTotalHeadcount] = useState<number | null>(null);

  const wedding = data.weddingData || {};
  const coupleNames = wedding.coupleNames || (wedding.groomName && wedding.brideName ? `${wedding.groomName} & ${wedding.brideName}` : (data.creatorName ? `${data.creatorName} & Partner` : "Groom & Bride"));
  const namesArray = coupleNames.includes("&") ? coupleNames.split("&").map(n => n.trim()) : [coupleNames, "Partner"];
  const groomName = wedding.groomName || namesArray[0] || (data.creatorName || "Groom");
  const brideName = wedding.brideName || namesArray[1] || "Bride";
  const monogram = wedding.monogram || coupleNames.split("&").map(n => n.trim()[0]).filter(Boolean).join(" & ") || (groomName[0] && brideName[0] ? `${groomName[0]} & ${brideName[0]}` : "G & B");
  const hashtag = wedding.hashtag || `#${groomName.replace(/\s+/g, "")}Weds${brideName.replace(/\s+/g, "")}`;
  const targetDateStr = wedding.weddingDate || "2035-12-18";
  const songTitle = data.songName || "Royal Wedding Celebration Song";

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const isOpenedRef = useRef(false);
  useEffect(() => {
    isOpenedRef.current = isOpened;
  }, [isOpened]);

  // YouTube Player Initializer
  useEffect(() => {
    const extractId = (url?: string) => {
      if (!url || !url.trim()) return "";
      const cleanUrl = url.trim();
      if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) return cleanUrl;
      const regExp = /(?:https?:\/\/)?(?:www\.|m\.|music\.)?(?:youtube(?:-nocookie)?\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
      const match = cleanUrl.match(regExp);
      if (match && match[1]) return match[1];
      const fallbackMatch = cleanUrl.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:[&\?\/#]|$)/);
      return fallbackMatch ? fallbackMatch[1] : "";
    };

    const videoId = extractId(data.youtubeUrl);
    if (!videoId) return;

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
            youtubePlayerRef.current = new (window as any).YT.Player("wedding-yt-audio", {
              height: "200",
              width: "200",
              videoId: videoId,
              playerVars: {
                autoplay: 0,
                controls: 0,
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
                    if (isOpenedRef.current) {
                      event.target.unMute();
                      event.target.playVideo();
                      if (audioEngineRef.current) {
                        audioEngineRef.current.stop();
                      }
                      setIsPlayingMusic(true);
                    }
                  } catch (e) {}
                },
                onStateChange: (event: any) => {
                  if (event.data === 1) {
                    if (audioEngineRef.current) {
                      audioEngineRef.current.stop();
                    }
                    setIsPlayingMusic(true);
                  }
                },
                onError: () => {
                  console.log("YouTube track error, playing wedding shehnai theme");
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

  useEffect(() => {
    audioEngineRef.current = new RomanticWeddingAudioEngine();
    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const difference = target - now;

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
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  // Floating Hearts & Rose Petals Canvas Simulation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

    const itemsCount = 42;
    const items: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      color: string;
      opacity: number;
      isHeart: boolean;
    }> = [];

    const heartColors = ["#f43f5e", "#fb7185", "#d4af37", "#fca5a5", "#ffd700", "#e7ce6d"];

    for (let i = 0; i < itemsCount; i++) {
      items.push({
        x: Math.random() * width,
        y: Math.random() * height + height * 0.2,
        size: Math.random() * 14 + 8,
        speedX: Math.random() * 1.2 - 0.6,
        speedY: -(Math.random() * 1.1 + 0.6),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.2,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        opacity: Math.random() * 0.5 + 0.35,
        isHeart: i % 2 === 0,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      items.forEach((p) => {
        p.x += p.speedX + Math.sin(p.y * 0.005) * 0.45;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.isHeart) {
          const s = p.size * 0.5;
          ctx.beginPath();
          ctx.moveTo(0, s * 0.3);
          ctx.bezierCurveTo(-s * 0.6, -s * 0.5, -s * 1.2, s * 0.4, 0, s * 1.2);
          ctx.bezierCurveTo(s * 1.2, s * 0.4, s * 0.6, -s * 0.5, 0, s * 0.3);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.85, p.size * 0.45, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        }

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
      if (audioEngineRef.current) {
        audioEngineRef.current.start();
      }
    }

    try {
      confetti({
        particleCount: 220,
        spread: 110,
        origin: { y: 0.55 },
        colors: ["#ffd700", "#f59e0b", "#f43f5e", "#fb7185", "#e7ce6d", "#ffffff"],
      });
    } catch (e) {}
  };

  // 🌸 Interactive "Shower Rose Petals" Handler
  const handleShowerPetals = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.playChime();
    }
    try {
      confetti({
        particleCount: 85,
        spread: 85,
        origin: { y: 0.8 },
        colors: ["#e11d48", "#f43f5e", "#ffd700", "#d4af37", "#fecdd3"],
        shapes: ["circle"],
        scalar: 1.25
      });
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#ffd700", "#e7ce6d", "#b89225", "#ffffff"],
        shapes: ["star"],
        scalar: 1.0
      });
    } catch (e) {}
  };

  // 🪙 Auspicious Countdown Scratch Card Reveal Handler
  const handleCountdownScratchReveal = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.playChime();
    }
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#ffd700", "#f59e0b", "#fff5d6", "#e11d48", "#ffffff"],
      });
    } catch (e) {}
  };

  const toggleMusic = () => {
    if (isPlayingMusic) {
      if (youtubePlayerRef.current && typeof youtubePlayerRef.current.pauseVideo === "function") {
        try { youtubePlayerRef.current.pauseVideo(); } catch (e) {}
      }
      if (audioEngineRef.current) audioEngineRef.current.stop();
      setIsPlayingMusic(false);
    } else {
      if (youtubePlayerRef.current && typeof youtubePlayerRef.current.playVideo === "function") {
        try { 
          youtubePlayerRef.current.unMute();
          youtubePlayerRef.current.playVideo(); 
        } catch (e) {}
      } else if (audioEngineRef.current) {
        audioEngineRef.current.start();
      }
      setIsPlayingMusic(true);
    }
  };

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
          headcount: attendance === "attending" ? headcount : 0,
          message: message.trim(),
        }),
      });

      const resData = await res.json();
      if (res.ok) {
        setRsvpSubmitted(true);
        if (resData.totalAttending) {
          setTotalHeadcount(resData.totalAttending);
        }
        confetti({
          particleCount: 220,
          spread: 95,
          origin: { y: 0.65 },
          colors: ["#ffd700", "#f43f5e", "#fb7185", "#10b981", "#d4af37"],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `💍 Royal Wedding Invitation\n\nYou are cordially invited to celebrate the royal wedding of ${coupleNames}!\n\n✨ Date: ${formatWeddingDate(targetDateStr)}\n📍 Venue: ${wedding.venueName || "The Royal Grand Palace"}\n\nView our wedding website & RSVP here:\n${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  // Helper to generate Google Calendar Link with smart universal date/time parsing
  const getGoogleCalendarUrl = (title: string, dateStr: string, timeStr: string, venue: string) => {
    try {
      const eventTitle = encodeURIComponent(`${title} - ${coupleNames}`);
      const details = encodeURIComponent(`Royal Wedding Celebration of ${coupleNames}.\nVenue: ${venue}`);
      const location = encodeURIComponent(venue || "The Royal Grand Palace Ballroom");
      
      let dateParam = "";
      try {
        const cleanDate = dateStr.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s*/i, "").trim();
        const fullDateStr = timeStr ? `${cleanDate} ${timeStr}` : cleanDate;
        const parsed = new Date(fullDateStr);
        
        if (!isNaN(parsed.getTime())) {
          const startISO = parsed.toISOString().replace(/-|:|\.\d+/g, "");
          const end = new Date(parsed.getTime() + 3 * 60 * 60 * 1000); // 3 hours celebration duration
          const endISO = end.toISOString().replace(/-|:|\.\d+/g, "");
          dateParam = `&dates=${startISO}/${endISO}`;
        } else {
          const simpleDate = new Date(cleanDate);
          if (!isNaN(simpleDate.getTime())) {
            const y = simpleDate.getFullYear();
            const m = String(simpleDate.getMonth() + 1).padStart(2, "0");
            const d = String(simpleDate.getDate()).padStart(2, "0");
            dateParam = `&dates=${y}${m}${d}/${y}${m}${d}`;
          }
        }
      } catch (e) {}

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${details}&location=${location}${dateParam}`;
    } catch (e) {
      return "#";
    }
  };

  const rawItinerary = wedding.itinerary && wedding.itinerary.length > 0 ? wedding.itinerary : [
    { title: "Mehndi & Sangeet Night", date: "Friday, Dec 16, 2035", time: "6:30 PM", desc: "An evening filled with music, henna, joyous melodies, and dance performances.", icon: "🎵" },
    { title: "The Sacred Wedding Ceremony", date: "Saturday, Dec 17, 2035", time: "11:00 AM", desc: "The auspicious union surrounded by sacred vows, hymns, and heartfelt blessings.", icon: "💍" },
    { title: "Grand Royal Reception Dinner", date: "Sunday, Dec 18, 2035", time: "7:30 PM", desc: "A magnificent royal banquet, toasts, and celebrating our new chapter together.", icon: "✨" },
  ];

  const parseEventTime = (item: { date?: string; time?: string }) => {
    try {
      if (item.date) {
        const cleanDateStr = item.date.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s*/i, "");
        const parsed = new Date(cleanDateStr);
        if (!isNaN(parsed.getTime())) {
          return parsed.getTime();
        }
      }
    } catch (e) {}
    return 0;
  };

  const itinerary = [...rawItinerary].sort((a, b) => {
    const timeA = parseEventTime(a);
    const timeB = parseEventTime(b);
    if (timeA && timeB && timeA !== timeB) return timeA - timeB;
    return 0;
  });

  return (
    <div 
      className="min-h-screen text-[#FAF6ED] font-['Cormorant_Garamond',Georgia,serif] relative overflow-x-hidden selection:bg-[#ffd700]/30 selection:text-[#ffd700] bg-[#140205]"
    >
      {/* 👑 4K LUXURY ROYAL BURGUNDY QUILTED & GOLD FILIGREE WALLPAPER BACKDROP */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-top bg-no-repeat opacity-95"
        style={{
          backgroundImage: "url('/images/royal_wedding_bg.jpg')",
          backgroundAttachment: "fixed"
        }}
      />

      {/* Dark Velvet Vignette Overlay for Crisp Readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#140205]/80 via-[#1a0409]/90 to-[#100103]/95 pointer-events-none z-0" />

      {/* Radial Gold Ambient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-[#ffd700]/15 via-[#d4af37]/5 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-t from-[#e11d48]/10 via-[#d4af37]/5 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      <div className="fixed -top-[9999px] -left-[9999px] w-48 h-48 pointer-events-none opacity-0 overflow-hidden" aria-hidden="true">
        <div id="wedding-yt-audio" />
      </div>

      {/* Floating Hearts & Petals Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      {/* 🎵 FLOATING ACTION CONTROLS (LUXURY AUDIO PILL & SHOWER BLESSINGS) */}
      {isOpened && (
        <>
          {/* Top Controls Hub with clean mobile spacing */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="fixed top-14 sm:top-5 right-3 sm:right-5 z-40 flex items-center gap-2 sm:gap-2.5"
          >
            {/* QR Code Invitation Button */}
            <button
              onClick={() => setShowQrModal(true)}
              className="px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-full bg-[#1e040a]/90 border border-[#d4af37]/70 text-[#ffd700] shadow-[0_4px_25px_rgba(212,175,55,0.35)] backdrop-blur-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer group hover:border-[#ffd700]"
              title="View & Download Royal QR Invitation Card"
            >
              <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffd700]" />
              <span className="text-[10px] uppercase font-['Plus_Jakarta_Sans',sans-serif] font-bold tracking-widest text-[#fff5d6] hidden sm:inline">QR Card</span>
            </button>

            {/* Luxury Floating Audio Controller Pill */}
            <button
              onClick={toggleMusic}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#2a050e]/95 via-[#1a0308]/95 to-[#2a050e]/95 border-2 border-[#d4af37]/70 text-[#ffd700] shadow-[0_6px_30px_rgba(212,175,55,0.45)] backdrop-blur-md flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer group hover:border-[#ffd700]"
              title={isPlayingMusic ? "Mute Royal Music" : "Play Royal Music"}
            >
              {isPlayingMusic ? (
                <>
                  {/* Equalizer Waveform Animation */}
                  <div className="flex items-center gap-0.5 h-3 sm:h-3.5">
                    <span className="w-0.5 h-full bg-[#ffd700] rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '600ms' }} />
                    <span className="w-0.5 h-full bg-[#ffd700] rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '450ms' }} />
                    <span className="w-0.5 h-full bg-[#ffd700] rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '700ms' }} />
                  </div>
                  <span className="text-[10px] uppercase font-['Plus_Jakarta_Sans',sans-serif] font-bold tracking-widest text-[#fff5d6] hidden sm:inline truncate max-w-[130px]">
                    {songTitle}
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400" />
                  <span className="text-[10px] uppercase font-['Plus_Jakarta_Sans',sans-serif] font-bold tracking-widest text-zinc-400 hidden sm:inline">Music Muted</span>
                </>
              )}
            </button>
          </motion.div>

          {/* 🌸 Floating "Shower Blessings" Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleShowerPetals}
            className="fixed bottom-3.5 right-3.5 sm:bottom-6 sm:right-6 z-40 px-3.5 py-2 sm:px-5 sm:py-3 rounded-full bg-gradient-to-r from-[#e11d48] via-[#ffd700] to-[#d4af37] text-[#1a0408] font-['Plus_Jakarta_Sans',sans-serif] font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-[0_8px_35px_rgba(225,29,72,0.6),0_0_25px_rgba(255,215,0,0.5)] flex items-center gap-1.5 sm:gap-2.5 cursor-pointer border-2 border-[#fff5d6]/80 overflow-hidden group backdrop-blur-md"
            title="Shower the couple with rose petals and heartfelt blessings"
          >
            {/* Shimmer Light Sweep */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
            
            <Flower2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1a0408] animate-spin" style={{ animationDuration: "10s" }} />
            <span className="hidden sm:inline">Shower Blessings 🌸</span>
            <span className="sm:hidden">Blessings 🌸</span>
          </motion.button>
        </>
      )}

      {/* 👑 ROYAL PRELUDE / WAX SEAL ENTRANCE CARD */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="royal-prelude"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96, pointerEvents: "none" }}
            transition={{ duration: 0.85, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#120204]"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-85"
              style={{ backgroundImage: "url('/images/royal_wedding_bg.jpg')" }}
            />
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

            {/* Ultra-Luxury Gold-Framed Envelope Card */}
            <div className="w-full max-w-md p-6 sm:p-10 rounded-[32px] sm:rounded-[38px] bg-gradient-to-b from-[#340610]/95 via-[#22030a]/95 to-[#150205]/95 border-2 border-[#ffd700]/80 text-center space-y-5 sm:space-y-6 relative overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.9),0_0_60px_rgba(212,175,55,0.35),inset_0_0_30px_rgba(255,215,0,0.04)] backdrop-blur-xl">

              {/* Palace Arch Motif */}
              <div className="pt-2 relative z-10">
                <PalaceArchMotif />
                <div className="w-14 h-14 mx-auto rounded-full border-2 border-[#ffd700] bg-[#d4af37]/20 flex items-center justify-center shadow-[0_0_25px_rgba(255,215,0,0.45)]">
                  <Crown className="w-7 h-7 text-[#ffd700]" />
                </div>
              </div>

              {/* Host Welcoming Line */}
              <div className="space-y-1.5 px-4 relative z-10">
                <p className="text-xs text-[#f8f1d4]/85 font-['Plus_Jakarta_Sans',sans-serif] font-bold tracking-[0.2em] uppercase">
                  {wedding.hostNames 
                    ? `${wedding.hostNames}`
                    : "Together with their families"}
                </p>
                <p className="text-xs sm:text-sm text-[#ffd700] font-['Cormorant_Garamond',Georgia,serif] italic">
                  cordially invite you to the royal wedding celebration of
                </p>
              </div>

              {/* Couple Names in Grand Calligraphic Script */}
              <div className="space-y-2 relative z-10">
                <h1 className="text-4xl sm:text-5xl font-normal font-['Great_Vibes','Pinyon_Script',cursive] bg-gradient-to-r from-[#fff5d6] via-[#ffd700] to-[#e7ce6d] bg-clip-text text-transparent drop-shadow-[0_4px_25px_rgba(255,215,0,0.5)] tracking-wide leading-tight py-1">
                  {coupleNames}
                </h1>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent" />
                  <p className="text-[10px] sm:text-[11px] text-[#ffd700] font-['Plus_Jakarta_Sans',sans-serif] tracking-[0.25em] uppercase font-black">
                    {hashtag}
                  </p>
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent" />
                </div>
              </div>

              {/* Interactive Royal Wax Seal Button */}
              <div className="pt-3 flex justify-center relative z-10">
                <motion.div
                  onClick={handleOpenInvitation}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.94 }}
                  className="w-28 h-28 rounded-full bg-gradient-to-br from-[#ffd700] via-[#d4af37] to-[#800a20] border-4 border-[#fff5d6] shadow-[0_0_45px_rgba(255,215,0,0.8),inset_0_2px_12px_rgba(255,255,255,0.6)] flex flex-col items-center justify-center cursor-pointer relative group transition-all"
                >
                  <div className="absolute inset-1.5 rounded-full border border-black/30" />
                  <Crown className="w-6 h-6 text-[#26040c] mb-0.5 drop-shadow-sm animate-pulse" />
                  <span className="text-xl font-black text-[#26040c] font-['Cinzel_Decorative','Cormorant_Garamond',serif] tracking-wider">
                    {monogram}
                  </span>
                  <div className="absolute inset-0 rounded-full bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </div>

              <div className="space-y-2 pt-2 relative z-10">
                <motion.button
                  onClick={handleOpenInvitation}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#ffd700] text-[#1a0408] font-['Plus_Jakarta_Sans',sans-serif] text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-950/40 cursor-pointer border border-white/60"
                >
                  Tap to Break Seal & Enter ✨
                </motion.button>
                <div className="text-[10px] text-zinc-400 font-['Plus_Jakarta_Sans',sans-serif]">
                  Sealed with love & blessings for our honored guests
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 MAIN ROYAL INVITATION SCROLLABLE EXPERIENCE */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-16 sm:space-y-20 relative z-20 text-center">
        
        {/* 1. HERO INVITATION CARD (ROYAL PALACE FOLIO) */}
        <section className="relative rounded-[32px] sm:rounded-[44px] bg-gradient-to-b from-[#340610]/95 via-[#22030a]/95 to-[#150205]/95 border-2 border-[#ffd700]/75 p-6 sm:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.85),0_0_65px_rgba(212,175,55,0.3),inset_0_0_30px_rgba(255,215,0,0.04)] backdrop-blur-xl space-y-6 sm:space-y-7 overflow-hidden">

          {/* Top Royal Palace Arch Motif & Crest */}
          <div className="flex flex-col items-center justify-center pt-2 space-y-2 relative z-10">
            <PalaceArchMotif />
            <div className="w-14 h-14 rounded-full border-2 border-[#ffd700] bg-[#d4af37]/20 flex items-center justify-center shadow-[0_0_25px_rgba(255,215,0,0.4)]">
              <Crown className="w-7 h-7 text-[#ffd700]" />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/20 border border-[#ffd700]/60 text-[10px] sm:text-[11px] font-['Plus_Jakarta_Sans',sans-serif] text-[#ffd700] uppercase tracking-[0.25em] font-black shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" /> Royal Wedding Celebration
            </div>
          </div>

          {/* Inviting Words */}
          <div className="space-y-2 max-w-xl mx-auto px-2 sm:px-4 relative z-10">
            <p className="text-xs sm:text-sm text-[#f8f1d4]/85 font-['Plus_Jakarta_Sans',sans-serif] font-bold tracking-[0.2em] uppercase">
              {wedding.hostNames || "Together with their families"}
            </p>
            <p className="text-xs sm:text-sm text-[#ffd700] italic font-['Cormorant_Garamond',Georgia,serif]">
              request the honor of your gracious presence to celebrate the union of
            </p>
          </div>

          {/* Grand Calligraphic Names */}
          <div className="space-y-2 py-1 relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal font-['Great_Vibes','Pinyon_Script',cursive] bg-gradient-to-r from-[#fff5d6] via-[#ffd700] to-[#e7ce6d] bg-clip-text text-transparent leading-tight drop-shadow-[0_4px_25px_rgba(255,215,0,0.5)] px-2">
              {coupleNames}
            </h1>
            <p suppressHydrationWarning className="text-[10px] sm:text-xs text-[#ffd700] font-['Plus_Jakarta_Sans',sans-serif] tracking-[0.2em] uppercase font-black">
              {wedding.venueName || "The Royal Grand Palace Ballroom"} • {formatWeddingDate(targetDateStr)}
            </p>
          </div>

          {/* 🏛️ PALACE ARCHWAY COUPLE CENTERPIECE ARTWORK */}
          <div className="pt-2 flex justify-center relative z-10">
            <div className="w-full max-w-xs sm:max-w-sm p-3 sm:p-3.5 rounded-t-full rounded-b-[28px] bg-gradient-to-b from-[#420a15]/95 to-[#1c0408]/95 border-2 border-[#ffd700]/80 shadow-[0_15px_50px_rgba(0,0,0,0.8)] relative overflow-hidden group">
              <div className="w-full aspect-[3/4] rounded-t-full rounded-b-[22px] overflow-hidden border border-[#d4af37]/40 relative shadow-inner">
                <img 
                  src="/images/animated_couple.jpg" 
                  alt={coupleNames} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-['Plus_Jakarta_Sans',sans-serif] text-[#ffd700] font-extrabold drop-shadow-md">
                    Two Souls • Bound by Love 💖
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <RoyalGoldDivider />
          </div>

        </section>

        {/* 2. THE CHARMING GROOM & PRETTY BRIDE (PALACE ARCH PORTRAITS) */}
        <section className="space-y-8">
          
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] font-['Plus_Jakarta_Sans',sans-serif] text-[#ffd700] font-bold block">
              A Symphony of Destinies
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Cormorant_Garamond',Georgia,serif]">The Groom & The Bride</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 max-w-3xl mx-auto">
            
            {/* 🤴 THE CHARMING GROOM CARD */}
            <div className="p-6 sm:p-9 rounded-[30px] sm:rounded-[36px] bg-gradient-to-b from-[#340610]/95 via-[#22030a]/95 to-[#150205]/95 border-2 border-[#ffd700]/70 shadow-[0_15px_50px_rgba(0,0,0,0.7),inset_0_0_25px_rgba(255,215,0,0.03)] backdrop-blur-md space-y-4 sm:space-y-5 text-center relative overflow-hidden group hover:border-[#ffd700] transition-all">

              {/* Palace Arch Groom Portrait */}
              <div className="w-32 sm:w-36 h-44 sm:h-48 mx-auto rounded-t-full rounded-b-2xl p-1 bg-gradient-to-b from-[#ffd700] via-[#d4af37] to-[#800a20] shadow-[0_0_35px_rgba(255,215,0,0.5)] group-hover:scale-105 transition-transform overflow-hidden relative z-10">
                <img 
                  src="/images/animated_groom.jpg" 
                  alt="Charming Groom" 
                  className="w-full h-full object-cover rounded-t-full rounded-b-xl"
                />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#1a0408] text-[9px] font-black font-['Plus_Jakarta_Sans',sans-serif] uppercase tracking-wider shadow-md whitespace-nowrap">
                  The Groom
                </div>
              </div>

              <div className="space-y-1.5 pt-1 relative z-10">
                <h3 className="text-3xl sm:text-4xl font-normal font-['Great_Vibes','Pinyon_Script',cursive] text-[#fff5d6]">{groomName}</h3>
                <p className="text-[11px] text-[#ffd700] font-['Plus_Jakarta_Sans',sans-serif] tracking-widest uppercase font-bold">
                  The Groom
                </p>
                {wedding.groomBio && (
                  <p className="text-xs text-[#f8f1d4]/85 font-['Plus_Jakarta_Sans',sans-serif] font-light max-w-xs mx-auto leading-relaxed pt-1">
                    {wedding.groomBio}
                  </p>
                )}
              </div>

            </div>

            {/* 👸 THE PRETTY BRIDE CARD */}
            <div className="p-6 sm:p-9 rounded-[30px] sm:rounded-[36px] bg-gradient-to-b from-[#340610]/95 via-[#22030a]/95 to-[#150205]/95 border-2 border-[#ffd700]/70 shadow-[0_15px_50px_rgba(0,0,0,0.7),inset_0_0_25px_rgba(255,215,0,0.03)] backdrop-blur-md space-y-4 sm:space-y-5 text-center relative overflow-hidden group hover:border-[#ffd700] transition-all">

              {/* Palace Arch Bride Portrait */}
              <div className="w-32 sm:w-36 h-44 sm:h-48 mx-auto rounded-t-full rounded-b-2xl p-1 bg-gradient-to-b from-[#ffd700] via-[#d4af37] to-[#800a20] shadow-[0_0_35px_rgba(255,215,0,0.5)] group-hover:scale-105 transition-transform overflow-hidden relative z-10">
                <img 
                  src="/images/animated_bride.jpg" 
                  alt="Pretty Bride" 
                  className="w-full h-full object-cover rounded-t-full rounded-b-xl"
                />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#1a0408] text-[9px] font-black font-['Plus_Jakarta_Sans',sans-serif] uppercase tracking-wider shadow-md whitespace-nowrap">
                  The Bride
                </div>
              </div>

              <div className="space-y-1.5 pt-1 relative z-10">
                <h3 className="text-3xl sm:text-4xl font-normal font-['Great_Vibes','Pinyon_Script',cursive] text-[#fff5d6]">{brideName}</h3>
                <p className="text-[11px] text-[#ffd700] font-['Plus_Jakarta_Sans',sans-serif] tracking-widest uppercase font-bold">
                  The Bride
                </p>
                {wedding.brideBio && (
                  <p className="text-xs text-[#f8f1d4]/85 font-['Plus_Jakarta_Sans',sans-serif] font-light max-w-xs mx-auto leading-relaxed pt-1">
                    {wedding.brideBio}
                  </p>
                )}
              </div>

            </div>

          </div>

        </section>

        {/* 3. LIVE GILDED ROYAL COUNTDOWN CLOCK */}
        <section className="p-6 sm:p-11 rounded-[30px] sm:rounded-[38px] bg-gradient-to-b from-[#340610]/95 via-[#22030a]/95 to-[#150205]/95 border-2 border-[#ffd700]/75 shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(212,175,55,0.25),inset_0_0_30px_rgba(255,215,0,0.04)] backdrop-blur-xl space-y-5 sm:space-y-6 relative overflow-hidden">

          <div className="space-y-1 relative z-10">
            <span className="text-xs uppercase tracking-[0.25em] font-['Plus_Jakarta_Sans',sans-serif] text-[#ffd700] font-bold block">
              Countdown to Forever
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Cormorant_Garamond',Georgia,serif]">Countdown to the Celebration</h2>
            <p suppressHydrationWarning className="text-xs sm:text-sm text-[#f8f1d4]/85 font-['Plus_Jakarta_Sans',sans-serif] font-light italic">
              {formatWeddingDate(targetDateStr, true)}
            </p>
          </div>

          <div className="relative z-10">
            <RoyalCountdownScratchCard 
              timeLeft={timeLeft} 
              onRevealed={handleCountdownScratchReveal} 
            />
          </div>

        </section>

        {/* 4. CEREMONIES & ITINERARY (FUNCTIONS WITH 1-CLICK CALENDAR SYNC) */}
        <section className="space-y-8">
          
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] font-['Plus_Jakarta_Sans',sans-serif] text-[#ffd700] font-bold block">
              Program of Celebrations
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Cormorant_Garamond',Georgia,serif]">Functions & Ceremonies</h2>
            <p className="text-xs sm:text-sm text-[#f8f1d4]/85 font-['Plus_Jakarta_Sans',sans-serif] font-light max-w-lg mx-auto">
              Cherished gatherings filled with joy, music, and unforgettable memories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 text-left font-['Plus_Jakarta_Sans',sans-serif]">
            {itinerary.map((item, index) => (
              <div
                key={index}
                className="p-6 sm:p-8 pb-7 sm:pb-9 rounded-[28px] sm:rounded-[32px] bg-gradient-to-b from-[#340610]/95 via-[#22030a]/95 to-[#150205]/95 border-2 border-[#ffd700]/60 hover:border-[#ffd700] transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.7),inset_0_0_20px_rgba(255,215,0,0.03)] relative overflow-hidden group flex flex-col justify-between hover:scale-[1.02]"
              >

                <div className="space-y-3.5 pb-4 relative z-10">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-3xl filter drop-shadow">{item.icon || "💍"}</span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full bg-[#ffd700]/20 border border-[#ffd700]/50 text-[#ffd700] font-bold font-mono shadow-sm">
                      <Clock className="w-3 h-3 text-[#ffd700]" /> {item.time || "TBA"}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-base sm:text-lg font-bold text-white font-['Cormorant_Garamond',Georgia,serif] tracking-wide leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#f8f1d4]/85 leading-relaxed font-light">
                      {item.desc || "We look forward to celebrating this special milestone with you and your family."}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#d4af37]/30 space-y-3 relative z-10">
                  <div className="flex items-center justify-between text-xs text-[#ffd700]">
                    <span className="flex items-center gap-1.5 font-medium"><Calendar className="w-3.5 h-3.5 text-[#ffd700]" /> {item.date}</span>
                  </div>
                  
                  {/* 1-Click Calendar Sync */}
                  <a
                    href={getGoogleCalendarUrl(item.title, item.date, item.time, wedding.venueName || "Wedding Celebration")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#ffd700]/20 via-[#d4af37]/30 to-[#ffd700]/20 hover:from-[#ffd700]/30 hover:to-[#ffd700]/30 border border-[#ffd700]/60 text-[#ffd700] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-[#ffd700]" /> Add to Google Calendar
                  </a>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* 5. VENUE & GOOGLE MAPS NAVIGATION (PALACE CARD) */}
        <section className="p-6 sm:p-11 rounded-[30px] sm:rounded-[38px] bg-gradient-to-b from-[#340610]/95 via-[#22030a]/95 to-[#150205]/95 border-2 border-[#ffd700]/75 shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.2),inset_0_0_30px_rgba(255,215,0,0.04)] backdrop-blur-xl space-y-5 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">

          <div className="relative z-10">
            <PalaceArchMotif />
          </div>

          <div className="w-14 h-14 mx-auto rounded-full border-2 border-[#ffd700] bg-[#d4af37]/20 flex items-center justify-center shadow-[0_0_25px_rgba(255,215,0,0.4)] relative z-10">
            <MapPin className="w-7 h-7 text-[#ffd700]" />
          </div>

          <div className="space-y-1.5 relative z-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#ffd700] font-bold block">Venue & Destination</span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-['Cormorant_Garamond',Georgia,serif]">
              {wedding.venueName || "The Royal Grand Palace Ballroom"}
            </h3>
            <p className="text-xs sm:text-sm text-[#f8f1d4]/90 max-w-md mx-auto font-light leading-relaxed">
              {wedding.venueAddress || "123 Heritage Palace Boulevard, Grand Celebration Hall"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center pt-2 relative z-10">
            {wedding.venueMapsUrl && (
              <a
                href={wedding.venueMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b89225] hover:from-[#e7ce6d] hover:to-[#ffd700] text-[#1a0408] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-all border border-white/60"
              >
                <Navigation className="w-4 h-4" /> Open in Google Maps
              </a>
            )}
            <button
              onClick={handleShareWhatsApp}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full border-2 border-[#d4af37]/70 bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#ffd700] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all hover:border-[#ffd700]"
            >
              <Share2 className="w-4 h-4 text-[#ffd700]" /> Share on WhatsApp
            </button>
          </div>

        </section>

        {/* 6. GUEST RSVP & ATTENDANCE (ENGRAVED GOLD CARD) */}
        <section className="p-6 sm:p-12 rounded-[30px] sm:rounded-[38px] bg-gradient-to-b from-[#340610]/95 via-[#22030a]/95 to-[#150205]/95 border-2 border-[#ffd700]/80 shadow-[0_20px_80px_rgba(0,0,0,0.9),0_0_60px_rgba(212,175,55,0.35),inset_0_0_30px_rgba(255,215,0,0.04)] backdrop-blur-xl space-y-6 sm:space-y-7 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden text-left">

          <div className="space-y-1.5 text-center relative z-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#ffd700] font-bold block">Répondez S&apos;il Vous Plaît</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Cormorant_Garamond',Georgia,serif]">Kindly Confirm Your Presence</h2>
            <p className="text-xs sm:text-sm text-[#f8f1d4]/85 max-w-md mx-auto font-light leading-relaxed">
              We look forward to welcoming you and your family with warmest hospitality and joyful festivities.
            </p>
          </div>

          {rsvpSubmitted ? (
            <div className="p-7 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3 shadow-inner relative z-10">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-xl sm:text-2xl font-bold text-white font-['Cormorant_Garamond',Georgia,serif]">RSVP Confirmed with Joy!</h4>
              <p className="text-xs sm:text-sm text-slate-200 font-light leading-relaxed">
                Thank you, <strong className="text-white font-bold">{guestName}</strong>! Your response has been saved. We eagerly await celebrating together! 💖
              </p>
              {totalHeadcount && (
                <div className="pt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                  <Users className="w-4 h-4" /> Total Confirmed Attendees: {totalHeadcount}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-5 text-left max-w-md mx-auto relative z-10">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#ffd700] uppercase tracking-wider">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Uncle Farooq & Family"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-black/60 border border-[#d4af37]/50 focus:border-[#ffd700] outline-none text-xs text-white placeholder-zinc-500 transition-colors shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#ffd700] uppercase tracking-wider">Attendance</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttendance("attending")}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      attendance === "attending"
                        ? "bg-[#d4af37]/35 border-[#ffd700] text-[#fff5d6] shadow-lg shadow-black/50 font-black"
                        : "bg-black/40 border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    🎉 Attending with Joy
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendance("declined")}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      attendance === "declined"
                        ? "bg-rose-500/25 border-rose-500 text-rose-200 shadow-lg shadow-black/50 font-black"
                        : "bg-black/40 border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    🤍 Sending Blessings
                  </button>
                </div>
              </div>

              {attendance === "attending" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#ffd700] uppercase tracking-wider">Number of Attending Guests</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setHeadcount(num)}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          headcount === num
                            ? "bg-gradient-to-r from-[#ffd700] to-[#d4af37] border-[#ffd700] text-[#1a0408] font-black shadow-md"
                            : "bg-black/40 border-white/10 text-zinc-300 hover:border-[#d4af37]/60"
                        }`}
                      >
                        {num === 5 ? "5+" : num}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#ffd700] uppercase tracking-wider">Warm Blessings for the Couple (Optional)</label>
                  <span className={`text-[10px] font-mono font-bold ${
                    (message.trim() ? message.trim().split(/\s+/).filter(Boolean).length : 0) > 90 ? "text-amber-400" : "text-zinc-400"
                  }`}>
                    {message.trim() ? message.trim().split(/\s+/).filter(Boolean).length : 0} / 100 words
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder="Leave a sweet congratulatory message (max 100 words)..."
                  value={message}
                  onChange={(e) => {
                    const text = e.target.value;
                    const words = text.trim().split(/\s+/).filter(Boolean);
                    if (words.length <= 100 || text.length < message.length) {
                      setMessage(text);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-[#d4af37]/50 focus:border-[#ffd700] outline-none text-xs text-white placeholder-zinc-500 transition-colors resize-none shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={rsvpLoading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b89225] hover:from-[#e7ce6d] hover:to-[#ffd700] text-[#1a0408] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_6px_30px_rgba(212,175,55,0.5)] cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] border border-white/70"
              >
                {rsvpLoading ? <Loader2 className="w-4 h-4 animate-spin text-[#1a0408]" /> : <>Confirm RSVP Response ✨ <Send className="w-4 h-4 text-[#1a0408]" /></>}
              </button>
            </form>
          )}
        </section>

        {/* 7. WE CAN'T WAIT TO CELEBRATE WITH YOU (COUPLE'S FINALE CARD) */}
        <section className="p-6 sm:p-12 rounded-[30px] sm:rounded-[38px] bg-gradient-to-b from-[#340610]/95 via-[#22030a]/95 to-[#150205]/95 border-2 border-[#ffd700]/80 shadow-[0_20px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(212,175,55,0.3),inset_0_0_30px_rgba(255,215,0,0.05)] backdrop-blur-xl space-y-6 text-center font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
          
          <div className="relative z-10">
            <PalaceArchMotif />
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#ffd700]/15 border border-[#ffd700]/50 text-xs font-['Cinzel_Decorative',serif] text-[#ffd700] uppercase tracking-[0.25em] font-bold shadow-md relative z-10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" /> With Love &amp; Gratitude
          </div>

          <div className="space-y-3 max-w-xl mx-auto relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-['Cormorant_Garamond',Georgia,serif] italic leading-tight">
              We Can&apos;t Wait to Celebrate With You! 💖✨
            </h2>
            <p className="text-xs sm:text-base text-[#fff5d6]/90 font-['Cormorant_Garamond',Georgia,serif] italic leading-relaxed">
              &ldquo;Your presence, warm blessings, and love mean the absolute world to us as we begin this sacred new chapter of togetherness. We eagerly await sharing our joy, laughter, and unforgettable memories with you.&rdquo;
            </p>
          </div>

          <RoyalGoldDivider />

          {/* Couple Sign-off */}
          <div className="space-y-2 relative z-10">
            <span className="text-[11px] font-['Cinzel_Decorative',serif] uppercase tracking-[0.3em] text-[#ffd700]/90 font-semibold block">
              Eagerly Awaiting Your Presence
            </span>
            <p className="text-2xl sm:text-3xl font-bold font-['Playfair_Display',Georgia,serif] text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-[#fff5d6] to-[#d4af37] drop-shadow-[0_2px_12px_rgba(255,215,0,0.5)]">
              {coupleNames}
            </p>
            {hashtag && (
              <div className="inline-block pt-1.5">
                <span className="px-4 py-1.5 rounded-full bg-[#d4af37]/20 border border-[#ffd700]/40 text-xs font-mono font-bold text-[#ffd700] tracking-wider shadow-sm">
                  {hashtag}
                </span>
              </div>
            )}
          </div>

        </section>

        {/* FOOTER */}
        <footer className="pt-8 border-t border-[#ffd700]/30 text-center text-xs text-[#ffd700] font-['Plus_Jakarta_Sans',sans-serif] space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#d4af37]/20 border border-[#ffd700]/70 hover:bg-[#d4af37]/30 text-[#ffd700] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              <QrCode className="w-4 h-4 text-[#ffd700]" /> Scan & Download Royal QR Card
            </button>
          </div>
          <p className="font-['Cormorant_Garamond',Georgia,serif] italic text-lg text-[#fff5d6]">With Warm Regards & Best Compliments</p>
          <p className="text-[11px] text-[#ffd700]/70">&copy; {new Date().getFullYear()} SealedVibe • Royal Digital Wedding Invitations</p>
        </footer>

      </main>

      {/* 👑 Royal QR Code & Printable Card Modal */}
      <QRCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        type="wedding"
        names={coupleNames}
        title="Royal Wedding Invitation"
        date={targetDateStr}
        time={wedding.weddingTime || "7:00 PM"}
        venue={wedding.venueName || "The Royal Grand Palace"}
        url={typeof window !== "undefined" ? `${window.location.origin}/p/${data.slug}` : `https://www.sealedvibe.in/p/${data.slug}`}
      />
    </div>
  );
}
