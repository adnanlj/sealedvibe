"use client";

import { useState, useRef } from "react";
import { Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface PolaroidPhotoProps {
  caption: string;
  imageUrl?: string;
  onFlip?: () => void;
}

export default function PolaroidPhoto({ caption, imageUrl, onFlip }: PolaroidPhotoProps) {
  const [flipped, setFlipped] = useState<boolean>(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse tilt & shine highlight handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || flipped) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Relative mouse position
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Displacement from card center
    const mouseX = x - width / 2;
    const mouseY = y - height / 2;

    // Dynamic 3D rotation angles (cap at 15 degrees)
    const rotateX = -(mouseY / (height / 2)) * 15;
    const rotateY = (mouseX / (width / 2)) * 15;

    setTilt({ x: rotateX, y: rotateY });

    // Track glare overlay percentages
    const glareX = (x / width) * 100;
    const glareY = (y / height) * 100;
    setGlare({ x: glareX, y: glareY, opacity: 0.55 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center select-none relative pt-4 pb-2">
      <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-extrabold mb-5 flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-yellow-500/80 animate-pulse" /> Hover to Tilt • Click to Flip Card
      </span>

      {/* 3D Card Perspective Wrapper */}
      <div
        className="w-72 sm:w-80 h-[430px] sm:h-[460px] cursor-pointer relative group"
        style={{ perspective: "1500px" }}
        onClick={() => {
          setFlipped(!flipped);
          if (onFlip) onFlip();
        }}
      >
        {/* Decorative Tape holding the polaroid on screen */}
        <div 
          className="absolute top-[-16px] left-1/2 transform -translate-x-1/2 z-30 w-28 h-6 bg-yellow-100/15 border-x border-yellow-200/10 backdrop-blur-[2.5px] shadow-[0_2px_8px_rgba(0,0,0,0.15)] -rotate-2 group-hover:rotate-0 transition-all duration-300"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 10px, rgba(250,235,215,0.15) 10px, rgba(250,235,215,0.15) 20px)"
          }}
        />

        {/* Rotatable Card Container */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full rounded-2xl relative transition-transform duration-700 ease-out shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped
              ? "rotateY(180deg)"
              : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {/* Card Front: Polaroid Frame with Photo */}
          <div
            className={`absolute inset-0 bg-[#FAF9F5] rounded-2xl p-5 shadow-2xl flex flex-col justify-between border border-neutral-200/60 overflow-hidden ${
              flipped ? "pointer-events-none" : ""
            }`}
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Subtle vintage texture overlay on polaroid paper */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />

            {/* Specular Shine/Glare Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 mix-blend-overlay"
              style={{
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 80%)`,
                opacity: glare.opacity,
              }}
            />

            {/* Aesthetic Photo */}
            <div
              className="w-full h-[280px] sm:h-[310px] rounded-lg bg-neutral-900 overflow-hidden relative border border-neutral-250/40 shadow-inner bg-cover bg-center sepia-[0.08] contrast-[1.04] saturate-[0.96]"
              style={{
                backgroundImage: `url('${imageUrl || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600"}')`
              }}
            >
              {/* Retro photo shadow edges */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
            </div>

            {/* Bottom handwriting caption */}
            <div className="flex-1 flex items-center justify-center pt-3 pb-1">
              <span
                className="text-neutral-800 text-base font-semibold italic text-center w-full tracking-wide truncate"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Our Shared Memory 📸
              </span>
            </div>
          </div>

          {/* Card Back: Handwritten Journal Letter */}
          <div
            className={`absolute inset-0 bg-[#FCFAF7] rounded-2xl p-6 shadow-2xl flex flex-col justify-between border border-neutral-300/60 text-slate-800 overflow-hidden ${
              !flipped ? "pointer-events-none" : ""
            }`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.055) 1px, transparent 1px)",
              backgroundSize: "100% 28px",
            }}
          >
            {/* Lined paper red vertical margin line */}
            <div className="absolute left-9 top-0 bottom-0 w-px bg-red-300/40" />

            {/* Letter Header */}
            <div className="flex justify-between items-center border-b border-neutral-200/50 pb-2.5 z-10 pl-6">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-extrabold flex items-center gap-1">
                <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> Handwritten Note
              </span>
              <span className="text-[9px] font-mono text-slate-400">SYNC.01</span>
            </div>

            {/* Ruled letter body */}
            <div 
              className="flex-1 pt-4 pl-6 z-10 overflow-y-auto pr-1.5 scrollbar-thin max-h-[285px]"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              <p
                className="text-sm sm:text-base leading-[28px] text-neutral-800 font-semibold italic text-left whitespace-pre-wrap break-words"
                style={{ fontFamily: "Georgia, serif" }}
              >
                "{caption}"
              </p>
            </div>

            {/* Click to flip back badge */}
            <div className="text-[8px] text-slate-400 text-center font-bold tracking-widest uppercase border-t border-neutral-200/40 pt-3 z-10">
              Click to Flip Back
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
