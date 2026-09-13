"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Missing or invalid password reset token. Please request a new link.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password.");
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
          <h2 className="text-2xl font-bold text-white pt-2 font-serif italic">Set New Password</h2>
          <p className="text-xs text-slate-300 font-light">Choose a strong, secure new password for your account.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-6 rounded-3xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <div>
              <h4 className="text-lg font-bold text-white font-serif italic">Password Updated!</h4>
              <p className="text-xs text-slate-300 font-light leading-relaxed mt-1">
                Your password has been reset successfully. You can now log into your account with your new credentials.
              </p>
            </div>
            <div className="pt-2">
              <Link 
                href="/login" 
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 text-black font-black text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-xl shadow-amber-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Sign In Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="New Password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-black/60 border border-white/10 focus:border-amber-400 outline-none text-xs text-white placeholder-slate-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/60 border border-white/10 focus:border-amber-400 outline-none text-xs text-white placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-950/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save New Password <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#06050e] text-white flex items-center justify-center text-xs">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
