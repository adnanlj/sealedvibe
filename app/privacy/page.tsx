"use client";

import Link from "next/link";
import { Shield, ArrowLeft, Heart } from "lucide-react";

export default function PrivacyPolicyPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            <Shield className="w-3.5 h-3.5" /> Privacy & Data Protection
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Last Updated: August 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
            <p>
              When you use SealedVibe to generate personalized interactive websites or wedding invitations, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>Account information (Name, Email address, Encrypted Passwords).</li>
              <li>Input details provided for customized website creation (Recipient names, story prompts, preferences).</li>
              <li>Transaction receipts and token purchases processed securely via Razorpay.</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <h2 className="text-lg font-bold text-white">2. How We Use Your Data</h2>
            <p>
              Your data is strictly utilized to generate, host, and deliver your private personalized links, facilitate RSVP and visitor tracking receipts, and manage your token credits. We do not sell your personal data to any third parties.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <h2 className="text-lg font-bold text-white">3. Payment & Financial Security</h2>
            <p>
              All payment transactions are processed through Razorpay’s PCI-DSS compliant payment gateway. SealedVibe does not store or access your credit card numbers, CVVs, or UPI PINs.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <h2 className="text-lg font-bold text-white">4. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, please contact our support team at:{" "}
              <a href="mailto:adnanajmeri70@gmail.com" className="text-indigo-400 underline">
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
