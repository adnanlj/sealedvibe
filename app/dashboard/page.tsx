"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Sparkles,
  Coins,
  Crown, 
  Eye, 
  Lock, 
  Calendar,
  Users,
  Gift, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  Plus, 
  LogOut, 
  User as UserIcon, 
  Activity, 
  Flame, 
  Cake, 
  Compass, 
  RefreshCw,
  Clock,
  ShieldCheck,
  AlertCircle,
  Sparkle,
  Radio,
  ArrowRight,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import TokenStoreModal from "@/components/TokenStoreModal";

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("sealedvibe_user");
        return cached ? JSON.parse(cached) : null;
      } catch (e) {}
    }
    return null;
  });
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tokenStoreOpen, setTokenStoreOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchSessionAndWebsites();
  }, []);

  const fetchSessionAndWebsites = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Verify user session
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();

      if (!meData.loggedIn) {
        try { localStorage.removeItem("sealedvibe_user"); } catch (e) {}
        router.push("/login");
        return;
      }
      setUser(meData.user);
      try { localStorage.setItem("sealedvibe_user", JSON.stringify(meData.user)); } catch (e) {}

      // 2. Fetch user's websites
      const webRes = await fetch("/api/websites");
      const webData = await webRes.json();

      if (webRes.ok && webData.websites) {
        setWebsites(webData.websites);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      try { localStorage.removeItem("sealedvibe_user"); } catch (e) {}
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleCopyLink = async (slug: string) => {
    const url = `${window.location.origin}/p/${slug}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to permanently delete this website? This action cannot be undone.")) {
      return;
    }

    setDeletingSlug(slug);
    try {
      const res = await fetch("/api/websites/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete website.");
      }

      setWebsites((prev) => prev.filter((w) => w.slug !== slug));
    } catch (err: any) {
      alert(err.message || "Failed to delete website.");
    } finally {
      setDeletingSlug(null);
    }
  };

  const getOccasionIcon = (occasion: string) => {
    switch ((occasion || "").toLowerCase()) {
      case "wedding":
        return <Gift className="w-4 h-4 text-amber-400" />;
      case "engagement":
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case "birthday":
        return <Cake className="w-4 h-4 text-pink-400" />;
      case "appreciation":
        return <Sparkles className="w-4 h-4 text-teal-400" />;
      case "anniversary":
        return <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />;
      default:
        return <Flame className="w-4 h-4 text-orange-400" />;
    }
  };

  const formatOccasionName = (occasion: string) => {
    switch ((occasion || "").toLowerCase()) {
      case "wedding": return "Royal Wedding Invitation";
      case "engagement": return "Botanical Engagement";
      case "birthday": return "Birthday Celebration";
      case "appreciation": return "Gratitude & Appreciation";
      case "anniversary": return "Anniversary Milestone";
      default: return "Apology & Reconciliation";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06050e] text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        <p className="text-xs text-amber-300/80 uppercase tracking-widest font-mono">Loading Creator Command Center...</p>
      </div>
    );
  }

  const totalOpened = websites.filter(w => !!w.openedAt).length;
  const totalRsvps = websites.reduce((acc, site) => {
    if (site.occasion === "wedding" || (site as any).websiteType === "wedding" || site.occasion === "engagement" || (site as any).websiteType === "engagement") {
      const confirmed = (site as any).weddingData?.guestRsvps?.filter((r: any) => r.attendance === "attending")?.reduce((sum: number, r: any) => sum + (Number(r.headcount) || 1), 0) || 0;
      return acc + confirmed;
    }
    if (site.dateInvitation?.enabled && site.dateInvitation?.response === "accepted") {
      return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <div className="min-h-screen bg-[#06050e] text-slate-100 font-sans flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      
      {/* 🔮 Luxury Ambient Mesh Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-amber-600/10 via-purple-900/15 to-transparent blur-[140px]" />
        <div className="absolute top-[35%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-bl from-pink-600/10 via-indigo-900/15 to-transparent blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* 🧭 Top Luxury Glass Navigation Bar */}
      <header className="w-full px-3 sm:px-6 py-2.5 sm:py-4 z-40 sticky top-0 bg-[#06050e]/85 backdrop-blur-2xl border-b border-white/8 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-white text-xs font-bold transition-all shadow-sm group cursor-pointer"
              title="Return to Landing Page"
            >
              <ChevronLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>

            <Link href="/" className="flex items-center gap-2 sm:gap-3.5 cursor-pointer group" title="Return to SealedVibe Home">
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500/25 via-pink-500/20 to-purple-600/25 border border-amber-400/40 p-0.5 flex items-center justify-center shadow-xl shadow-amber-950/30 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-[10px] sm:rounded-[14px] bg-[#0c0a18] flex items-center justify-center">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400/20 transition-transform group-hover:scale-110" />
                </div>
                <span className="absolute -top-1 -right-1 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-amber-400 animate-ping" />
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-white to-pink-200 bg-clip-text text-transparent block font-serif">
                  SealedVibe
                </span>
                <span className="hidden sm:block text-[9px] uppercase tracking-[0.25em] text-slate-400 font-bold -mt-1">
                  Luxury Digital Keepsakes
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Admin Portal Button */}
            {user?.isAdmin && (
              <Link
                href="/admin"
                className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-extrabold text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1 transition-all shadow-md"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" /> <span className="hidden sm:inline">Admin Portal</span><span className="sm:hidden">Admin</span>
              </Link>
            )}

            {/* Token Balance & Store Button */}
            <button
              onClick={() => setTokenStoreOpen(true)}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-mono font-bold text-[11px] sm:text-xs flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-950/20"
              title="Open Token Store"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" /> {user?.tokens ?? 1} <span className="hidden sm:inline">Token{(user?.tokens ?? 1) !== 1 ? "s" : ""}</span>
              <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1 py-0.2 rounded font-sans font-black">+</span>
            </button>

            {/* Create Website CTA */}
            <Link
              href="/"
              className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 shadow-xl shadow-amber-950/40 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Create Website</span><span className="sm:hidden">Create</span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-white text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              title="Sign Out / Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* 📊 Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full flex-1 z-10 space-y-6 sm:space-y-8">
        
        {/* Executive Welcome Bento Banner */}
        <div className="p-8 sm:p-10 rounded-[36px] bg-gradient-to-b from-[#121024]/90 via-[#0a0815]/95 to-black/95 border border-amber-500/25 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between gap-8 items-start lg:items-center">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
          
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-300 uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-amber-400" /> Creator Command Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-serif italic">
              Welcome, {user?.name || "Creator"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Manage your private 3D websites, monitor real-time read receipts, and view live guest RSVP confirmations.
            </p>
          </div>

          {/* 4 Bento Analytics Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <button
              onClick={() => setTokenStoreOpen(true)}
              className="p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-center transition-all cursor-pointer group shadow-lg shadow-amber-950/30"
            >
              <span className="text-2xl font-black text-amber-300 block font-mono group-hover:scale-110 transition-transform">{user?.tokens ?? 1}</span>
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-black flex items-center justify-center gap-1 mt-1">
                <Coins className="w-3 h-3 text-amber-400" /> Tokens Available
              </span>
            </button>

            <div className="p-4 rounded-2xl bg-white/4 border border-white/8 text-center backdrop-blur-md">
              <span className="text-2xl font-black text-white block font-mono">{websites.length}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mt-1">Websites</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/4 border border-white/8 text-center backdrop-blur-md">
              <span className="text-2xl font-black text-emerald-400 block font-mono">{totalOpened}</span>
              <span className="text-[10px] uppercase tracking-wider text-emerald-400/90 font-bold block mt-1">Opened</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/4 border border-white/8 text-center backdrop-blur-md">
              <span className="text-2xl font-black text-pink-400 block font-mono">{totalRsvps}</span>
              <span className="text-[10px] uppercase tracking-wider text-pink-400/90 font-bold block mt-1">RSVPs</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 💌 Websites Grid */}
        {websites.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-[36px] bg-white/2 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto text-amber-400 shadow-xl">
              <Heart className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-serif italic">No Websites Sealed Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-light leading-relaxed">
                Build your first personalized 3D keepsake for a wedding invitation, apology, birthday wish, or milestone celebration.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 text-black font-black text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-xl shadow-amber-950/40 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" /> Start Building Now
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map((site) => {
              const isOpened = !!site.openedAt;
              const hasRsvp = site.dateInvitation?.enabled;
              const rsvpStatus = site.dateInvitation?.response;
              const isBirthdayParty = site.occasion === "birthday_party" || (site as any).websiteType === "birthday_party";
              const isProposal = site.occasion === "proposal" || (site as any).websiteType === "proposal";
              const isWeddingOrEngagement = (site.occasion === "wedding" || (site as any).websiteType === "wedding" || site.occasion === "engagement" || (site as any).websiteType === "engagement") && !isBirthdayParty && !isProposal;

              return (
                <div
                  key={site.slug}
                  className="rounded-[30px] bg-gradient-to-b from-white/6 via-[#0c0a18]/90 to-black border border-white/10 hover:border-amber-500/40 transition-all p-7 flex flex-col justify-between space-y-6 relative overflow-hidden group shadow-2xl"
                >
                  {/* Subtle top glowing stripe */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/20 via-yellow-400/40 to-amber-500/20 group-hover:from-amber-500 group-hover:via-yellow-400 group-hover:to-amber-500 transition-all" />

                  {/* Header info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/8 text-amber-300">
                        {getOccasionIcon(site.occasion)}
                        {formatOccasionName(site.occasion)}
                      </span>

                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(site.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors font-serif">
                        For {site.recipientName || "Recipient"}
                      </h3>
                      <p className="text-xs text-slate-400 truncate mt-0.5 font-light">
                        {site.aiGeneratedData?.headline || (isProposal ? "Romantic Proposal & Forever Love Pact" : (isWeddingOrEngagement ? "Botanical / Royal Digital Invitation" : (isBirthdayParty ? "VIP Birthday Party Invitation" : "Personal Keepsake")))}
                      </p>
                    </div>
                  </div>

                  {/* Live Status Indicators */}
                  <div className="grid grid-cols-2 gap-2 text-left">
                    
                    {/* Read Receipt Status */}
                    <div className="p-3 rounded-2xl bg-black/60 border border-white/6 space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                        <Eye className="w-3 h-3 text-slate-400" /> Open Status
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isOpened ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "bg-zinc-600"}`} />
                        <span className={`text-xs font-black ${isOpened ? "text-emerald-400" : "text-zinc-500"}`}>
                          {isOpened ? "Opened" : "Unopened"}
                        </span>
                      </div>
                    </div>

                    {/* Proposal Status Indicator */}
                    {isProposal ? (
                      (() => {
                        const proposalResponse = (site as any).proposalData?.responseStatus;
                        return (
                          <div className="p-3 rounded-2xl bg-rose-950/25 border border-rose-500/25 space-y-1">
                            <span className="text-[9px] uppercase tracking-wider text-rose-300 font-bold flex items-center gap-1">
                              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> Proposal Answer
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${proposalResponse === "accepted" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : proposalResponse === "declined" ? "bg-red-400" : "bg-amber-400"}`} />
                              <span className={`text-xs font-black ${proposalResponse === "accepted" ? "text-emerald-300" : proposalResponse === "declined" ? "text-red-400" : "text-amber-300"}`}>
                                {proposalResponse === "accepted" ? "💍 Said YES!" : proposalResponse === "declined" ? "Declined" : "Awaiting YES"}
                              </span>
                            </div>
                          </div>
                        );
                      })()
                    ) : isBirthdayParty ? (
                      (() => {
                        const totalBdayGuests = (site as any).birthdayPartyData?.guestRsvps?.filter((r: any) => r.attendance === "attending")?.reduce((sum: number, r: any) => sum + (Number(r.headcount) || 1), 0) || 0;
                        return (
                          <div className="p-3 rounded-2xl bg-purple-950/25 border border-purple-500/25 space-y-1">
                            <span className="text-[9px] uppercase tracking-wider text-purple-300 font-bold flex items-center gap-1">
                              <Cake className="w-3 h-3 text-purple-400" /> Party RSVPs
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.5)]" />
                              <span className="text-xs font-black text-purple-200">
                                {totalBdayGuests} Confirmed
                              </span>
                            </div>
                          </div>
                        );
                      })()
                    ) : isWeddingOrEngagement ? (
                      <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1">
                          <Users className="w-3 h-3 text-amber-400" /> Guest RSVPs
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                          <span className="text-xs font-black text-amber-300">
                            {(site as any).weddingData?.guestRsvps?.filter((r: any) => r.attendance === "attending")?.reduce((sum: number, r: any) => sum + (Number(r.headcount) || 1), 0) || 0} Attending
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-black/60 border border-white/6 space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" /> Date RSVP
                        </span>
                        <div className="flex items-center gap-1.5">
                          {hasRsvp ? (
                            <>
                              <span className={`w-2 h-2 rounded-full ${rsvpStatus === "accepted" ? "bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.5)]" : rsvpStatus === "declined" ? "bg-red-400" : "bg-amber-400"}`} />
                              <span className={`text-xs font-black capitalize ${rsvpStatus === "accepted" ? "text-pink-400" : rsvpStatus === "declined" ? "text-red-400" : "text-amber-400"}`}>
                                {rsvpStatus || "Pending"}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-zinc-600 font-medium">None</span>
                          )}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-white/8 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopyLink(site.slug)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-white/6 hover:bg-white/12 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copiedSlug === site.slug ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-amber-400" /> Copy Link
                        </>
                      )}
                    </button>

                    <Link
                      href={`/p/${site.slug}`}
                      target="_blank"
                      className="p-2.5 rounded-xl bg-white/6 hover:bg-white/12 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                      title="View Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/p/${site.slug}/track`}
                      className="p-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-white transition-all cursor-pointer"
                      title="Live Tracking Log"
                    >
                      <Activity className="w-4 h-4 text-amber-400" />
                    </Link>

                    <button
                      disabled={deletingSlug === site.slug}
                      onClick={() => handleDelete(site.slug)}
                      className="p-2.5 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 hover:text-red-300 transition-all disabled:opacity-50 cursor-pointer"
                      title="Delete Website"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* 📜 Luxury Footer */}
      <footer className="w-full text-center py-8 text-xs text-slate-400 border-t border-white/8 z-10 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-6 gap-4">
        <div>&copy; {new Date().getFullYear()} SealedVibe • Creator Command Center</div>
        <div className="flex flex-wrap gap-4 sm:gap-5 justify-center items-center">
          <a
            href="https://instagram.com/sealedvibe"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-amber-500/15 border border-pink-500/30 text-pink-300 hover:text-pink-200 hover:border-pink-400 transition-all font-semibold group shadow-sm"
            title="Follow @sealedvibe on Instagram"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
            <span>@sealedvibe</span>
          </a>
          <Link href="/privacy" className="hover:text-amber-300 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-amber-300 transition-colors">Terms of Service</Link>
          <Link href="/refund" className="hover:text-amber-300 transition-colors">Refund Policy</Link>
          <a href="mailto:adnanajmeri70@gmail.com" className="hover:text-amber-300 transition-colors" title="Contact: adnanajmeri70@gmail.com">Contact: adnanajmeri70@gmail.com</a>
        </div>
      </footer>

      {/* 🪙 Token Store Modal */}
      <TokenStoreModal
        isOpen={tokenStoreOpen}
        currentTokens={user?.tokens ?? 0}
        onClose={() => setTokenStoreOpen(false)}
        onSuccess={(newTokens) => {
          setUser((prev: any) => ({ ...prev, tokens: newTokens }));
          setTokenStoreOpen(false);
        }}
      />
    </div>
  );
}
