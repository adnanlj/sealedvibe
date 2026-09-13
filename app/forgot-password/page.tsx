"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reset link.");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06050e] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Ambient Mesh Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-amber-600/10 via-purple-900/15 to-transparent blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-bl from-pink-600/10 via-indigo-900/15 to-transparent blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gradient-to-b from-[#121024]/95 via-[#0a0815]/95 to-black/95 border border-amber-500/25 backdrop-blur-2xl rounded-[36px] p-8 sm:p-10 shadow-2xl relative z-10 space-y-6"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-t-[36px]" />
        
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group cursor-pointer">
            <div className="p-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-white to-pink-200 bg-clip-text text-transparent font-serif">
              SealedVibe
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white pt-2 font-serif italic">Reset Password</h2>
          <p className="text-xs text-slate-300 font-light">Enter your email to receive a password reset link.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-6 rounded-3xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white font-serif italic">Reset Link Sent</h4>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              If an account exists for <strong className="text-white">{email}</strong>, we've sent a link to choose a new password. Check your inbox!
            </p>
            <div className="pt-2">
              <Link href="/login" className="text-xs text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/60 border border-white/10 focus:border-amber-400 outline-none text-xs text-white placeholder-slate-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-950/40 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>}
            </button>

            <div className="text-center pt-2">
              <Link href="/login" className="text-xs text-slate-400 hover:text-amber-300 inline-flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
