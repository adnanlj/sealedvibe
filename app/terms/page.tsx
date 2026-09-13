"use client";

import Link from "next/link";
import { FileText, ArrowLeft, Heart } from "lucide-react";

export default function TermsOfServicePage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <FileText className="w-3.5 h-3.5" /> Terms & User Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Terms of Service</h1>
          <p className="text-xs text-slate-400">Last Updated: August 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <h2 className="text-lg font-bold text-white">1. Business Category & Service Description</h2>
            <p>
              SealedVibe is a software-as-a-service (SaaS) and digital creative goods platform specializing in customizable digital greeting cards, interactive wedding & anniversary invitations, and event RSVP tracking tools.
            </p>
            <p className="text-xs text-slate-400">
              Note: SealedVibe is a digital greeting card and creative design service. We do not provide web hosting server infrastructure, server co-location, domain name registry services, or commercial music streaming services.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <h2 className="text-lg font-bold text-white">2. Token Licensing & Purchases</h2>
            <p>
              Digital invitation generations operate on a token licensing model:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>1 Token grants 1 digital greeting card or wedding invitation creation with permanent link access.</li>
              <li>Tokens are non-transferable and tied to your registered user account.</li>
              <li>Tokens do not expire and remain active in your wallet until utilized.</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <h2 className="text-lg font-bold text-white">3. Acceptable Use</h2>
            <p>
              Users agree not to utilize SealedVibe to create hateful, abusive, defamatory, harassing, or unlawful content. SealedVibe reserves the right to terminate links violating these guidelines.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <h2 className="text-lg font-bold text-white">4. Support & Queries</h2>
            <p>
              For legal inquiries or account support, email us at:{" "}
              <a href="mailto:adnanajmeri70@gmail.com" className="text-amber-400 underline">
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
