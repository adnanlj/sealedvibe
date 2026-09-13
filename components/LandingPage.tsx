"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import ApologyClient from "./ApologyClient";
import { DEMO_PRESETS } from "@/lib/demoPresets";
import confetti from "canvas-confetti";
import { 
  X,
  Heart,
  Coins,
  Crown,
  User as UserIcon, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Calendar, 
  Compass, 
  Music, 
  Activity, 
  Gift, 
  Users,
  ChevronRight,
  Play,
  ShieldCheck,
  Zap,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Sparkle,
  Radio,
  Clock,
  Layers,
  Send,
  Award,
  Eye,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import TokenStoreModal from "./TokenStoreModal";

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface LandingPageProps {
  onCreateClick: () => void;
}

// 🌟 Floating Golden Dust Canvas Component
function GoldenDustCanvas() {
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

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      pulseSpeed: number;
    }> = [];

    const particleCount = Math.min(width < 768 ? 20 : 40, 45);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.8,
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.008;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${Math.max(0.1, Math.min(p.opacity, 0.8))})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(251, 191, 36, 0.6)";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[1] opacity-70"
    />
  );
}

// 👑 Enhanced Royal 3D Wax Seal Hero Element
function InteractiveWaxSeal({ onClick }: { onClick: () => void }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [18, -18]), { stiffness: 220, damping: 18 });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-18, 18]), { stiffness: 220, damping: 18 });
  const glareX = useTransform(mouseX, [-100, 100], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-100, 100], ["0%", "100%"]);

  const [isBroken, setIsBroken] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const playUnsealSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") ctx.resume();

      // 1. Crisp wax crack snap (noise burst)
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1400;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start();

      // 2. Ascending celestial harmonic chime (E5, G#5, B5, E6)
      const freqs = [659.25, 830.61, 987.77, 1318.51];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + 0.04 + idx * 0.06);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + 0.04 + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04 + idx * 0.06 + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + 0.04 + idx * 0.06);
        osc.stop(ctx.currentTime + 0.04 + idx * 0.06 + 1.0);
      });
    } catch (e) {}
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSealClick = (e: React.MouseEvent) => {
    if (isBroken) return;
    setIsBroken(true);
    playUnsealSound();

    // Trigger royal gold & ruby confetti explosion
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const originX = (rect.left + rect.width / 2) / window.innerWidth;
    const originY = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 75,
      origin: { x: originX, y: originY },
      colors: ["#d4af37", "#fef08a", "#b91c1c", "#f43f5e", "#ffffff", "#fbbf24"],
      ticks: 200,
      gravity: 0.9,
      scalar: 1.1,
      shapes: ["circle", "square"],
    });

    setTimeout(() => {
      onClick();
    }, 750);
  };

  return (
    <div 
      className="perspective-1000 flex flex-col items-center justify-center cursor-pointer group my-3 select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleSealClick}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        animate={isBroken ? { scale: [1, 1.25, 0.9], opacity: [1, 1, 0.7] } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative"
      >
        {/* Deep Ruby & Golden Aura Glow */}
        <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-red-600/35 via-amber-500/30 to-yellow-400/25 blur-2xl group-hover:opacity-100 opacity-60 transition-opacity duration-500 animate-pulse" />

        {/* Orbiting Stardust Sparks (3 particles moving along circular path) */}
        <div className="absolute inset-0 -m-4 pointer-events-none">
          {[0, 120, 240].map((deg, i) => (
            <div
              key={`orbit-spark-${i}`}
              className="absolute inset-0 rounded-full"
              style={{
                animation: `spin ${6 + i * 2}s linear infinite`,
                transform: `rotate(${deg}deg)`,
              }}
            >
              <div 
                className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 shadow-[0_0_10px_#fde047,0_0_20px_#f59e0b]"
                style={{
                  position: "absolute",
                  top: "0%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          ))}
        </div>

        {/* 🌟 Outer Organic Scalloped Wax Rim (Natural Molten Drip Silhouette) */}
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.85)]">
          
          {/* Organic Wax SVG Contour Background */}
          <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full text-[#8b1515]">
            <defs>
              <radialGradient id="waxBaseGrad" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#c52828" />
                <stop offset="45%" stopColor="#991b1b" />
                <stop offset="85%" stopColor="#680b0b" />
                <stop offset="100%" stopColor="#3b0505" />
              </radialGradient>
              <linearGradient id="goldEdgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde68a" stopOpacity="0.8" />
                <stop offset="30%" stopColor="#d97706" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#fef08a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#78350f" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {/* Scalloped Molten Wax Outer Contour */}
            <path
              d="M 80,8 C 105,7 122,18 138,34 C 154,50 157,75 152,98 C 147,121 133,142 110,150 C 87,158 63,153 44,142 C 25,131 9,112 8,88 C 7,64 21,42 38,26 C 55,10 65,8 80,8 Z"
              fill="url(#waxBaseGrad)"
              stroke="url(#goldEdgeGrad)"
              strokeWidth="2.2"
            />
          </svg>

          {/* Inner Wax Seal Chamber with Deep Bevel and Specular Shimmer */}
          <div className="relative w-[104px] h-[104px] sm:w-[118px] sm:h-[118px] rounded-full bg-gradient-to-br from-[#aa1f1f] via-[#7d1414] to-[#420808] border-2 border-amber-400/50 shadow-[inset_0_4px_12px_rgba(255,255,255,0.35),inset_0_-6px_14px_rgba(0,0,0,0.8),0_4px_16px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center text-center p-2 overflow-hidden">
            
            {/* Vintage Beaded Ring / Milled Filigree Rope Border */}
            <div className="absolute inset-1.5 rounded-full border border-dashed border-amber-300/45 pointer-events-none" />
            <div className="absolute inset-2.5 rounded-full border border-amber-400/30 pointer-events-none" />

            {/* Dynamic Cursor-Following Specular Light Flare */}
            <motion.div 
              className="absolute w-36 h-36 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle at center, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.12) 30%, transparent 65%)",
                left: glareX,
                top: glareY,
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Shimmer Light Reflection Sweep on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

            {/* 👑 Royal Embossed Imperial Gold Crown */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                {/* Crown Bottom Drop Shadow for authentic debossed 3D depth */}
                <Crown className="w-8 h-8 sm:w-9 sm:h-9 text-black/60 absolute top-0.5 left-0.5 filter blur-[0.5px]" />
                <Crown className="w-8 h-8 sm:w-9 sm:h-9 text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] filter transition-all duration-300 group-hover:scale-110 group-hover:text-amber-200" />
              </div>
              
              {/* Embossed Text with Dual Shadow */}
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.28em] text-amber-200 mt-1 font-serif drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] group-hover:text-amber-100 transition-colors">
                SEALED
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[7px] tracking-widest text-amber-300/90 font-mono font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  VIBE
                </span>
                <span className="text-[6px] text-amber-400/80">•</span>
                <span className="text-[7px] tracking-widest text-amber-300/90 font-mono font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  2026
                </span>
              </div>
            </div>

            {/* Broken Wax Stamp Particle Crack Effect with Radiant Golden Rays */}
            {isBroken && (
              <>
                <motion.div 
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1.8, opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-200 blur-sm pointer-events-none"
                />
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: [0, 1, 0] }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0 rounded-full border-4 border-amber-300 pointer-events-none"
                />
                {/* 4 Directional Radiant Cracking Beams */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-1 bg-amber-300/90 rotate-45 animate-ping" />
                  <div className="w-full h-1 bg-amber-300/90 -rotate-45 animate-ping" />
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Action Indicator Pill */}
      <motion.div 
        animate={isBroken ? { scale: 0.95, opacity: 0.5 } : { y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        className="mt-3.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 border border-amber-400/40 text-amber-300 shadow-xl backdrop-blur-md flex items-center gap-1.5 group-hover:border-amber-300 group-hover:text-amber-200 group-hover:bg-amber-500/25 transition-all"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
        <span className="text-[11px] sm:text-xs font-black tracking-widest uppercase font-serif">
          {isBroken ? "Unsealing Keepsake..." : "Click to Unseal & Create"}
        </span>
      </motion.div>
    </div>
  );
}

export default function LandingPage({ onCreateClick }: LandingPageProps) {
  const [activeDemo, setActiveDemo] = useState("wedding");
  const [activeDemoModal, setActiveDemoModal] = useState<string | null>(null);
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("sealedvibe_user");
        return cached ? JSON.parse(cached) : null;
      } catch (e) {}
    }
    return null;
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [tokenStoreOpen, setTokenStoreOpen] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      try { localStorage.removeItem("sealedvibe_user"); } catch (e) {}
      setUserMenuOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  const [livePacks, setLivePacks] = useState<any[]>([
    { packId: "single", name: "Single Website", tokens: 1, priceInr: 19, originalPriceInr: 49, isPopular: false, tagline: "1 Lifetime Website" },
    { packId: "starter", name: "✨ Starter Pack", tokens: 3, priceInr: 49, originalPriceInr: 99, isPopular: true, tagline: "Save 50% • ₹16.3 / site" },
    { packId: "creator", name: "👑 Royal Creator", tokens: 10, priceInr: 149, originalPriceInr: 299, isPopular: false, tagline: "Best Value • ₹14.9 / site" },
  ]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn && data.user) {
          setUser(data.user);
          try { localStorage.setItem("sealedvibe_user", JSON.stringify(data.user)); } catch (e) {}
        } else {
          setUser(null);
          try { localStorage.removeItem("sealedvibe_user"); } catch (e) {}
        }
      })
      .catch(() => {});

    // Fetch live prices from MongoDB
    fetch("/api/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.packs && data.packs.length > 0) {
          setLivePacks(data.packs);
        }
      })
      .catch(() => {});
  }, []);

  // 🔙 Intercept Device/Browser Back Button & manage scroll locking when Showroom Demo is open
  useEffect(() => {
    if (activeDemoModal) {
      // Push state into browser history so hardware/browser Back button closes the demo
      window.history.pushState({ modal: "showroom-demo" }, "");

      const handlePopState = () => {
        setActiveDemoModal(null);
      };

      window.addEventListener("popstate", handlePopState);

      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      const isScrollable = activeDemoModal === "wedding" || activeDemoModal === "engagement" || activeDemoModal === "birthday_party" || activeDemoModal === "proposal";
      if (!isScrollable) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
        document.body.style.touchAction = "auto";
      }

      return () => {
        window.removeEventListener("popstate", handlePopState);
        document.body.style.overflow = "auto";
        document.body.style.touchAction = "auto";
      };
    }
  }, [activeDemoModal]);

  const handleCloseDemoModal = () => {
    if (typeof window !== "undefined" && window.history.state?.modal === "showroom-demo") {
      window.history.back();
    } else {
      setActiveDemoModal(null);
    }
  };

  const scrollToSection = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const FAQS = [
    {
      q: "How does the recipient view their website?",
      a: "You receive a unique, private link (e.g. sealedvibe.in/p/sujan-royal). They open it on any mobile device or computer. The 3D wax seal breaks open with sound, revealing the personalized experience, music, and interactive surprises.",
    },
    {
      q: "Can I protect the website with a secret passcode?",
      a: "Yes! You can set an optional private passcode during creation. Only someone who enters your secret answer can open the website.",
    },
    {
      q: "How does live RSVP and visit tracking work?",
      a: "Your private creator dashboard (/dashboard and /track) updates in real time the instant the recipient opens the envelope, plays the music, or RSVPs for wedding/date invitations.",
    },
    {
      q: "Do purchased tokens expire?",
      a: "Never. Tokens remain in your wallet forever until you use them to generate a website. 1 Token = 1 Full Lifetime Hosted Website.",
    },
    {
      q: "Can I play custom music or songs?",
      a: "Yes! You can choose from curated romantic and cinematic themes or paste any public YouTube song link to stream directly in the background.",
    },
  ];

  const currentDemoObj = DEMO_PRESETS[activeDemo] || DEMO_PRESETS["wedding"];

  // 🎬 If a Showroom Demo is active, render it exclusively in 100% full-screen standalone mode
  if (activeDemoModal && DEMO_PRESETS[activeDemoModal]) {
    const isScrollable = activeDemoModal === "wedding" || activeDemoModal === "engagement" || activeDemoModal === "birthday_party" || activeDemoModal === "proposal";
    const isLightParty = activeDemoModal === "birthday_party";
    return (
      <div className={`min-h-[100dvh] w-full ${isLightParty ? "bg-[#fffdf9] text-[#2b2118]" : "bg-[#050510] text-slate-100"} relative font-sans ${isScrollable ? "overflow-y-auto" : ""}`}>
        {/* Floating Top Action Header with perfect mobile spacing */}
        <div className="fixed top-2.5 left-2.5 right-2.5 sm:top-5 sm:right-5 sm:left-auto z-[999999] flex justify-between sm:justify-end items-center gap-2 pointer-events-none">
          <div className={`px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full ${isLightParty ? "bg-[#fffdfa]/95 border border-[#d4af37]/60 text-[#8c6d1f]" : "bg-black/90 border border-amber-500/40 text-amber-300"} backdrop-blur-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-2xl pointer-events-auto`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate max-w-[120px] sm:max-w-none">{DEMO_PRESETS[activeDemoModal].badge}</span>
          </div>

          <button
            onClick={handleCloseDemoModal}
            className={`px-3 py-1 sm:px-5 sm:py-2.5 rounded-full ${isLightParty ? "bg-[#fffdfa] hover:bg-[#eed180]/20 border border-[#d4af37]/70 text-[#8c6d1f]" : "bg-[#110d24]/95 hover:bg-[#1a1435] border border-amber-400/60 text-amber-300"} backdrop-blur-xl font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto`}
          >
            <X className="w-3.5 h-3.5 text-[#d4af37]" /> Exit Showroom
          </button>
        </div>

        {/* 100% Standalone Interactive Keepsake */}
        <ApologyClient data={DEMO_PRESETS[activeDemoModal].data} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#06050e] text-slate-100 font-sans flex flex-col overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* 🌟 Floating Golden Dust Canvas */}
      <GoldenDustCanvas />

      {/* 🔮 Luxury Ambient Mesh Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-amber-600/12 via-purple-900/15 to-transparent blur-[140px]" />
        <div className="absolute top-[35%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-bl from-pink-600/12 via-indigo-900/15 to-transparent blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-t from-amber-950/20 to-transparent blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
      </div>

      {/* 🧭 Top Luxury Glass Navigation Bar */}
      <header className="w-full px-2.5 sm:px-6 py-2 sm:py-4 z-40 sticky top-0 bg-[#06050e]/85 backdrop-blur-2xl border-b border-white/8 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Brand Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 sm:gap-3.5 cursor-pointer group"
          >
            <div className="relative w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500/25 via-pink-500/20 to-purple-600/25 border border-amber-400/40 p-0.5 flex items-center justify-center shadow-xl shadow-amber-950/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[10px] sm:rounded-[14px] bg-[#0c0a18] flex items-center justify-center">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400/20 transition-transform group-hover:scale-110" />
              </div>
              <span className="absolute -top-1 -right-1 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-amber-400 animate-ping" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-white to-pink-200 bg-clip-text text-transparent block font-serif">
                SealedVibe
              </span>
              <span className="hidden sm:block text-[9px] uppercase tracking-[0.25em] text-slate-400 font-bold -mt-1">
                Luxury Digital Keepsakes
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-400">
            <button onClick={() => scrollToSection("experiences")} className="hover:text-amber-300 transition-colors cursor-pointer">
              Occasions
            </button>
            <button onClick={() => scrollToSection("how-it-works")} className="hover:text-amber-300 transition-colors cursor-pointer">
              How It Works
            </button>
            <button onClick={() => scrollToSection("features")} className="hover:text-amber-300 transition-colors cursor-pointer">
              Features
            </button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-amber-300 transition-colors cursor-pointer">
              Pricing
            </button>
            <button onClick={() => scrollToSection("faq")} className="hover:text-amber-300 transition-colors cursor-pointer">
              FAQ
            </button>
          </div>

          {/* Right Action Hub */}
          <div className="flex items-center gap-1.5 sm:gap-3 relative">
            {user ? (
              <>
                {/* Token Store Trigger */}
                <button
                  onClick={() => setTokenStoreOpen(true)}
                  className="px-2 sm:px-3.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-mono font-bold text-[11px] sm:text-xs flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-950/20"
                  title="Open Token Store"
                >
                  <Coins className="w-3.5 h-3.5 text-amber-400" /> {user.tokens ?? 1} <span className="hidden sm:inline">Token{(user.tokens ?? 1) !== 1 ? "s" : ""}</span>
                  <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1 py-0.2 rounded font-sans font-black">+</span>
                </button>

                {/* User Account Dropdown Trigger */}
                <div className="relative">
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="px-2 sm:px-3 py-1.5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/12 text-white uppercase tracking-wider text-[11px] sm:text-xs font-extrabold flex items-center gap-1 sm:gap-1.5 transition-all shadow-md cursor-pointer"
                    title="Account Menu"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-amber-400" /> 
                    <span className="hidden sm:inline">{user.name?.split(" ")[0] || "Account"}</span>
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
                            <span className="text-xs font-bold text-white block truncate">{user.name}</span>
                            <span className="text-[10px] text-slate-400 block truncate">{user.email}</span>
                          </div>

                          {/* Dashboard Link */}
                          <Link
                            href="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-400" />
                            <span>Dashboard & Keepsakes</span>
                          </Link>

                          {/* Admin Portal (if admin) */}
                          {user.isAdmin && (
                            <Link
                              href="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
                            >
                              <Crown className="w-4 h-4 text-amber-400" />
                              <span>Admin Portal</span>
                            </Link>
                          )}

                          {/* Token Store Link */}
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              setTokenStoreOpen(true);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 transition-all cursor-pointer text-left"
                          >
                            <span className="flex items-center gap-2">
                              <Coins className="w-4 h-4 text-amber-400" /> Token Balance
                            </span>
                            <span className="font-mono text-amber-300 font-bold bg-amber-500/20 px-1.5 py-0.2 rounded text-[10px]">
                              {user.tokens ?? 1}
                            </span>
                          </button>

                          <div className="border-t border-white/10 pt-1" />

                          {/* 🚪 LOGOUT BUTTON */}
                          <button
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
                  className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> View Pricing
                </a>
                <Link 
                  href="/login"
                  className="text-xs text-slate-300 hover:text-white uppercase tracking-wider font-bold transition-colors px-1 sm:px-2"
                >
                  Log In
                </Link>
              </>
            )}

            <button 
              onClick={onCreateClick}
              className="px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xl shadow-amber-950/40 hover:scale-105 active:scale-95 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Create Website</span><span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>
      </header>

      {/* 👑 Hero Section with Centered Headline and 3D Wax Seal */}
      <section id="hero" className="relative z-10 max-w-6xl mx-auto text-center px-4 sm:px-6 pt-10 sm:pt-24 pb-12 sm:pb-16 space-y-6 sm:space-y-8">
        
        {/* Floating Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-pink-500/15 border border-amber-500/30 text-[11px] sm:text-xs font-bold text-amber-300 shadow-2xl backdrop-blur-md"
        >
          <Sparkle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
          <span>The Art of Digital Keepsakes</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </motion.div>

        {/* Hero Title */}
        <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.15] tracking-tight">
            For feelings too deep for a simple message.
            <span className="block mt-2 sm:mt-3 bg-gradient-to-r from-amber-200 via-pink-300 to-purple-300 bg-clip-text text-transparent font-serif italic">
              Seal their private 3D universe.
            </span>
          </h1>

          <p className="text-xs sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed pt-1 sm:pt-2">
            Turn your emotions, apologies, wedding invitations, and milestones into an interactive 3D web experience with background music, wax seal envelopes, secret compliments, and live RSVP receipts.
          </p>
        </div>

        {/* Interactive 3D Wax Seal Stamp Component */}
        <div className="flex justify-center py-1 sm:py-2">
          <InteractiveWaxSeal onClick={onCreateClick} />
        </div>

        {/* Hero CTA Hub with Spring Physics */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <motion.button 
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={onCreateClick}
            className="w-full sm:w-auto px-7 py-3.5 sm:px-9 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-2xl shadow-amber-500/30 transition-all duration-300"
          >
            Create Your Website <ArrowRight className="w-4 h-4" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => scrollToSection("experiences")}
            className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold text-xs sm:text-sm uppercase tracking-wider cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Explore Live Demo Showroom
          </motion.button>
        </div>

        {/* Trust Metric Bar */}
        <div className="pt-4 sm:pt-6 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto text-left">
          {[
            { icon: <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />, title: "100% Private", desc: "Passcode-locked URL" },
            { icon: <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400" />, title: "3D Audio & Visuals", desc: "Custom background music" },
            { icon: <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />, title: "Live Tracking", desc: "Real-time RSVP receipts" },
            { icon: <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />, title: "Instant Delivery", desc: "Ready in 60 seconds" },
          ].map((item, idx) => (
            <div key={idx} className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/4 backdrop-blur-md flex items-center gap-2.5 sm:gap-3 transition-all">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/5 flex-shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] sm:text-xs font-bold text-white block truncate">{item.title}</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 block truncate">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🎭 Interactive Showroom (Bento Experience Matrix) */}
      <section id="experiences" className="scroll-mt-24 relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.25em] block">
            Crafted for Every Sacred Emotion
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-serif italic">Interactive Live Showroom</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-light">
            Select an occasion below to see how your published website looks, sounds, and interacts with the recipient.
          </p>
        </div>

        {/* Occasion Switcher Tabs */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2.5 mb-8 sm:mb-10">
          {Object.values(DEMO_PRESETS).map((demo) => {
            const isSelected = activeDemo === demo.id;
            return (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`px-3.5 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-extrabold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
                  isSelected 
                    ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/60 text-amber-300 shadow-xl shadow-amber-950/30 scale-105" 
                    : "bg-white/5 border-white/8 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{demo.label}</span>
              </button>
            );
          })}
        </div>

        {/* 🌟 Interactive Live Preview Showcase Card */}
        <div className={`w-full max-w-4xl mx-auto p-2 sm:p-3 rounded-2xl sm:rounded-[36px] ${
          activeDemo === "proposal"
            ? "bg-gradient-to-b from-rose-950/70 via-pink-950/40 to-[#120306] border border-rose-500/50 shadow-2xl shadow-rose-950/50"
            : activeDemo === "birthday_party" 
            ? "bg-gradient-to-b from-[#eed180]/30 via-[#fce7f3]/20 to-[#fffdf9]/90 border border-[#d4af37]/50 shadow-2xl" 
            : "bg-gradient-to-b from-amber-500/20 via-white/5 to-black/80 border border-amber-500/30 shadow-2xl"
        } relative overflow-hidden backdrop-blur-xl transition-all duration-500`}>
          
          <div className={`w-full rounded-xl sm:rounded-[28px] ${
            activeDemo === "proposal"
              ? "bg-[#180408] text-[#fff5f7] border border-rose-500/40 shadow-inner"
              : activeDemo === "birthday_party"
              ? "bg-[#fffdf9] text-[#2b2118] border border-[#d4af37]/40 shadow-inner"
              : "bg-[#0c0a18] text-white border border-white/10"
          } overflow-hidden relative min-h-[380px] sm:min-h-[460px] flex flex-col justify-between p-4 sm:p-8 md:p-10 select-none transition-colors duration-500`}>
            
            {/* Top Bar inside Preview */}
            <div className={`w-full flex justify-between items-center text-[8px] sm:text-[9px] font-bold uppercase tracking-widest z-10 border-b pb-3 sm:pb-4 ${
              activeDemo === "proposal"
                ? "text-rose-300 border-rose-500/30"
                : activeDemo === "birthday_party"
                ? "text-[#8c6d1f] border-[#d4af37]/30"
                : "text-slate-400 border-white/10"
            }`}>
              <span className={`flex items-center gap-1 sm:gap-1.5 ${activeDemo === "proposal" ? "text-rose-300" : (activeDemo === "birthday_party" ? "text-[#8c6d1f]" : "text-amber-300")}`}>
                <Sparkles className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${activeDemo === "proposal" ? "text-rose-400" : (activeDemo === "birthday_party" ? "text-[#d4af37]" : "text-amber-400")}`} /> SealedVibe Experience
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live 3D Rendering
              </span>
            </div>

            {/* Centered Preview Content */}
            <div className="text-center space-y-3 sm:space-y-4 my-auto z-10 max-w-lg mx-auto py-4">
              <span 
                className={`text-[9px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-black px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border inline-block ${
                  activeDemo === "proposal"
                    ? "bg-rose-950/60 text-rose-300 border-rose-500/50"
                    : activeDemo === "birthday_party"
                    ? "bg-[#eed180]/20 text-[#8c6d1f] border-[#d4af37]/40"
                    : "bg-black/40"
                }`}
                style={activeDemo === "birthday_party" || activeDemo === "proposal" ? {} : { 
                  color: currentDemoObj.colors[0],
                  borderColor: `${currentDemoObj.colors[0]}40`
                }}
              >
                {currentDemoObj.badge} • {currentDemoObj.label}
              </span>
              <h3 className={`text-lg sm:text-2xl md:text-3xl font-black tracking-tight font-serif italic ${
                activeDemo === "proposal" ? "text-rose-100" : (activeDemo === "birthday_party" ? "text-[#1a1411]" : "text-white")
              }`}>
                "{currentDemoObj.title}"
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed font-light line-clamp-3 sm:line-clamp-none ${
                activeDemo === "proposal" ? "text-rose-200/80" : (activeDemo === "birthday_party" ? "text-[#6b4e2e]" : "text-slate-300")
              }`}>
                {currentDemoObj.desc}
              </p>
              
              <div className="pt-2 sm:pt-4 flex justify-center">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveDemoModal(activeDemo)}
                  className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xl ${
                    activeDemo === "proposal"
                      ? "bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 text-white shadow-rose-950/50 border border-rose-300/40"
                      : activeDemo === "birthday_party"
                      ? "bg-gradient-to-r from-[#d4af37] via-[#eed180] to-[#e8a598] hover:from-[#c29d2b] hover:to-[#e0a89b] text-[#1a1411] shadow-amber-950/20 border border-white/80"
                      : "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-amber-500/30"
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Launch Interactive Demo
                </motion.button>
              </div>
            </div>

            {/* Bottom Bar inside Preview */}
            <div className={`w-full flex justify-between items-center text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider z-10 border-t pt-3 sm:pt-4 ${
              activeDemo === "proposal"
                ? "text-rose-400/80 border-rose-500/30"
                : activeDemo === "birthday_party"
                ? "text-[#8c6d1f] border-[#d4af37]/30"
                : "text-slate-500 border-white/10"
            }`}>
              <span>Interactive Slides & Music</span>
              <span>🔒 100% Encrypted</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🪄 How It Works (Bento 3-Step Flow) */}
      <section id="how-it-works" className="scroll-mt-24 relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 border-t border-white/8">
        <div className="text-center space-y-2 sm:space-y-3 mb-10 sm:mb-16">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.25em] block">
            Effortless Creation
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-serif italic">How SealedVibe Works</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto font-light">
            Craft an extraordinary keepsake in 3 simple steps — no coding or technical skills required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
          
          {/* Step 1 */}
          <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.04] hover:bg-white/[0.07] transition-all space-y-3 sm:space-y-4 group backdrop-blur-md shadow-xl hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-3xl sm:text-4xl font-black text-amber-500/30 font-serif group-hover:text-amber-400 transition-colors">01</span>
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-amber-500/10 text-amber-400">
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Answer Simple Prompts</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Enter their name, your relationship, inside jokes, and special memories. Our built-in AI will craft a poetic, deeply moving multi-act story.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.04] hover:bg-white/[0.07] transition-all space-y-3 sm:space-y-4 group backdrop-blur-md shadow-xl hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-3xl sm:text-4xl font-black text-pink-500/30 font-serif group-hover:text-pink-400 transition-colors">02</span>
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-pink-500/10 text-pink-400">
                <Music className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Pick Your 3D Vibe & Music</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Choose your theme (cosmic hearts, floating lanterns, flower petals, or royal gold) and pair it with any romantic background song.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.04] hover:bg-white/[0.07] transition-all space-y-3 sm:space-y-4 group backdrop-blur-md shadow-xl hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-3xl sm:text-4xl font-black text-emerald-500/30 font-serif group-hover:text-emerald-400 transition-colors">03</span>
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-500/10 text-emerald-400">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Seal & Track Live</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Lock with an optional secret passcode, send the link, and watch live receipts in your dashboard when they open the envelope and RSVP!
            </p>
          </div>

        </div>
      </section>

      {/* 💎 Built-In Magic Features Matrix */}
      <section id="features" className="scroll-mt-24 relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-white/8">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.25em] block">
            State of the Art
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-serif italic">Built-In Magic Features</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto font-light">
            Every SealedVibe website comes equipped with interactive surprise components.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          <div className="p-6 rounded-3xl bg-white/[0.04] hover:bg-white/[0.07] transition-all space-y-3 backdrop-blur-md shadow-xl hover:shadow-2xl hover:-translate-y-1">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Stardust Secrets Constellation</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Interactive 3D particle constellation map where recipients click glowing stars to unveil secret compliments and memories.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.04] hover:bg-white/[0.07] transition-all space-y-3 backdrop-blur-md shadow-xl hover:shadow-2xl hover:-translate-y-1">
            <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 w-fit">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Live RSVP & Date Proposals</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Interactive date invitations and wedding RSVP receipts with headcount tracking syncing live to your dashboard.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.04] hover:bg-white/[0.07] transition-all space-y-3 backdrop-blur-md shadow-xl hover:shadow-2xl hover:-translate-y-1">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 w-fit">
              <Gift className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Ending Scratch & Reveal Surprises</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Recipients scratch off a gold foil scratch card or sync an interactive pulsing heartbeat visualizer with secret notes.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.04] hover:bg-white/[0.07] transition-all space-y-3 backdrop-blur-md shadow-xl hover:shadow-2xl hover:-translate-y-1">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 w-fit">
              <Music className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Curated Background Audio Themes</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Plays your chosen background melody when the wax seal envelope is opened, complete with vinyl animations and mute controls.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.04] hover:bg-white/[0.07] transition-all space-y-3 backdrop-blur-md shadow-xl hover:shadow-2xl hover:-translate-y-1">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Private Passcode Vault</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Restricts access with an encrypted passcode question that only your recipient knows the answer to.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.04] hover:bg-white/[0.07] transition-all space-y-3 backdrop-blur-md shadow-xl hover:shadow-2xl hover:-translate-y-1">
            <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400 w-fit">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Creator Live Analytics</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Get notified when they open your website, view their RSVP responses, and manage your website lifetime links.
            </p>
          </div>

        </div>
      </section>

      {/* 💰 High-Conversion Pricing & Token Store Section */}
      <section id="pricing" className="scroll-mt-24 relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 border-t border-white/8">
        <div className="text-center space-y-2 sm:space-y-3 mb-10 sm:mb-16">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.25em] block">
            Simple, Honest Pricing
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-serif italic">1 Token = 1 Lifetime Website</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto font-light">
            No monthly subscriptions. Buy tokens once and create whenever inspiration strikes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {livePacks.map((p) => {
            const isPopular = p.isPopular || p.popular;

            return (
              <div
                key={p.packId || p.id}
                className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border flex flex-col justify-between relative transition-all duration-300 ${
                  isPopular 
                    ? "bg-gradient-to-b from-amber-500/15 via-zinc-950 to-black border-amber-500/50 shadow-2xl shadow-amber-950/40 ring-1 ring-amber-500/40 scale-100 md:scale-105" 
                    : "bg-white/4 border-white/10 hover:border-amber-500/30"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-[10px] font-black uppercase tracking-widest shadow-lg">
                    Most Popular Choice
                  </div>
                )}

                <div className="space-y-3 sm:space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    {p.name}
                  </span>
                  
                  {/* Dynamic Pricing with Cutout MRP and Discount Badge */}
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2.5 flex-wrap">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-mono">
                        ₹{p.priceInr}
                      </span>
                      {p.originalPriceInr && p.originalPriceInr > p.priceInr ? (
                        <span className="text-sm sm:text-lg text-slate-500 line-through font-mono font-bold">
                          ₹{p.originalPriceInr}
                        </span>
                      ) : null}
                      {p.originalPriceInr && p.originalPriceInr > p.priceInr ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">
                          {Math.round(((p.originalPriceInr - p.priceInr) / p.originalPriceInr) * 100)}% OFF
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <span className="text-xs font-bold text-amber-400 block font-mono">
                    {p.tokens} Full Website Token{p.tokens > 1 ? "s" : ""}
                  </span>

                  <p className="text-xs text-emerald-400 font-medium">
                    {p.tagline || p.desc}
                  </p>

                  <div className="pt-3 sm:pt-4 border-t border-white/8 space-y-2 sm:space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Permanent Digital Keepsake Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Personalized Background Audio Themes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Live RSVP & Visitor Tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Encrypted Passcode Vault</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 sm:pt-8">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (user) {
                        setTokenStoreOpen(true);
                      } else {
                        window.location.href = "/signup";
                      }
                    }}
                    className={`w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xl ${
                      isPopular 
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black shadow-amber-500/30" 
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    {user ? "Buy Pack" : "Get Started"}
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cashfree Trust Seal */}
        <div className="pt-10 text-center flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" /> Cashfree Verified Checkout
          </span>
          <span>•</span>
          <span>Instant Token Crediting</span>
          <span>•</span>
          <span>UPI, Cards & NetBanking</span>
        </div>
      </section>

      {/* ❓ Frequently Asked Questions (Accordion) */}
      <section id="faq" className="scroll-mt-24 relative z-10 max-w-4xl mx-auto px-6 py-20 border-t border-white/8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.25em] block">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-serif italic">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div 
                key={idx}
                className="rounded-2xl bg-white/4 border border-white/8 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center text-sm font-bold text-white hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-amber-400" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 text-xs text-slate-300 leading-relaxed font-light border-t border-white/5 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🚀 Bottom Final CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto text-center px-6 py-20 space-y-6">
        <div className="p-10 sm:p-14 rounded-[36px] bg-gradient-to-b from-amber-500/15 via-purple-900/20 to-black border border-amber-500/30 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-amber-500/20 blur-[80px]" />
          
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight font-serif italic">
            Ready to seal something unforgettable?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-light leading-relaxed">
            Join thousands of creators expressing emotions, celebrating weddings, and preserving memories with SealedVibe.
          </p>
          
          <div className="pt-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreateClick}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 text-black font-black text-xs sm:text-sm uppercase tracking-wider cursor-pointer shadow-2xl shadow-amber-500/40 transition-all"
            >
              Start Creating Now
            </motion.button>
          </div>
        </div>
      </section>

      {/* 📜 Luxury Footer */}
      <footer className="w-full text-center py-8 z-10 text-xs text-slate-400 border-t border-white/8 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-6 gap-4">
        <div>&copy; {new Date().getFullYear()} SealedVibe • Designed & Developed by Adnan</div>
        <div className="flex flex-wrap gap-4 sm:gap-5 justify-center items-center text-xs">
          <a
            href="https://instagram.com/sealedvibe"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-amber-500/15 border border-pink-500/30 text-pink-300 hover:text-pink-200 hover:border-pink-400 transition-all font-semibold group shadow-sm"
            title="Follow @sealedvibe on Instagram"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
            <span>@sealedvibe</span>
          </a>
          <Link href="/privacy" className="hover:text-amber-300 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-amber-300 transition-colors">Terms of Service</Link>
          <Link href="/refund" className="hover:text-amber-300 transition-colors">Refund Policy</Link>
          <a href="mailto:adnanajmeri70@gmail.com" className="hover:text-amber-300 transition-colors" title="Contact: adnanajmeri70@gmail.com">Contact: adnanajmeri70@gmail.com</a>
        </div>
      </footer>

      {/* 🪙 Token Store Modal */}
      <TokenStoreModal
        isOpen={tokenStoreOpen}
        currentTokens={user?.tokens ?? 1}
        onClose={() => setTokenStoreOpen(false)}
        onSuccess={(newTokens) => {
          setUser((prev: any) => ({ ...prev, tokens: newTokens }));
        }}
      />
    </div>
  );
}
