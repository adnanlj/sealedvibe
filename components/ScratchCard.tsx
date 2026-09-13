"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface ScratchCardProps {
  secretMessage: string;
}

export default function ScratchCard({ secretMessage }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const scratchCountRef = useRef<number>(0);
  
  const [isScratching, setIsScratching] = useState<boolean>(false);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [scratchProgress, setScratchProgress] = useState<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const width = canvas.width;
      const height = canvas.height;

      // 1. Core metallic gold gradient
      const goldGrad = ctx.createLinearGradient(0, 0, width, height);
      goldGrad.addColorStop(0, "#bf953f");   // Deep antique gold
      goldGrad.addColorStop(0.2, "#fcf6ba");  // Bright pale gold
      goldGrad.addColorStop(0.4, "#b38728");  // Warm yellow gold
      goldGrad.addColorStop(0.6, "#fbf5b7");  // Soft yellow light
      goldGrad.addColorStop(0.8, "#aa771c");  // Golden bronze shadow
      goldGrad.addColorStop(1, "#bf953f");    // Deep antique gold
      ctx.fillStyle = goldGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Add diagonal reflective shine lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
      ctx.lineWidth = 18;
      for (let i = -width; i < width * 2; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + height * 1.5, height);
        ctx.stroke();
      }

      // 3. Add grain/noise to simulate scratch foil texture
      const imgData = ctx.getImageData(0, 0, width, height);
      const pixels = imgData.data;
      for (let i = 0; i < pixels.length; i += 4) {
        const noise = (Math.random() - 0.5) * 35; // noise intensity
        pixels[i] = Math.min(255, Math.max(0, pixels[i] + noise));     // R
        pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1] + noise)); // G
        pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2] + noise)); // B
      }
      ctx.putImageData(imgData, 0, 0);

      // 4. Draw outer gold border frame
      ctx.strokeStyle = "rgba(253, 246, 186, 0.75)";
      ctx.lineWidth = 3;
      ctx.strokeRect(6, 6, width - 12, height - 12);

      // Inner dashed border
      ctx.strokeStyle = "rgba(212, 175, 55, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 5]);
      ctx.strokeRect(14, 14, width - 28, height - 28);
      ctx.setLineDash([]); // Reset line dash

      // 5. Draw decorative corner sparkles
      const drawCornerSparkle = (cx: number, cy: number, size: number) => {
        ctx.fillStyle = "rgba(253, 246, 186, 0.95)";
        ctx.beginPath();
        ctx.moveTo(cx, cy - size);
        ctx.quadraticCurveTo(cx, cy, cx + size, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy + size);
        ctx.quadraticCurveTo(cx, cy, cx - size, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy - size);
        ctx.fill();
      };
      
      drawCornerSparkle(30, 30, 8);
      drawCornerSparkle(width - 30, 30, 8);
      drawCornerSparkle(30, height - 30, 8);
      drawCornerSparkle(width - 30, height - 30, 8);

      // 6. Draw central title/badge
      const badgeW = 260;
      const badgeH = 64;
      const bx = (width - badgeW) / 2;
      const by = (height - badgeH) / 2;
      
      // Semi-transparent deep gold-black container for badge
      ctx.fillStyle = "rgba(18, 12, 6, 0.88)";
      ctx.beginPath();
      if (typeof (ctx as any).roundRect === "function") {
        (ctx as any).roundRect(bx, by, badgeW, badgeH, 12);
      } else {
        ctx.rect(bx, by, badgeW, badgeH);
      }
      ctx.fill();
      
      ctx.strokeStyle = "rgba(212, 175, 55, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Text inside badge
      ctx.font = "bold 10px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "rgba(253, 246, 186, 0.8)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✨ SECRET REVEAL PROTOCOL ✨", width / 2, height / 2 - 12);

      ctx.font = "bold 14px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("Scratch / Drag to Wipe Clean", width / 2, height / 2 + 10);
    };

    // Initialize after a tiny delay to ensure client-side rendering is ready & dimensions settled
    const timer = setTimeout(initCanvas, 50);
    return () => clearTimeout(timer);
  }, []);

  const checkScratchedPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let cleared = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) cleared++;
    }

    const percentage = (cleared / (pixels.length / 4)) * 100;
    setScratchProgress(Math.floor(percentage));
    
    if (percentage > 30) {
      setRevealed(true);
    }
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (revealed) return;
    setIsScratching(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;
    
    if ("touches" in e) {
      if (!e.touches[0]) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    lastPosRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleEnd = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    setIsScratching(false);
    lastPosRef.current = null;
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!isScratching || revealed || !lastPosRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;
    
    if ("touches" in e) {
      if (!e.touches[0]) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(currentX, currentY);
    ctx.lineWidth = 75; // Expanded brush for a satisfying swipe
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // Throw golden sparks from coin/pointer
    scratchCountRef.current++;
    if (scratchCountRef.current % 6 === 0) {
      confetti({
        particleCount: 5,
        angle: Math.random() * 360,
        spread: 35,
        origin: {
          x: clientX / window.innerWidth,
          y: clientY / window.innerHeight
        },
        colors: ["#bf953f", "#fcf6ba", "#b38728", "#fbf5b7"]
      });
    }

    lastPosRef.current = { x: currentX, y: currentY };
    checkScratchedPercentage();
  };

  return (
    <div 
      ref={containerRef}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      style={{ touchAction: "none" }}
      className="relative w-full max-w-lg h-56 sm:h-64 mx-auto overflow-hidden rounded-2xl gold-card-container flex items-center justify-center p-6 text-center select-none touch-none animate-float"
    >
      {/* Sliding metallic shine overlay */}
      <div className="gold-shine-sweep" />

      {/* Secret message content layer underneath - styled as engraved dark-gold */}
      <motion.div 
        className="flex flex-col items-center justify-center space-y-3.5 z-0 px-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0.25, scale: 0.98 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 rounded-full bg-amber-950/10 border border-amber-900/30 text-amber-900">
          <KeyRound className="w-5 h-5 animate-pulse" />
        </div>
        
        <p 
          className="text-lg sm:text-2xl font-extrabold text-amber-950 tracking-wide leading-relaxed italic max-w-md drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          "{secretMessage}"
        </p>

        <span className="text-[9px] uppercase tracking-widest text-amber-900 font-extrabold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Secret Decrypted
        </span>
      </motion.div>

      {/* Scratch Foil Canvas overlay */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onMouseMove={handleMove}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        onTouchMove={handleMove}
        style={{ touchAction: "none" }}
        className={`absolute inset-0 w-full h-full cursor-crosshair rounded-2xl transition-all duration-750 ease-out z-10 ${
          revealed ? "opacity-0 pointer-events-none scale-105 filter blur-sm" : "opacity-100 scale-100"
        }`}
      />

      {/* Scratch progress HUD */}
      {!revealed && scratchProgress > 0 && (
        <div className="absolute bottom-3 right-4 px-2.5 py-1 rounded bg-black/75 border border-white/10 text-[9px] font-mono text-yellow-400 z-30 tracking-wider">
          UNCOVERED: {scratchProgress}%
        </div>
      )}
    </div>
  );
}
