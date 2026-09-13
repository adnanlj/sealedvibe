"use client";

import { useState } from "react";
import { Heart, Sparkles, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface HeartbeatPulsatorProps {
  message: string;
  onUnlock?: () => void;
}

interface Ripple {
  id: number;
}

interface Particle {
  id: number;
  x: number;
}

export default function HeartbeatPulsator({ message, onUnlock }: HeartbeatPulsatorProps) {
  const [taps, setTaps] = useState<number>(0);
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (unlocked) return;

    const nextTaps = taps + 1;
    setTaps(nextTaps);

    // 1. Resolve tap coordinates and fire stardust confetti sparks
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;
    if (e) {
      if ("touches" in e && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
      }
    }

    confetti({
      particleCount: 12,
      angle: Math.random() * 360,
      spread: 45,
      origin: {
        x: clientX / window.innerWidth,
        y: clientY / window.innerHeight
      },
      colors: ["#ec4899", "#f43f5e", "#d946ef", "#a855f7"]
    });

    // 2. Trigger circular ripple
    const rippleId = Date.now();
    setRipples((prev) => [...prev, { id: rippleId }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 1000);

    // 3. Trigger floating heart particle
    const particleId = Date.now();
    setParticles((prev) => [...prev, { id: particleId, x: (Math.random() - 0.5) * 60 }]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== particleId));
    }, 1500);

    // 4. Check unlock threshold
    if (nextTaps >= 5) {
      setTimeout(() => {
        setUnlocked(true);
        if (onUnlock) onUnlock();
      }, 350); // slight delay to enjoy the final tap effects
    }
  };

  // Determine current pulse speed based on taps
  const getPulseSpeed = () => {
    switch (taps) {
      case 0: return 2.2;
      case 1: return 1.8;
      case 2: return 1.4;
      case 3: return 1.0;
      case 4: return 0.6;
      default: return 0.5;
    }
  };

  const speed = getPulseSpeed();

  return (
    <div 
      className="w-full max-w-md mx-auto p-8 rounded-[32px] bg-white/[0.015] border border-white/5 backdrop-blur-[6px] text-center flex flex-col items-center justify-center min-h-[320px] select-none relative overflow-hidden transition-colors duration-500 animate-float"
      style={{
        border: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(8px)",
        boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 25px 65px rgba(0, 0, 0, 0.45)"
      }}
    >
      {/* 12 Twinkling stardust points inside the card */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-pink-400 pointer-events-none opacity-40"
          style={{
            top: `${(i * 17) % 80 + 10}%`,
            left: `${(i * 23) % 80 + 10}%`,
            animation: `twinkle ${1.2 + (i % 3) * 0.4}s infinite ease-in-out`,
            animationDelay: `${i * 0.15}s`
          }}
        />
      ))}

      {/* Internal ambient glowing stardust blobs */}
      <div className="absolute top-[-25%] left-[-25%] w-[65%] h-[65%] rounded-full bg-pink-500/10 blur-[80px] pointer-events-none z-0" />
      <div className="absolute bottom-[-25%] right-[-25%] w-[65%] h-[65%] rounded-full bg-purple-500/10 blur-[80px] pointer-events-none z-0" />
      
      {/* Decorative ECG Line Background (speeds up as user taps) */}
      {!unlocked && (
        <div className="absolute inset-x-0 top-10 h-20 opacity-30 pointer-events-none z-0">
          <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
            <motion.path
              d="M 0 50 L 80 50 L 90 35 L 98 75 L 108 10 L 118 90 L 128 50 L 138 50 L 146 45 L 154 55 L 162 50 L 300 50"
              stroke="#f43f5e"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="200"
              style={{ filter: "drop-shadow(0 0 4px #ec4899)" }}
              initial={{ strokeDashoffset: 200 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{
                repeat: Infinity,
                duration: speed * 1.5,
                ease: "linear"
              }}
            />
          </svg>
        </div>
      )}

      {/* Floating particles layer */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute pointer-events-none z-20"
            style={{ 
              left: `calc(50% + ${p.x}px)`, 
              bottom: "55%" 
            }}
            initial={{ y: 0, scale: 0.5, opacity: 1, rotate: 0 }}
            animate={{ y: -220, scale: 1.5, opacity: 0, rotate: Math.random() * 90 - 45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3, ease: "easeOut" }}
          >
            <svg className="w-6 h-6 fill-pink-500 text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.7)]" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="lock-state"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.93 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center space-y-6 z-10 w-full"
          >
            <div className="space-y-1">
              <span className="text-[10px] text-pink-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5 justify-center">
                <Activity className="w-3.5 h-3.5 animate-pulse" /> Sync Connection
              </span>
              <h4 className="text-sm font-semibold text-zinc-400">
                Tap the heart 5 times to align frequencies
              </h4>
            </div>

            {/* Pulsating Beating Heart Button */}
            <motion.button
              onClick={handleTap}
              whileTap={{ scale: 0.88, rotate: -2 }}
              className="relative focus:outline-none cursor-pointer flex items-center justify-center group h-44 w-44"
            >
              {/* Outer rotating concentric orbits */}
              <div className="absolute w-[180px] h-[180px] rounded-full border border-dashed border-pink-500/20 animate-spin [animation-duration:12s] pointer-events-none z-0" />
              <div className="absolute w-[205px] h-[205px] rounded-full border border-dashed border-purple-500/15 animate-spin [animation-duration:18s] reverse pointer-events-none z-0" />

              {/* Glow backdrop ring */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600/30 blur-2xl opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500 z-0 animate-pulse" />
              
              {/* Expanding Click Ripples */}
              <AnimatePresence>
                {ripples.map((ripple) => (
                  <motion.div
                    key={ripple.id}
                    className="absolute rounded-full border border-pink-500/50 bg-pink-500/10 pointer-events-none z-0"
                    initial={{ width: 110, height: 110, opacity: 0.95 }}
                    animate={{ width: 240, height: 240, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                ))}
              </AnimatePresence>

              {/* Main Beating Circle Frame */}
              <motion.div
                className="w-32 h-32 rounded-full border-2 border-pink-500/40 bg-gradient-to-b from-pink-950/40 to-purple-950/40 flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(236,72,153,0.3),inset_0_2px_8px_rgba(255,255,255,0.1)] group-hover:border-pink-400 group-hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm"
                animate={{
                  scale: [1, 1.15, 1.06, 1.22, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: speed,
                  ease: "easeInOut",
                }}
              >
                <svg 
                  className="w-16 h-16 transition-all duration-300 group-hover:scale-110" 
                  viewBox="0 0 24 24"
                  style={{ filter: "drop-shadow(0 0 10px rgba(244,63,94,0.85))" }}
                >
                  <defs>
                    <radialGradient id="liquidHeartGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ff4b91" />
                      <stop offset="75%" stopColor="#f43f5e" />
                      <stop offset="100%" stopColor="#9f1239" />
                    </radialGradient>
                  </defs>
                  <path 
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="url(#liquidHeartGlow)"
                  />
                </svg>
              </motion.div>

              {/* Remaining click badge */}
              <span className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs flex items-center justify-center border-[3px] border-zinc-950 shadow-[0_0_15px_rgba(236,72,153,0.5)] z-20 animate-bounce">
                {5 - taps}
              </span>
            </motion.button>

            {/* Glowing neon progress track */}
            <div className="w-full max-w-[180px] h-1.5 rounded-full bg-zinc-950/80 border border-white/5 overflow-hidden relative shadow-[0_0_10px_rgba(236,72,153,0.15)] mx-auto mt-2">
              <motion.div 
                className="h-full bg-gradient-to-r from-pink-500 to-rose-400"
                style={{ filter: "drop-shadow(0 0 3px #ec4899)" }}
                animate={{ width: `${(taps / 5) * 100}%` }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
              />
            </div>

            <p className="text-xs font-mono text-zinc-500 tracking-wider">
              {taps === 0
                ? "TAP TO INITIATE PROTOCOL"
                : `SYNCHRONIZING RHYTHM... (${taps}/5)`}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="unlock-state"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6 text-center z-10 w-full py-4 px-2"
          >
            {/* Glowing sparkle icon wrapper */}
            <div className="w-14 h-14 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mx-auto shadow-[0_0_20px_rgba(236,72,153,0.2)]">
              <Sparkles className="w-7 h-7 animate-pulse text-pink-400" />
            </div>

            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-widest text-pink-400 font-extrabold block">
                💓 Frequency Aligned
              </span>
              
              {/* Message quote box */}
              <div className="relative p-6 rounded-2xl border border-pink-500/30 bg-gradient-to-b from-pink-950/20 to-purple-950/20 shadow-[0_0_20px_rgba(236,72,153,0.15)] max-w-sm mx-auto">
                <p 
                  className="text-lg sm:text-xl font-semibold text-pink-100 leading-relaxed italic drop-shadow-[0_0_10px_rgba(236,72,153,0.3)]"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  "{message}"
                </p>
              </div>
            </div>

            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black tracking-widest">
              SealedVibeion Channel Open
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
