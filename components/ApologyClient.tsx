"use client";

import { useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import ApologyScene from "./ApologyScene";
import ApologyOverlay from "./ApologyOverlay";
import WeddingOverlay from "./WeddingOverlay";
import EngagementKeepsake from "./EngagementKeepsake";
import BirthdayPartyInvite from "./BirthdayPartyInvite";
import RomanticProposal from "./RomanticProposal";

interface ApologyClientProps {
  data: {
    slug: string;
    creatorName: string;
    recipientName: string;
    relationshipType?: string;
    occasion: string;
    vibeTheme?: string;
    isLocked?: boolean;
    isPasswordProtected?: boolean;
    endingSurprise?: {
      surpriseType: string;
      surpriseData: any;
    };
    favorites: {
      colorPalette: string[];
      moviesAndSeries?: string[];
      insideJokes?: string[];
    };
    aiGeneratedData: {
      headline?: string;
      apologyNarrative?: string;
      popCultureReferences?: string[];
      themePreset: string;
      characterAttributes?: {
        knownFor: string;
        acclaimedFor: string;
        rememberedFor: string;
      };
      memoriesList?: string[];
      credits?: {
        writer: string;
        cast: string[];
      };
    };
    status?: string;
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
    websiteType?: string;
    weddingData?: any;
    birthdayPartyData?: any;
    proposalData?: any;
  };
}

function ConstellationsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const starsCount = 45;
    const stars: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    for (let i = 0; i < starsCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: 1 + Math.random() * 1.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(96, 165, 250, 0.07)";
      ctx.lineWidth = 0.6;
      for (let i = 0; i < starsCount; i++) {
        for (let j = i + 1; j < starsCount; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 105) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < starsCount; i++) {
        const star = stars[i];
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(219, 234, 254, 0.75)";
        ctx.fill();

        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0 || star.x > width) star.vx *= -1;
        if (star.y < 0 || star.y > height) star.vy *= -1;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />;
}

export default function ApologyClient({ data }: ApologyClientProps) {
  const [clientData, setClientData] = useState<any>(data);
  const [passcode, setPasscode] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isExploding, setIsExploding] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Visit Tracking trigger
  useEffect(() => {
    const logVisit = async () => {
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: clientData.slug }),
        });
      } catch (err) {
        console.error("Failed to log visit tracking:", err);
      }
    };
    logVisit();
  }, [clientData.slug]);

  // If this is a wedding website, directly render the Royal Wedding Invitation Experience!
  if (clientData.websiteType === "wedding" || clientData.occasion === "wedding") {
    return <WeddingOverlay data={clientData} />;
  }

  // If this is an engagement website, directly render the Botanical Garden Engagement Experience!
  if (clientData.websiteType === "engagement" || clientData.occasion === "engagement") {
    return <EngagementKeepsake data={clientData} />;
  }

  // If this is a birthday party website, directly render the Champagne, Pearl & Rose Gold Royale Birthday Experience!
  if (clientData.websiteType === "birthday_party" || clientData.occasion === "birthday_party" || clientData.occasion === "birthday_invite") {
    return <BirthdayPartyInvite data={clientData} />;
  }

  // If this is a romantic proposal website, directly render the Romantic Proposal Experience!
  if (clientData.websiteType === "proposal" || clientData.occasion === "proposal") {
    return <RomanticProposal data={clientData} />;
  }

  // 2. Initialize Lenis Smooth Scroll on load
  useEffect(() => {
    // Only run Lenis if unlocked and not wedding
    if (clientData.isLocked || clientData.websiteType === "wedding") return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [clientData.isLocked]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    setIsUnlocking(true);
    setUnlockError(null);
    try {
      const res = await fetch("/api/verify-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: clientData.slug, passcode }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Incorrect passcode.");
      }
      setClientData(result.data);
    } catch (err: any) {
      setUnlockError(err.message || "Failed to unlock.");
    } finally {
      setIsUnlocking(false);
    }
  };

  const trigger3DExplosion = () => {
    setIsExploding(true);
  };

  const handleExplodeComplete = () => {
    setIsExploding(false);
  };

  const colors = clientData.favorites?.colorPalette || ["#a855f7", "#ec4899", "#3b82f6"];

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

  // Dynamically resolve colors specifically for the passcode overlay screen to match chosen background theme
  const getPasscodeColors = () => {
    const bgType = clientData.backgroundType || "";
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

  const getPasscodeBgClass = () => {
    const bgType = clientData.backgroundType || "";
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

  const passColors = getPasscodeColors();
  const passPrimary = passColors[0];
  const passSecondary = passColors[1] || passColors[0];
  const passBgClass = getPasscodeBgClass();

  if (clientData.websiteType === "wedding") {
    return <WeddingOverlay data={clientData} />;
  }

  return (
    <div className="relative min-h-screen w-full select-none overflow-x-hidden notranslate bg-[#090514]" translate="no">
      
      {/* Dynamic Background Layer */}
      {mounted && (
        <>
          {(!clientData.backgroundType || clientData.backgroundType === "particles") && (
        <div className="absolute inset-0 w-full min-h-screen overflow-hidden bg-[#090514] z-[1]">
          {/* Soft magenta/violet nebula glow behind WebGL */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.12)_0%,rgba(139,92,246,0.08)_50%,transparent_100%)] pointer-events-none" />

          <ApologyScene
            themePreset={clientData.aiGeneratedData.themePreset}
            colorPalette={clientData.favorites.colorPalette}
            isExploding={isExploding}
            onExplodeComplete={handleExplodeComplete}
          />

          {/* Floating magical hearts drifting up */}
          {Array.from({ length: 14 }).map((_, i) => {
            const left = ((i * 19) % 90) + 5;
            const delay = (i * 0.4) % 6;
            const duration = 8 + (i * 1.5) % 10;
            const scale = 0.35 + (i * 0.1) % 0.5;
            return (
              <div
                key={`stardust-heart-${i}`}
                className="heart-petal"
                style={{
                  left: `${left}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  transform: `scale(${scale}) rotate(-45deg)`,
                  top: "-4%",
                  background: `linear-gradient(135deg, ${colors[0] || "#ec4899"} 0%, ${colors[1] || "#8b5cf6"} 100%)`,
                  boxShadow: `0 0 10px ${(colors[0] || "#ec4899")}40`
                }}
              />
            );
          })}

          {/* Golden fairy sparkles floating up */}
          {Array.from({ length: 15 }).map((_, i) => {
            const left = ((i * 23) % 90) + 5;
            const size = 2 + (i % 3);
            const delay = (i * 0.3) % 5.5;
            const duration = 10 + (i * 1.8) % 12;
            return (
              <div
                key={`stardust-gold-${i}`}
                className="fairy-gold-dust"
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}
        </div>
      )}

      {clientData.backgroundType === "aurora" && (
        <div 
          className="bg-aurora animate-fade-in absolute inset-0 w-full min-h-screen z-[1] overflow-hidden" 
          style={{ 
            "--aurora-c1": colors[0] || "#a855f7", 
            "--aurora-c2": colors[1] || "#ec4899" 
          } as React.CSSProperties} 
        >
          {/* Twinkling stardust on top of aurora */}
          {Array.from({ length: 24 }).map((_, i) => {
            const left = ((i * 23) % 94) + 3;
            const top = ((i * 17) % 90) + 5;
            const delay = (i * 0.3) % 4.5;
            const duration = 3 + (i * 0.5) % 3;
            const size = 1.5 + (i % 3);
            return (
              <div
                key={`aurora-star-${i}`}
                className="aurora-star"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}
        </div>
      )}

      {clientData.backgroundType === "cyber_grid" && (
        <div className="cyber-grid-3d animate-fade-in absolute inset-0 w-full min-h-screen z-[1]">
          <div className="cyber-horizon-glow" />
          <div className="cyber-grid-lines" />
        </div>
      )}

      {clientData.backgroundType === "sakura" && (
        <div className="bg-sakura animate-fade-in absolute inset-0 w-full min-h-screen overflow-hidden bg-[#050204] z-[1]">
          <div className="sakura-ambient-glow" />
          {/* Twinkling Pink Stardust Stars */}
          {Array.from({ length: 18 }).map((_, i) => {
            const left = ((i * 23) % 94) + 3;
            const top = ((i * 17) % 90) + 5;
            const delay = (i * 0.4) % 4;
            const duration = 2.5 + (i * 0.6) % 3;
            const size = 3 + (i % 4);
            return (
              <div
                key={`sakura-star-${i}`}
                className="absolute rounded-full bg-pink-200/55 animate-pulse pointer-events-none"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  boxShadow: `0 0 8px rgba(244, 114, 182, 0.75)`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}
          
          {/* Falling Organic Sakura Petals */}
          {Array.from({ length: 32 }).map((_, i) => {
            const left = ((i * 17) % 92) + 4;
            const delay = (i * 0.35) % 5;
            const duration = 8 + (i * 1.5) % 10;
            const scale = 0.4 + (i * 0.1) % 0.55;
            return (
              <div
                key={i}
                className="sakura-petal-organic"
                style={{
                  left: `${left}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  width: `${12 * scale}px`,
                  height: `${15 * scale}px`,
                  top: "-4%",
                }}
              />
            );
          })}
        </div>
      )}

      {/* 1. Floating Paper Lanterns */}
      {clientData.backgroundType === "lanterns" && (
        <div className="bg-lanterns animate-fade-in absolute inset-0 w-full min-h-screen overflow-hidden bg-[#05040a] z-[1]">
          <div className="lantern-vignette" />

          {/* Twinkling romantic stars in background */}
          {Array.from({ length: 15 }).map((_, i) => {
            const left = ((i * 23) % 90) + 5;
            const top = ((i * 13) % 65) + 5;
            const delay = (i * 0.45) % 4;
            return (
              <div
                key={`lantern-star-${i}`}
                className="absolute rounded-full bg-amber-100/40 animate-pulse pointer-events-none z-0"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: "1.5px",
                  height: "1.5px",
                  boxShadow: "0 0 4px rgba(253, 230, 138, 0.4)",
                  animationDuration: `${1.5 + (i % 2) * 0.8}s`,
                  animationDelay: `${delay}s`
                }}
              />
            );
          })}

          {/* Golden crescent moon in the top corner */}
          <div className="absolute top-12 right-12 w-12 h-12 pointer-events-none z-[2]">
            <div className="moon-ambient-halo w-[90px] h-[90px] top-[50%] left-[50%]" style={{ background: "radial-gradient(circle, rgba(253, 230, 138, 0.2) 0%, transparent 70%)" }} />
            <svg className="w-full h-full text-amber-200/90 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] relative z-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.75 16.25A10.75 10.75 0 0 1 12 21.75c-5.94 0-10.75-4.81-10.75-10.75c0-4.14 2.34-7.75 5.8-9.56a10.8 10.8 0 0 0-.3 2.56c0 5.94 4.81 10.75 10.75 10.75c1.65 0 3.2-.37 4.6-1.05c-.4 1.45-1.07 2.76-1.95 3.8z" />
            </svg>
          </div>

          {/* Amber-tinted background clouds drifting behind the lanterns */}
          {Array.from({ length: 3 }).map((_, i) => {
            const width = 300 + (i * 90) % 150;
            const top = (i * 25) + 5;
            const duration = 70 + i * 20;
            const delay = i * -18;
            return (
              <div
                key={`lantern-cloud-${i}`}
                className="absolute pointer-events-none"
                style={{
                  width: `${width}px`,
                  top: `${top}%`,
                  left: "-25vw",
                  animation: `cloud-drift ${duration}s infinite linear`,
                  animationDelay: `${delay}s`,
                  opacity: 0.15,
                  filter: "blur(20px)",
                  mixBlendMode: "screen"
                }}
              >
                <svg viewBox="0 0 200 120" className="w-full h-auto">
                  <defs>
                    <linearGradient id={`lanternCloudGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(251, 146, 60, 0.18)" />
                      <stop offset="50%" stopColor="rgba(168, 85, 247, 0.08)" />
                      <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                    </linearGradient>
                  </defs>
                  <path d="M 25,80 a 30,30 0 0,1 0,-60 a 35,35 0 0,1 65,-10 a 30,30 0 0,1 45,20 a 25,25 0 0,1 0,50 z" fill={`url(#lanternCloudGrad-${i})`} />
                </svg>
              </div>
            );
          })}

          {/* Rising sparks / embers from lanterns */}
          {Array.from({ length: 18 }).map((_, i) => {
            const left = ((i * 19) % 90) + 5;
            const delay = (i * 0.4) % 6;
            const duration = 8 + (i * 1.5) % 10;
            const size = 1.5 + (i % 3) * 1.2;
            return (
              <div
                key={`lantern-spark-${i}`}
                className="lantern-spark"
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}

          {/* Floating Lanterns particles */}
          {Array.from({ length: 24 }).map((_, i) => {
            const left = ((i * 17) % 90) + 5;
            const size = 16 + (i % 4) * 6;
            const delay = (i * 0.45) % 6;
            const duration = 12 + (i * 2) % 12;
            return (
              <div
                key={i}
                className="lantern-particle"
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size * 1.2}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              >
                {/* Glowing Candle Core */}
                <div className="lantern-candle-core" style={{ width: `${size * 0.25}px`, height: `${size * 0.4}px`, bottom: `${size * 0.18}px` }} />
              </div>
            );
          })}

          {/* Cozy silhouetted couple sitting on a hill at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none z-10">
            <svg className="w-full text-[#030206]" viewBox="0 0 1440 120" fill="currentColor" preserveAspectRatio="none" style={{ height: "65px" }}>
              <path d="M0,80 Q360,110 720,80 T1440,70 L1440,120 L0,120 Z" />
              {/* Couple sitting together */}
              <g transform="translate(680, 48) scale(0.65)" fill="currentColor">
                <circle cx="20" cy="20" r="8"/>
                <path d="M 10,28 C 10,25 15,25 20,28 C 25,30 25,45 20,48 C 12,48 5,42 10,28 Z"/>
                <circle cx="35" cy="22" r="7.5"/>
                <path d="M 28,30 C 28,27 33,26 37,29 C 42,31 40,46 35,48 C 28,48 24,43 28,30 Z"/>
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* 2. Raindrops on Glass */}
      {clientData.backgroundType === "raindrops" && (
        <div className="bg-raindrops animate-fade-in absolute inset-0 w-full min-h-screen overflow-hidden bg-[#07080e] z-[1]">
          {/* Light thunderstorm ambient flash layer */}
          <div className="lightning-flash-layer" />

          {/* Fluffy romantic vector clouds */}
          {Array.from({ length: 5 }).map((_, i) => {
            const width = 280 + (i * 80) % 200;
            const top = (i * 18) - 5;
            const duration = 65 + i * 20;
            const delay = i * -15;
            const opacity = 0.35 + (i % 3) * 0.15;
            return (
              <div
                key={`romantic-cloud-svg-${i}`}
                className="absolute pointer-events-none"
                style={{
                  width: `${width}px`,
                  top: `${top}%`,
                  left: "-25vw",
                  animation: `cloud-drift ${duration}s infinite linear`,
                  animationDelay: `${delay}s`,
                  opacity: opacity,
                  filter: "blur(18px)",
                  mixBlendMode: "screen",
                }}
              >
                <svg viewBox="0 0 200 120" className="w-full h-auto">
                  <defs>
                    <linearGradient id={`cloudGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(244, 63, 94, 0.25)" />
                      <stop offset="50%" stopColor="rgba(168, 85, 247, 0.15)" />
                      <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M 25,80 a 30,30 0 0,1 0,-60 a 35,35 0 0,1 65,-10 a 30,30 0 0,1 45,20 a 25,25 0 0,1 0,50 z" 
                    fill={`url(#cloudGrad-${i})`} 
                  />
                </svg>
              </div>
            );
          })}

          {/* Slightly visible wind breeze streaks */}
          {Array.from({ length: 5 }).map((_, i) => {
            const top = 12 + i * 18;
            const delay = i * 1.4;
            const duration = 6 + i * 1.5;
            return (
              <div
                key={`wind-streak-${i}`}
                className="wind-streak"
                style={{
                  top: `${top}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}

          {/* Detailed romantic city bokeh glows */}
          <div className="bokeh-circle bg-[#ec4899]/14 w-[320px] h-[320px] top-[10%] left-[8%] animate-pulse" style={{ animationDuration: "14s" }} />
          <div className="bokeh-circle bg-[#3b82f6]/12 w-[380px] h-[380px] bottom-[5%] right-[10%] animate-pulse" style={{ animationDuration: "18s" }} />
          <div className="bokeh-circle bg-[#a855f7]/10 w-[280px] h-[280px] top-[35%] right-[25%] animate-pulse" style={{ animationDuration: "16s" }} />
          <div className="bokeh-circle bg-amber-500/6 w-[200px] h-[200px] bottom-[30%] left-[15%] animate-pulse" style={{ animationDuration: "12s" }} />
          
          {/* Layer 1: Background Rain (Slow, thin, low opacity) */}
          {Array.from({ length: 30 }).map((_, i) => {
            const left = ((i * 17) % 96) + 2;
            const size = 1.0 + (i % 2) * 0.4; // 1px to 1.4px
            const height = 10 + (i % 3) * 5; // 10px to 20px
            const delay = (i * 0.25) % 6;
            const duration = 2.4 + (i % 3) * 0.4;
            return (
              <div
                key={`rain-bg-${i}`}
                className="glass-raindrop-bg"
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${height}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}

          {/* Layer 2: Midground Rain (Standard drops, focused) */}
          {Array.from({ length: 22 }).map((_, i) => {
            const left = ((i * 23) % 94) + 3;
            const size = 1.6 + (i % 2) * 0.5; // 1.6px to 2.1px
            const height = 18 + (i % 3) * 8; // 18px to 34px
            const delay = (i * 0.35) % 5;
            const duration = 1.5 + (i % 3) * 0.3;
            return (
              <div
                key={`rain-mg-${i}`}
                className="glass-raindrop-mg"
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${height}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}

          {/* Layer 3: Foreground Rain (Large, fast, slightly blurred) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const left = ((i * 31) % 90) + 5;
            const size = 2.4 + (i % 2) * 0.8; // 2.4px to 3.2px
            const height = 28 + (i % 2) * 12; // 28px to 40px
            const delay = (i * 0.5) % 4;
            const duration = 0.95 + (i % 2) * 0.25;
            return (
              <div
                key={`rain-fg-${i}`}
                className="glass-raindrop-fg"
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${height}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}

          {/* Layer 4: Fading Impact Ripples on the bottom */}
          {Array.from({ length: 10 }).map((_, i) => {
            const left = ((i * 29) % 86) + 7;
            const delay = (i * 0.65) % 5.5;
            const duration = 1.8 + (i % 3) * 0.8;
            return (
              <div
                key={`rain-ripple-${i}`}
                className="rain-ripple"
                style={{
                  left: `${left}%`,
                  bottom: `${15 + (i % 3) * 10}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}

          {/* Layer 5: Glass Condensation Tricklers (Slow sliding water drops) */}
          {Array.from({ length: 6 }).map((_, i) => {
            const left = ((i * 37) % 84) + 8;
            const delay = (i * 1.6) % 7;
            const duration = 9 + (i % 3) * 3;
            return (
              <div
                key={`rain-trickle-${i}`}
                className="glass-trickle"
                style={{
                  left: `${left}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}

          {/* Ambient soft mist rise at table level */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-blue-950/15 via-transparent to-transparent pointer-events-none filter blur-sm" />
        </div>
      )}

      {/* 3. Constellations Linker */}
      {clientData.backgroundType === "constellations" && (
        <div className="bg-constellations animate-fade-in absolute inset-0 w-full min-h-screen overflow-hidden bg-[#02010c] z-[1]">
          {/* Midnight sky ambient radial gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.1)_0%,rgba(168,85,247,0.06)_50%,transparent_100%)] pointer-events-none" />

          {/* Glowing Golden Crescent Moon */}
          <div className="absolute top-16 right-16 w-20 h-20 pointer-events-none select-none z-[3]">
            {/* Ambient slow moving glow halo */}
            <div className="moon-ambient-halo w-[140px] h-[140px] top-[50%] left-[50%]" />
            
            {/* Vector Crescent Moon with Lunar Craters */}
            <svg className="w-full h-full text-[#fef3c7] drop-shadow-[0_0_20px_rgba(254,243,199,0.7)] relative z-10" viewBox="0 0 24 24" fill="currentColor">
              {/* Crescent shape */}
              <path d="M21.75 16.25A10.75 10.75 0 0 1 12 21.75c-5.94 0-10.75-4.81-10.75-10.75c0-4.14 2.34-7.75 5.8-9.56a10.8 10.8 0 0 0-.3 2.56c0 5.94 4.81 10.75 10.75 10.75c1.65 0 3.2-.37 4.6-1.05c-.4 1.45-1.07 2.76-1.95 3.8z" />
              {/* Lunar Craters details */}
              <circle cx="8" cy="12" r="1.2" fill="rgba(217, 119, 6, 0.25)" />
              <circle cx="12" cy="16" r="1.8" fill="rgba(217, 119, 6, 0.3)" />
              <circle cx="15" cy="18" r="1" fill="rgba(217, 119, 6, 0.15)" />
              <circle cx="6" cy="10" r="0.8" fill="rgba(217, 119, 6, 0.2)" />
            </svg>
          </div>

          {/* Shooting Stars */}
          <div className="romantic-shooting-star top-[10%] right-[10%]" style={{ animationDelay: "0s" }} />
          <div className="romantic-shooting-star top-[25%] right-[20%]" style={{ animationDelay: "2.8s", animationDuration: "7.5s" }} />
          <div className="romantic-shooting-star top-[40%] right-[5%]" style={{ animationDelay: "4.5s", animationDuration: "9s" }} />

          {/* Twinkling Sparkle Stars */}
          {Array.from({ length: 12 }).map((_, i) => {
            const left = ((i * 29) % 90) + 5;
            const top = ((i * 17) % 55) + 8;
            const size = 6 + (i % 3) * 3; // 6px, 9px, 12px
            const delay = (i * 0.45) % 4;
            const duration = 4.5 + (i * 0.7) % 3;
            return (
              <div
                key={`sparkle-star-${i}`}
                className="sparkle-star"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}

          {/* Dynamic canvas drawing nodes */}
          <ConstellationsCanvas />

          {/* Golden fairy stardust sparkles */}
          {Array.from({ length: 16 }).map((_, i) => {
            const left = ((i * 23) % 90) + 5;
            const size = 1.5 + (i % 3);
            const delay = (i * 0.35) % 5;
            const duration = 8 + (i * 2) % 10;
            return (
              <div
                key={`constell-gold-${i}`}
                className="fairy-gold-dust"
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  opacity: 0.7,
                }}
              />
            );
          })}

          {/* Silhouetted Vector Rolling Hills at the bottom */}
          <svg className="absolute bottom-0 left-0 right-0 w-full text-[#020108] pointer-events-none z-10" viewBox="0 0 1440 120" fill="currentColor" preserveAspectRatio="none" style={{ height: "70px" }}>
            <path d="M0,80 Q360,110 720,80 T1440,70 L1440,120 L0,120 Z" />
          </svg>
        </div>
      )}


      {/* 5. Candlelight Glow */}
      {clientData.backgroundType === "candlelight" && (
        <div className="bg-candlelight animate-fade-in absolute inset-0 w-full min-h-screen overflow-hidden bg-[#0d0705] z-[1]">
          {/* Subtle table-level warm gradient at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[45vh] bg-[linear-gradient(to_top,rgba(251,146,60,0.15)_0%,transparent_100%)] pointer-events-none" />

          {/* Central flickering candlelight halo glow */}
          <div className="candlelight-halo-glow w-[600px] h-[600px] top-[45%] left-1/2" />

          {/* Vector candles at the bottom of the screen */}
          <div className="absolute bottom-0 left-0 right-0 h-44 flex items-end justify-center gap-16 pb-4 pointer-events-none z-10 opacity-90">
            {/* Candle 1 (Left, Medium Height) */}
            <div className="flex flex-col items-center relative select-none">
              {/* Flame */}
              <svg className="w-6 h-10 text-amber-500 animate-flame-sway cursor-none pointer-events-none" viewBox="0 0 20 30" fill="currentColor">
                <path d="M10,0 C13,10 18,15 15,22 C12,28 8,28 5,22 C2,15 7,10 10,0 Z" />
              </svg>
              {/* Wick */}
              <div className="w-[1.5px] h-1.5 bg-black" />
              {/* Candle Body */}
              <div className="w-7 h-20 bg-gradient-to-t from-[#27120a] to-[#7f391b] rounded-t-sm relative border-t border-orange-500/25">
                {/* Wax Drips */}
                <div className="candle-wax-drip left-[3px] h-9 bg-[#7f391b]" />
                <div className="candle-wax-drip left-[8px] h-4 bg-[#7f391b]" />
              </div>
            </div>

            {/* Candle 2 (Center, Tall Pillar) */}
            <div className="flex flex-col items-center relative select-none" style={{ transform: "translateY(-10px)" }}>
              {/* Flame */}
              <svg className="w-7 h-12 text-amber-500 animate-flame-sway cursor-none pointer-events-none" viewBox="0 0 20 30" fill="currentColor" style={{ animationDelay: "0.3s" }}>
                <path d="M10,0 C13,10 18,15 15,22 C12,28 8,28 5,22 C2,15 7,10 10,0 Z" />
              </svg>
              {/* Wick */}
              <div className="w-[1.5px] h-1.5 bg-black" />
              {/* Candle Body */}
              <div className="w-8 h-28 bg-gradient-to-t from-[#2d140b] to-[#8c401f] rounded-t-sm relative border-t border-orange-500/25">
                {/* Wax Drips */}
                <div className="candle-wax-drip left-[4px] h-14 bg-[#8c401f]" />
                <div className="candle-wax-drip right-[5px] h-8 bg-[#8c401f]" />
                <div className="candle-wax-drip left-[12px] h-5 bg-[#8c401f]" />
              </div>
            </div>

            {/* Candle 3 (Right, Short & Stout) */}
            <div className="flex flex-col items-center relative select-none">
              {/* Flame */}
              <svg className="w-5 h-8 text-amber-500 animate-flame-sway cursor-none pointer-events-none" viewBox="0 0 20 30" fill="currentColor" style={{ animationDelay: "0.6s" }}>
                <path d="M10,0 C13,10 18,15 15,22 C12,28 8,28 5,22 C2,15 7,10 10,0 Z" />
              </svg>
              {/* Wick */}
              <div className="w-[1.5px] h-1 bg-black" />
              {/* Candle Body */}
              <div className="w-7 h-14 bg-gradient-to-t from-[#220f08] to-[#6e3015] rounded-t-sm relative border-t border-orange-500/25">
                {/* Wax Drips */}
                <div className="candle-wax-drip right-[4px] h-6 bg-[#6e3015]" />
                <div className="candle-wax-drip left-[6px] h-3 bg-[#6e3015]" />
              </div>
            </div>
          </div>

          {/* Drifting candlelight embers */}
          {Array.from({ length: 32 }).map((_, i) => {
            const left = ((i * 19) % 92) + 4;
            const size = 2 + (i % 4) * 1.1; // size variations (2px, 3.1px, 4.2px, 5.3px)
            const delay = (i * 0.35) % 5;
            const duration = 6 + (i * 1.8) % 10;
            return (
              <div
                key={i}
                className="candle-ember"
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  opacity: size < 3 ? 0.5 : 0.8,
                }}
              />
            );
          })}
        </div>
      )}

      {/* 6. Fairy Forest Fireflies */}
      {clientData.backgroundType === "fireflies" && (
        <div className="bg-fireflies animate-fade-in absolute inset-0 w-full min-h-screen overflow-hidden bg-[#040d06] z-[1]">
          {/* Deep forest green/black vignette gradient wrapper */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,#030a04_100%)] pointer-events-none" />
          
          {/* Soft diagonal moonbeam light shaft */}
          <div className="absolute inset-0 pointer-events-none opacity-25 bg-[linear-gradient(135deg,rgba(253,224,71,0.09)_0%,transparent_55%)] filter blur-md" />

          {/* Glowing mist floating layer */}
          <div className="absolute w-[350px] h-[350px] rounded-full bg-emerald-950/20 blur-[60px] top-[20%] left-[-5%] animate-pulse pointer-events-none" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-green-950/15 blur-[70px] bottom-[10%] right-[-10%] animate-pulse pointer-events-none" style={{ animationDelay: "2s" }} />

          {/* Left hanging SVG foliage branch */}
          <svg className="foliage-left w-[240px] h-[300px] text-emerald-900/65 drop-shadow-[0_10px_15px_rgba(2,44,18,0.5)]" viewBox="0 0 100 120" fill="currentColor">
            <path d="M 0,0 C 25,10 50,5 75,35" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.85" />
            <path d="M 12,5 Q 18,22 10,32 Q 5,18 12,5 Z" fill="rgba(6,78,36,0.85)" />
            <path d="M 28,9 Q 37,28 25,38 Q 18,22 28,9 Z" fill="rgba(6,95,70,0.8)" />
            <path d="M 45,11 Q 57,32 40,42 Q 32,24 45,11 Z" fill="rgba(4,120,87,0.75)" />
            <path d="M 62,20 Q 75,42 55,50 Q 48,32 62,20 Z" fill="rgba(16,185,129,0.55)" />
            <path d="M 73,32 Q 88,55 70,60 Q 62,42 73,32 Z" fill="rgba(52,211,153,0.6)" />
          </svg>

          {/* Right hanging SVG foliage branch */}
          <svg className="foliage-right w-[240px] h-[300px] text-emerald-900/65 drop-shadow-[0_10px_15px_rgba(2,44,18,0.5)]" viewBox="0 0 100 120" fill="currentColor">
            <path d="M 100,0 C 75,10 50,5 25,35" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.85" />
            <path d="M 88,5 Q 82,22 90,32 Q 95,18 88,5 Z" fill="rgba(6,78,36,0.85)" />
            <path d="M 72,9 Q 63,28 75,38 Q 82,22 72,9 Z" fill="rgba(6,95,70,0.8)" />
            <path d="M 55,11 Q 43,32 60,42 Q 68,24 55,11 Z" fill="rgba(4,120,87,0.75)" />
            <path d="M 38,20 Q 25,42 45,50 Q 52,32 38,20 Z" fill="rgba(16,185,129,0.55)" />
            <path d="M 27,32 Q 12,55 30,60 Q 38,42 27,32 Z" fill="rgba(52,211,153,0.6)" />
          </svg>

          {/* Drifting Forest Fireflies (Lime-Green particles) - Vertical */}
          {Array.from({ length: 20 }).map((_, i) => {
            const left = ((i * 17) % 92) + 4;
            const size = 1.5 + (i % 4) * 1.1; // Varied sizes (1.5px, 2.6px, 3.7px, 4.8px)
            const delay = (i * 0.45) % 6;
            const duration = 9 + (i * 2.2) % 11;
            return (
              <div
                key={`firefly-green-${i}`}
                className="forest-firefly-sine"
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  opacity: size < 2.5 ? 0.5 : 0.85,
                }}
              />
            );
          })}

          {/* Side-crossing Fireflies (Lime-Green particles) - Left to Right */}
          {Array.from({ length: 6 }).map((_, i) => {
            const top = 10 + i * 15 + ((i * 7) % 8);
            const size = 2 + (i % 3) * 1.5; // Varied sizes (2px, 3.5px, 5px)
            const delay = (i * 1.2) % 5;
            const duration = 10 + (i * 1.8) % 6;
            return (
              <div
                key={`firefly-side-l-${i}`}
                className="firefly-side-left"
                style={{
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  opacity: size < 3 ? 0.6 : 0.9,
                }}
              />
            );
          })}

          {/* Side-crossing Fireflies (Lime-Green particles) - Right to Left */}
          {Array.from({ length: 6 }).map((_, i) => {
            const top = 15 + i * 13 + ((i * 5) % 8);
            const size = 1.8 + (i % 3) * 1.6; // Varied sizes (1.8px, 3.4px, 5px)
            const delay = (i * 1.5) % 5.5;
            const duration = 11 + (i * 1.5) % 7;
            return (
              <div
                key={`firefly-side-r-${i}`}
                className="firefly-side-right"
                style={{
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  opacity: size < 3 ? 0.6 : 0.9,
                }}
              />
            );
          })}

          {/* Drifting Golden Fairy Dust Sparkles (Yellow particles) */}
          {Array.from({ length: 24 }).map((_, i) => {
            const left = ((i * 13) % 90) + 5;
            const size = 2 + (i % 3);
            const delay = (i * 0.35) % 5.5;
            const duration = 12 + (i * 2) % 14;
            return (
              <div
                key={`fairy-gold-${i}`}
                className="fairy-gold-dust"
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Floating Hearts Overlay for Anniversary */}
      {clientData.occasion === "anniversary" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2] bg-rose-950/[0.03]">
          {Array.from({ length: 24 }).map((_, i) => {
            const left = ((i * 13) % 94) + 3;
            const delay = (i * 0.45) % 5;
            const duration = 6 + (i * 1.5) % 10;
            const scale = 0.3 + (i * 0.1) % 0.65;
            return (
              <div
                key={i}
                className="heart-petal"
                style={{
                  left: `${left}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  transform: `scale(${scale}) rotate(-45deg)`,
                  top: "-4%",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Floating Balloons Overlay for Birthday */}
      {clientData.occasion === "birthday" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
          {Array.from({ length: 20 }).map((_, i) => {
            const left = ((i * 14) % 94) + 3;
            const delay = (i * 0.5) % 6;
            const duration = 8 + (i * 1.8) % 12;
            const scale = 0.4 + (i * 0.12) % 0.7;
            
            // Random balloon colors
            const colorsList = ["#ec4899", "#3b82f6", "#a855f7", "#f59e0b", "#10b981"];
            const bgBg = colorsList[i % colorsList.length];

            return (
              <div
                key={i}
                className="balloon-petal"
                style={{
                  left: `${left}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  transform: `scale(${scale})`,
                  backgroundColor: bgBg,
                  boxShadow: `inset -2px -2px 6px rgba(0,0,0,0.25), 0 4px 10px ${bgBg}20`,
                }}
              />
            );
          })}
        </div>
      )}

      {clientData.backgroundType === "fanbase" && clientData.customBackgroundUrl && (
        <div className="absolute inset-0 overflow-hidden bg-black animate-fade-in">
          <img 
            src={clientData.customBackgroundUrl} 
            alt="Fanbase backdrop" 
            className="w-full h-full object-cover scale-[1.03] pointer-events-none" 
          />
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[6px]" />
        </div>
      )}
        </>
      )}

      {/* Conditional Lock Screen or Overlay */}
      {clientData.isLocked ? (
        <div className={`absolute inset-0 flex items-center justify-center p-4 z-30 ${passBgClass}`}>
          <div 
            className="w-full max-w-md bg-slate-950/70 border border-white/10 rounded-[32px] p-6 sm:p-8 relative overflow-hidden text-center space-y-6 shadow-2xl"
            style={{
              borderColor: `${passPrimary}20`,
              backdropFilter: "blur(12px)",
              boxShadow: `0 25px 60px rgba(0, 0, 0, 0.8), 0 0 45px ${passPrimary}10`
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundImage: `linear-gradient(to right, ${passPrimary}, ${passSecondary})` }} />
            <div 
              className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center border"
              style={{ backgroundColor: `${passPrimary}15`, borderColor: `${passPrimary}25` }}
            >
              <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: passPrimary, filter: `drop-shadow(0 0 4px ${passPrimary}aa)` }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-mono font-bold text-white uppercase tracking-wider">Secure Access Code</h3>
              <p className="text-xs text-slate-450 leading-relaxed font-sans">
                This experience is password protected. Enter the passcode provided by <span className="font-semibold" style={{ color: passPrimary }}>{clientData.creatorName}</span> to unlock.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Secret Passcode</label>
                <input
                  type="password"
                  placeholder="Enter passcode..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  className="w-full px-4 py-3 rounded-xl text-white bg-zinc-900/50 border border-white/10 outline-none font-mono text-center tracking-widest text-sm transition-all"
                  style={isInputFocused ? { borderColor: passPrimary, boxShadow: `0 0 10px ${passPrimary}20` } : {}}
                  autoFocus
                />
              </div>

              {unlockError && (
                <p className="text-xs text-red-400 font-medium text-center animate-pulse">{unlockError}</p>
              )}

              <button
                type="submit"
                disabled={isUnlocking}
                style={{ backgroundImage: `linear-gradient(to right, ${passPrimary}, ${passSecondary})` }}
                className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50 hover:brightness-110"
              >
                {isUnlocking ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Verify & Unlock Experience 🔓"
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (clientData.websiteType === "wedding" || clientData.occasion === "wedding") ? (
        /* Royal Wedding & Event Overlay Layer */
        <WeddingOverlay data={clientData} />
      ) : (clientData.websiteType === "engagement" || clientData.occasion === "engagement") ? (
        /* Botanical Garden Engagement Keepsake Layer */
        <EngagementKeepsake data={clientData} />
      ) : (clientData.websiteType === "birthday_party" || clientData.occasion === "birthday_party") ? (
        /* Midnight Champagne VIP Birthday Party Invitation Layer */
        <BirthdayPartyInvite data={clientData} />
      ) : (clientData.websiteType === "proposal" || clientData.occasion === "proposal") ? (
        /* Romantic Proposal Terrace & Starlight Glass Overlay Layer */
        <RomanticProposal data={clientData} />
      ) : (
        /* Narrative Cards Overlay Layer */
        <ApologyOverlay
          data={clientData}
          onAccept={trigger3DExplosion}
        />
      )}

      {/* Foreground floating fireflies (in front of cards, z-[50]) */}
      {mounted && clientData.backgroundType === "fireflies" && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[50]">
          {/* Vertical rising fireflies in foreground */}
          {Array.from({ length: 10 }).map((_, i) => {
            const left = ((i * 19) % 85) + 8;
            const size = 4.5 + (i % 3) * 1.8; // Varied sizes (4.5px, 6.3px, 8.1px)
            const delay = (i * 0.7) % 6;
            const duration = 7 + (i * 1.5) % 8;
            const isBokeh = size > 6;
            return (
              <div
                key={`fg-firefly-sine-${i}`}
                className="forest-firefly-sine"
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  boxShadow: isBokeh 
                    ? "0 0 16px rgba(163, 230, 53, 0.95), 0 0 32px rgba(163, 230, 53, 0.6)"
                    : "0 0 10px rgba(132, 204, 22, 0.85)",
                  filter: isBokeh ? "blur(0.4px)" : "none",
                }}
              />
            );
          })}

          {/* Left-to-right crossing fireflies in foreground */}
          {Array.from({ length: 5 }).map((_, i) => {
            const top = 10 + i * 18 + ((i * 9) % 10);
            const size = 5 + (i % 2) * 2.5; // Varied sizes (5px, 7.5px)
            const delay = (i * 1.5) % 5;
            const duration = 9 + (i * 2) % 6;
            const isBokeh = size > 6.5;
            return (
              <div
                key={`fg-firefly-left-${i}`}
                className="firefly-side-left"
                style={{
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  boxShadow: isBokeh
                    ? "0 0 16px rgba(163, 230, 53, 0.95), 0 0 32px rgba(163, 230, 53, 0.6)"
                    : "0 0 10px rgba(132, 204, 22, 0.85)",
                  filter: isBokeh ? "blur(0.5px)" : "none",
                }}
              />
            );
          })}

          {/* Right-to-left crossing fireflies in foreground */}
          {Array.from({ length: 5 }).map((_, i) => {
            const top = 15 + i * 16 + ((i * 7) % 10);
            const size = 4.8 + (i % 2) * 2.6; // Varied sizes (4.8px, 7.4px)
            const delay = (i * 1.8) % 6;
            const duration = 10 + (i * 1.5) % 6;
            const isBokeh = size > 6.5;
            return (
              <div
                key={`fg-firefly-right-${i}`}
                className="firefly-side-right"
                style={{
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  boxShadow: isBokeh
                    ? "0 0 16px rgba(163, 230, 53, 0.95), 0 0 32px rgba(163, 230, 53, 0.6)"
                    : "0 0 10px rgba(132, 204, 22, 0.85)",
                  filter: isBokeh ? "blur(0.5px)" : "none",
                }}
              />
            );
          })}
        </div>
      )}

    </div>
  );
}
