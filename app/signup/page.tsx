"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2, ArrowRight, Gift, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-amber-400", "bg-blue-400", "bg-emerald-400"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create account.");
      if (data.user) {
        try { localStorage.setItem("sealedvibe_user", JSON.stringify(data.user)); } catch (e) {}
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const res = await fetch("/api/auth/google/status");
      const data = await res.json();
      if (!data.configured) {
        setError("Google Sign-In is waiting for GOOGLE_CLIENT_ID in .env.local. You can create an account or sign in with Email & Password below in 5 seconds!");
        return;
      }
      window.location.href = "/api/auth/google";
    } catch (e) {
      window.location.href = "/api/auth/google";
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
          <h2 className="text-2xl font-bold text-white pt-2 font-serif italic">Create Your Account</h2>
          <p className="text-xs text-slate-300 font-light">Join SealedVibe to seal and track private 3D memory websites.</p>
        </div>

        {/* Pricing Ribbon */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center gap-2 text-xs font-bold text-amber-300 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Craft & Seal Private 3D Keepsakes Instantly</span>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Google Button */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3.5 px-4 rounded-2xl bg-white/6 hover:bg-white/12 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.99]"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">or with email</span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                placeholder="Your Name (e.g. Adnan)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/60 border border-white/10 focus:border-amber-400 outline-none text-xs text-white placeholder-slate-500 transition-colors"
              />
            </div>

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

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password (min. 6 characters)"
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

            {/* Password strength meter */}
            {password && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-400">Strength:</span>
                  <span className="text-white font-bold">{strengthLabels[strengthScore]}</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden flex gap-1">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <div
                      key={idx}
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${
                        idx <= strengthScore ? strengthColors[strengthScore] : "bg-zinc-800"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-amber-950/40 hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account & Continue <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-300 font-bold hover:underline">
              Log in instead
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
