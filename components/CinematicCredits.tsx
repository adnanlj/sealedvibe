"use client";

import { Heart } from "lucide-react";

interface CreditsProps {
  credits: {
    writer: string;
    cast: string[];
  };
}

export default function CinematicCredits({ credits, accentColor }: CreditsProps & { accentColor?: string }) {
  const protagonist = credits?.cast?.[0] || credits?.writer || "Creator";
  const coStar = credits?.cast?.[1] || "Recipient";

  return (
    <div className="w-full max-w-sm mx-auto text-center space-y-8 py-16 text-slate-400 select-none">
      <div className="w-16 h-[1px] bg-white/10 mx-auto" />

      {/* Writer Credits */}
      <div className="space-y-1">
        <h5 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Created By</h5>
        <p className="text-sm font-bold text-slate-200">{protagonist}</p>
      </div>

      {/* Starring Roles Credits */}
      <div className="space-y-1">
        <h5 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Starring</h5>
        <p className="text-sm font-bold text-slate-200 flex justify-center gap-2 items-center">
          <span>{protagonist}</span>
          <Heart className="w-3.5 h-3.5" style={{ color: accentColor || "#a855f7", fill: accentColor ? `${accentColor}20` : "rgba(168,85,247,0.2)" }} />
          <span>{coStar}</span>
        </p>
      </div>

      <div className="w-16 h-[1px] bg-white/10 mx-auto" />
      <p className="text-[10px] uppercase tracking-widest text-slate-600 font-extrabold">Fin • The End</p>
    </div>
  );
}
