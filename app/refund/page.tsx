"use client";

import Link from "next/link";
import { RefreshCcw, ArrowLeft, Heart } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#050510] text-slate-200 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link href="/" className="flex items-center gap-3.5 cursor-pointer group" title="Return to SealedVibe Home">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/25 via-pink-500/20 to-purple-600/25 border border-amber-400/40 p-0.5 flex items-center justify-center shadow-xl shadow-amber-950/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[14px] bg-[#0c0a18] flex items-center justify-center">
                <Heart className="w-4 h-4 text-amber-400 fill-amber-400/20 transition-transform group-hover:scale-110" />
              </div>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-white to-pink-200 bg-clip-text text-transparent block font-serif">
                SealedVibe
              </span>
              <span className="text-[8px] uppercase tracking-[0.25em] text-slate-400 font-bold block -mt-0.5">
                Luxury Digital Keepsakes
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <RefreshCcw className="w-3.5 h-3.5" /> Cancellation & Refunds
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Refund and Cancellation Policy</h1>
          <p className="text-xs text-slate-400">Last Updated: August 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <h2 className="text-lg font-bold text-white">1. Digital Token Delivery</h2>
            <p>
              Tokens purchased on SealedVibe are credited to your user account instantly upon successful payment verification.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <h2 className="text-lg font-bold text-white">2. Refund Eligibility</h2>
            <p>
              If an error occurs during payment or if purchased tokens are not credited to your account due to a technical glitch, we will issue a full refund within 5–7 business days to your original payment method (Bank Account / UPI / Card).
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <h2 className="text-lg font-bold text-white">3. How to Request a Refund</h2>
            <p>
              To request assistance or report a transaction issue, please email our support team with your registered email and Razorpay payment ID at:{" "}
              <a href="mailto:adnanajmeri70@gmail.com" className="text-emerald-400 underline">
                adnanajmeri70@gmail.com
              </a>.
            </p>
          </section>
        </div>

        <div className="text-center pt-8 border-t border-white/10 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} SealedVibe • All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
