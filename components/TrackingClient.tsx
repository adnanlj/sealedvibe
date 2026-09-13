"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  Eye,
  CheckCircle,
  Clock,
  Sparkles,
  Link as LinkIcon,
  Crown,
  Users,
  MessageCircleHeart,
  Calendar,
  Gift,
  Copy,
  Check,
  ExternalLink,
  ChevronLeft,
  RefreshCw,
  Radio,
  Cake,
  PartyPopper,
  Wine,
  Disc,
  Music,
  Share2,
  Award,
  Flame,
  MessageCircle
} from "lucide-react";
import NextLink from "next/link";
import { motion } from "framer-motion";

interface TrackingClientProps {
  data: {
    slug: string;
    creatorName: string;
    recipientName: string;
    occasion: string;
    status: string;
    openedAt: string | null;
    createdAt: string;
    headline: string;
    websiteType?: string;
    weddingData?: {
      coupleNames?: string;
      weddingDate?: string;
      weddingTime?: string;
      venueName?: string;
      monogram?: string;
      guestRsvps?: Array<{
        name: string;
        attendance: string;
        headcount: number;
        message?: string;
        submittedAt: string | Date;
      }>;
    };
    birthdayPartyData?: {
      birthdayPersonName?: string;
      ageMilestone?: string;
      eventTitle?: string;
      hostNames?: string;
      tagline?: string;
      partyDate?: string;
      partyTime?: string;
      venueName?: string;
      venueAddress?: string;
      venueMapsUrl?: string;
      dressCode?: string;
      specialNotes?: string;
      allowDjRequests?: boolean;
      guestRsvps?: Array<{
        name: string;
        attendance: string;
        headcount: number;
        djSong?: string;
        message?: string;
        submittedAt: string | Date;
      }>;
    };
    proposalData?: any;
    dateInvitation?: {
      enabled: boolean;
      response?: string;
      dateType?: string;
      dateName?: string;
      dateDate?: string;
    };
  };
}

export default function TrackingClient({ data }: TrackingClientProps) {
  const [status, setStatus] = useState<string>(data.status);
  const [openedAt, setOpenedAt] = useState<string | null>(data.openedAt);
  const [weddingData, setWeddingData] = useState<any>(data.weddingData);
  const [birthdayPartyData, setBirthdayPartyData] = useState<any>(data.birthdayPartyData);
  const [proposalData, setProposalData] = useState<any>(data.proposalData);
  const [dateResponse, setDateResponse] = useState<string | undefined>(data.dateInvitation?.response);
  const [polling, setPolling] = useState<boolean>(true);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [copied, setCopied] = useState<boolean>(false);
  const [activeFilterTab, setActiveFilterTab] = useState<"all" | "attending" | "blessings" | "dj">("all");

  const [shareableLink, setShareableLink] = useState<string>(`/p/${data.slug}`);

  useEffect(() => {
    setShareableLink(`${window.location.origin}/p/${data.slug}`);
  }, [data.slug]);

  // Poll status API every 5 seconds for real-time RSVP updates
  useEffect(() => {
    if (!polling) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/status?slug=${data.slug}`);
        if (res.ok) {
          const statusData = await res.json();
          setStatus(statusData.status);
          if (statusData.openedAt) {
            setOpenedAt(new Date(statusData.openedAt).toISOString());
          }
          if (statusData.weddingData) {
            setWeddingData(statusData.weddingData);
          }
          if (statusData.birthdayPartyData) {
            setBirthdayPartyData(statusData.birthdayPartyData);
          }
          if (statusData.proposalData) {
            setProposalData(statusData.proposalData);
          }
          if (statusData.dateInvitation) {
            setDateResponse(statusData.dateInvitation.response);
          }
          setLastCheck(new Date());
        }
      } catch (err) {
        console.error("Failed to poll status:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [polling, data.slug]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShareWhatsApp = (title: string, person: string, date: string, venue: string) => {
    const text = encodeURIComponent(
      `🎉 VIP Invitation: ${title}\n\n✨ Celebrating: ${person}\n📅 Date: ${date}\n📍 Venue: ${venue}\n\nTap here to view the invitation & RSVP:\n${shareableLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleShareProposalWhatsApp = (partner: string, question: string) => {
    const text = encodeURIComponent(
      `💍 A Romantic Proposal For ${partner}\n\n"${question}"\n\n✨ Tap here to step into our starlit terrace:\n${shareableLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const isProposal = data.occasion === "proposal" || data.websiteType === "proposal";
  const isBirthdayParty = (data.occasion === "birthday_party" || data.websiteType === "birthday_party") && !isProposal;
  const isWeddingOrEngagement = (data.occasion === "wedding" || data.websiteType === "wedding" || data.occasion === "engagement" || data.websiteType === "engagement") && !isBirthdayParty && !isProposal;

  // 💍 1. ROMANTIC PROPOSAL LIVE RADAR & PARTNER REPLIES STATUS VIEW
  if (isProposal) {
    const prop = proposalData || {};
    const partnerName = prop.partnerName || data.recipientName || "My Love";
    const creatorName = prop.creatorName || data.creatorName || "Yours Forever";
    const headline = prop.headline || data.headline || "Will You Be Mine?";
    const proposalQuestion = prop.proposalQuestion || "Will you be my forever?";
    const responseStatus = prop.responseStatus || (status === "accepted" ? "accepted" : "pending");
    const isAccepted = responseStatus === "accepted";
    const partnerNote = prop.responsePartnerNote;
    const responseDate = prop.responseDate;
    const celebrationTitle = prop.celebrationDateTitle || "Our Special Celebration";
    const celebrationDateTime = prop.celebrationDateTime;

    return (
      <div className="relative min-h-screen flex flex-col justify-between overflow-hidden text-[#fff1f2] bg-[#07050e] selection:bg-rose-500/30 selection:text-rose-200">
        
        {/* Romantic Starlit Ambient Glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-rose-500/15 via-pink-600/10 to-transparent blur-[140px]" />
          <div className="absolute top-[30%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-amber-500/15 via-purple-900/10 to-transparent blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-t from-pink-700/10 via-rose-950/20 to-transparent blur-[160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#fda4af15_1px,transparent_1px)] [background-size:28px_28px] opacity-60" />
        </div>

        {/* Top Navbar */}
        <header className="w-full px-6 py-5 z-20 flex justify-between items-center max-w-5xl mx-auto">
          <NextLink href="/dashboard" className="flex items-center gap-2 text-xs font-bold text-rose-300/70 hover:text-amber-300 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </NextLink>
          <div className="text-xs text-rose-200 border border-rose-400/40 px-3.5 py-1.5 rounded-full bg-rose-500/15 font-mono font-bold flex items-center gap-2 shadow-lg shadow-rose-950/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span>Proposal Radar Active 🌹</span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 z-10 max-w-4xl mx-auto w-full space-y-6">
          
          {/* Executive Proposal Header Banner */}
          <div className="w-full p-6 sm:p-10 rounded-[36px] bg-gradient-to-b from-[#180d1a]/95 via-[#0e0714]/95 to-[#060309]/95 border-2 border-rose-400/35 shadow-2xl relative overflow-hidden text-left space-y-6">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rose-500 via-amber-300 to-pink-500" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-400/40 text-[10px] font-bold text-rose-200 uppercase tracking-widest">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>Proposal Experience & Partner Response Terminal</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight italic">
                    "{proposalQuestion}"
                  </h1>
                </div>
                <p className="text-xs text-rose-200/90 font-light flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>Partner: <strong className="text-white font-semibold">{partnerName}</strong></span>
                  <span>• Creator: <strong className="text-rose-100 font-semibold">{creatorName}</strong></span>
                  <span>• Sealed: <strong className="text-amber-200 font-mono">{new Date(data.createdAt).toLocaleDateString()}</strong></span>
                </p>
              </div>

              {/* Share & Quick Actions */}
              <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
                <button
                  onClick={handleCopy}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 hover:from-rose-400 hover:to-amber-300 text-stone-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-rose-950/40 cursor-pointer transition-all hover:scale-105 active:scale-95 border border-white/60"
                >
                  {copied ? <><Check className="w-4 h-4 text-stone-950" /> Link Copied!</> : <><Copy className="w-4 h-4" /> Copy Proposal Link</>}
                </button>
                <button
                  onClick={() => handleShareProposalWhatsApp(partnerName, proposalQuestion)}
                  className="p-3 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] transition-all shadow-md cursor-pointer"
                  title="Share on WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <NextLink
                  href={`/p/${data.slug}`}
                  target="_blank"
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-all shadow-md cursor-pointer"
                  title="Open Live Proposal Website"
                >
                  <ExternalLink className="w-4 h-4" />
                </NextLink>
              </div>
            </div>

            {/* 4 Real-time Proposal Stat Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
              <div className={`p-4 sm:p-5 rounded-2xl bg-black/60 border text-center relative overflow-hidden group transition-all shadow-lg ${
                isAccepted ? "border-emerald-400/50 shadow-emerald-950/30" : "border-amber-400/35 shadow-amber-950/30"
              }`}>
                <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-xl pointer-events-none ${isAccepted ? "bg-emerald-400/10" : "bg-amber-400/10"}`} />
                <span className={`text-xl sm:text-2xl font-black block font-serif ${isAccepted ? "text-emerald-300" : "text-amber-300"}`}>
                  {isAccepted ? "💍 Said YES!" : "Awaiting YES"}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-rose-200/80 font-bold flex items-center justify-center gap-1.5 mt-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" /> Proposal Answer
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-rose-500/25 text-center relative overflow-hidden group hover:border-rose-500/50 transition-all shadow-lg">
                <span className={`text-xl sm:text-2xl font-black block font-serif ${openedAt ? "text-rose-200" : "text-slate-400"}`}>
                  {openedAt ? "Opened 💌" : "Unopened"}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold flex items-center justify-center gap-1.5 mt-1.5">
                  <Eye className="w-3.5 h-3.5 text-rose-400" /> Envelope Status
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-pink-500/25 text-center relative overflow-hidden group hover:border-pink-500/50 transition-all shadow-lg">
                <span className="text-xl sm:text-2xl font-black text-pink-300 block font-serif">
                  {partnerNote ? "1 Note 💖" : "0 Notes"}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold flex items-center justify-center gap-1.5 mt-1.5">
                  <MessageCircleHeart className="w-3.5 h-3.5 text-pink-400" /> Partner's Reply
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-amber-500/25 text-center relative overflow-hidden group hover:border-amber-500/50 transition-all shadow-lg">
                <span className="text-sm sm:text-base font-bold text-amber-300 block truncate font-serif">
                  {celebrationDateTime || "Forever"}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold flex items-center justify-center gap-1.5 mt-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-300" /> Date Moment
                </span>
              </div>
            </div>
          </div>

          {/* Envelope Status & Proposal Journey Timeline Card */}
          <div className="w-full p-6 sm:p-8 rounded-[32px] bg-gradient-to-b from-[#160b18]/90 via-[#0b0510]/95 to-black/95 border border-rose-400/25 shadow-xl text-left space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-serif">
                <Radio className="w-4 h-4 text-rose-400" /> Proposal Engagement & Milestone Timeline
              </h3>
              <span className="text-[10px] text-rose-200 font-mono bg-rose-500/15 px-2.5 py-1 rounded-full border border-rose-400/30" suppressHydrationWarning>
                Last sync: {lastCheck.toLocaleTimeString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Step 1: Created */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle className="w-4 h-4" />
                  <span>Starlit Terrace Proposal Sealed</span>
                </div>
                <p className="text-xs text-slate-300 font-light">
                  3D terrace, constellation map & love letter deployed.
                </p>
                <span className="text-[10px] text-slate-500 font-mono block">
                  {new Date(data.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Step 2: Opened */}
              <div className={`p-4 rounded-2xl border space-y-1.5 ${
                openedAt ? "bg-emerald-500/[0.04] border-emerald-500/30" : "bg-amber-500/[0.04] border-amber-500/30"
              }`}>
                <div className={`flex items-center gap-2 font-bold text-xs ${
                  openedAt ? "text-emerald-400" : "text-amber-300 animate-pulse"
                }`}>
                  {openedAt ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  <span>{openedAt ? "Wax Seal Broken & Letter Opened 💌" : "Awaiting Partner to Open..."}</span>
                </div>
                <p className="text-xs text-slate-300 font-light" suppressHydrationWarning>
                  {openedAt 
                    ? `Opened on ${new Date(openedAt).toLocaleDateString()} at ${new Date(openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : `Send the private link to ${partnerName} to record first visit.`}
                </p>
              </div>

              {/* Step 3: Proposal Answer */}
              <div className={`p-4 rounded-2xl border space-y-1.5 ${
                isAccepted ? "bg-emerald-500/[0.06] border-emerald-500/40" : "bg-white/[0.03] border-white/8"
              }`}>
                <div className={`flex items-center gap-2 font-bold text-xs ${
                  isAccepted ? "text-emerald-300" : "text-rose-300"
                }`}>
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{isAccepted ? "She/He Said YES! Forever! 💍" : "Awaiting Question Response"}</span>
                </div>
                <p className="text-xs text-slate-300 font-light" suppressHydrationWarning>
                  {isAccepted
                    ? responseDate 
                      ? `Accepted on ${new Date(responseDate).toLocaleDateString()} at ${new Date(responseDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : "Official Love Pact & Certificate of Forever unlocked."
                    : "Partner has not pressed the YES button yet."}
                </p>
              </div>
            </div>
          </div>

          {/* Partner's Heartfelt Reply Note Section */}
          <div className="w-full p-6 sm:p-10 rounded-[36px] bg-gradient-to-b from-[#180d1a]/95 via-[#0e0714]/95 to-black/95 border border-rose-400/30 shadow-2xl space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-serif italic">
                  Partner's Love Reply & Note <Sparkles className="w-4 h-4 text-amber-300" />
                </h3>
                <p className="text-xs text-rose-200/80 font-light">
                  Written response sent back by {partnerName} directly from the Certificate of Forever.
                </p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono" suppressHydrationWarning>
                Live sync active
              </span>
            </div>

            {partnerNote ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-950/40 via-purple-950/30 to-black border border-rose-400/40 space-y-4 shadow-xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-amber-400 text-stone-950 font-black text-sm flex items-center justify-center shadow-md">
                      {partnerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-serif">{partnerName}</h4>
                      <span className="text-[10px] text-rose-300/70 font-mono" suppressHydrationWarning>
                        {responseDate ? `Sent on ${new Date(responseDate).toLocaleDateString()} at ${new Date(responseDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "Recently"}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                    ✓ Verified Love Reply
                  </span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-rose-400/20">
                  <p className="text-sm sm:text-base text-rose-100 font-serif italic leading-relaxed">
                    "{partnerNote}"
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="py-16 border border-dashed border-rose-400/25 rounded-3xl text-center space-y-3 bg-white/[0.01]">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-400/30 flex items-center justify-center mx-auto text-rose-300">
                  <MessageCircleHeart className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-white font-serif">
                  {isAccepted ? "Awaiting Partner's Note" : "No Partner Response Yet"}
                </h4>
                <p className="text-xs text-rose-200/70 max-w-sm mx-auto font-light leading-relaxed">
                  {isAccepted
                    ? `${partnerName} said YES! If they write a message on the Certificate of Forever, it will be displayed here in real-time.`
                    : `Share your proposal link with ${partnerName}. As soon as they open the letter and say YES, you will see their response instantly!`}
                </p>
              </div>
            )}
          </div>

        </main>

        {/* Footer */}
        <footer className="w-full py-6 text-center text-xs text-slate-500 border-t border-white/8">
          SealedVibe • Romantic Proposal & Forever Love Pact Intelligence System
        </footer>
      </div>
    );
  }

  // 🎂 2. VIP BIRTHDAY PARTY LIVE GUESTBOOK & STATUS LOG VIEW
  if (isBirthdayParty) {
    const bday = birthdayPartyData || {};
    const birthdayPerson = bday.birthdayPersonName || data.recipientName || "Birthday Star";
    const eventTitle = bday.eventTitle || `VIP Birthday Party of ${birthdayPerson}`;
    const ageMilestone = bday.ageMilestone || "Milestone Birthday";
    const partyDate = bday.partyDate || "Upcoming Celebration";
    const partyTime = bday.partyTime || "Evening Onwards";
    const venueName = bday.venueName || "VIP Lounge & Venue";
    const hostNames = bday.hostNames || data.creatorName || `Hosted by ${birthdayPerson} & Friends`;

    const rsvps = bday.guestRsvps || [];
    const attendingList = rsvps.filter((r: any) => r.attendance === "attending");
    const declinedList = rsvps.filter((r: any) => r.attendance === "declined");
    const blessingsList = rsvps.filter((r: any) => !!r.message?.trim());
    const djRequestsList = rsvps.filter((r: any) => !!r.djSong?.trim());
    const totalConfirmedGuests = attendingList.reduce((sum: number, r: any) => sum + (Number(r.headcount) || 1), 0);

    const filteredRsvps = rsvps.filter((guest: any) => {
      if (activeFilterTab === "attending") return guest.attendance === "attending";
      if (activeFilterTab === "blessings") return !!guest.message?.trim();
      if (activeFilterTab === "dj") return !!guest.djSong?.trim();
      return true;
    });

    return (
      <div className="relative min-h-screen flex flex-col justify-between overflow-hidden text-[#fdf8f4] bg-[#08070d] selection:bg-[#eed180]/30 selection:text-[#ffd700]">
        
        {/* Festive Ambient Background Lights */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-[#d4af37]/15 via-[#c29d2b]/10 to-transparent blur-[140px]" />
          <div className="absolute top-[30%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#e8a598]/15 via-[#f472b6]/10 to-transparent blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-t from-[#ffd700]/10 via-purple-950/20 to-transparent blur-[160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#eed18015_1px,transparent_1px)] [background-size:28px_28px] opacity-60" />
        </div>

        {/* Top Navbar */}
        <header className="w-full px-6 py-5 z-20 flex justify-between items-center max-w-5xl mx-auto">
          <NextLink href="/dashboard" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#eed180] transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </NextLink>
          <div className="text-xs text-[#eed180] border border-[#d4af37]/40 px-3.5 py-1.5 rounded-full bg-[#d4af37]/15 font-mono font-bold flex items-center gap-2 shadow-lg shadow-amber-950/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Live Party Radar Active 🥂</span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 z-10 max-w-4xl mx-auto w-full space-y-6">
          
          {/* Executive Birthday Party Header Banner */}
          <div className="w-full p-6 sm:p-10 rounded-[36px] bg-gradient-to-b from-[#161224]/95 via-[#0e0a1a]/95 to-[#06050b]/95 border-2 border-[#d4af37]/40 shadow-2xl relative overflow-hidden text-left space-y-6">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#d4af37] via-[#eed180] to-[#e8a598]" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[10px] font-bold text-[#eed180] uppercase tracking-widest">
                  <Cake className="w-3.5 h-3.5 text-[#eed180]" />
                  <span>VIP Birthday Celebration Guestbook & Status</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl font-black text-white font-serif tracking-tight">
                    {eventTitle}
                  </h1>
                  {ageMilestone && (
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#d4af37] to-[#e8a598] text-black font-black text-xs uppercase tracking-wider shadow-sm">
                      {ageMilestone}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-light flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>📅 Party Date: <strong className="text-[#eed180]">{partyDate}</strong></span>
                  <span>⏰ Time: <strong className="text-[#eed180]">{partyTime}</strong></span>
                  <span>📍 Venue: <strong className="text-slate-200">{venueName}</strong></span>
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  ✨ Host: <strong className="text-slate-200">{hostNames}</strong> • Sealed On: {new Date(data.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Share & Quick Actions */}
              <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
                <button
                  onClick={handleCopy}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#eed180] to-[#d4af37] hover:from-[#c29d2b] hover:to-[#e5c66d] text-[#1a1411] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-amber-950/40 cursor-pointer transition-all hover:scale-105 active:scale-95 border border-white/60"
                >
                  {copied ? <><Check className="w-4 h-4 text-[#1a1411]" /> Link Copied!</> : <><Copy className="w-4 h-4" /> Copy Share Link</>}
                </button>
                <button
                  onClick={() => handleShareWhatsApp(eventTitle, birthdayPerson, partyDate, venueName)}
                  className="p-3 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] transition-all shadow-md cursor-pointer"
                  title="Share on WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <NextLink
                  href={`/p/${data.slug}`}
                  target="_blank"
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-all shadow-md cursor-pointer"
                  title="Open Live Party Invitation"
                >
                  <ExternalLink className="w-4 h-4" />
                </NextLink>
              </div>
            </div>

            {/* 4 Real-time Party Stat Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
              <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-[#d4af37]/35 text-center relative overflow-hidden group hover:border-[#d4af37] transition-all shadow-lg">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#d4af37]/10 rounded-full blur-xl pointer-events-none" />
                <span className="text-3xl sm:text-4xl font-black text-[#ffd700] block font-mono">
                  {totalConfirmedGuests}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#eed180] font-bold flex items-center justify-center gap-1.5 mt-1.5">
                  <Users className="w-3.5 h-3.5 text-[#ffd700]" /> Confirmed Guests
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-emerald-500/25 text-center relative overflow-hidden group hover:border-emerald-500/50 transition-all shadow-lg">
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 block font-mono">
                  {rsvps.length}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold flex items-center justify-center gap-1.5 mt-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> RSVPs Received
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-pink-500/25 text-center relative overflow-hidden group hover:border-pink-500/50 transition-all shadow-lg">
                <span className="text-3xl sm:text-4xl font-black text-pink-400 block font-mono">
                  {blessingsList.length}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold flex items-center justify-center gap-1.5 mt-1.5">
                  <MessageCircleHeart className="w-3.5 h-3.5 text-pink-400" /> Birthday Wishes
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-purple-500/25 text-center relative overflow-hidden group hover:border-purple-500/50 transition-all shadow-lg">
                <span className="text-3xl sm:text-4xl font-black text-purple-300 block font-mono">
                  {djRequestsList.length}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold flex items-center justify-center gap-1.5 mt-1.5">
                  <Disc className="w-3.5 h-3.5 text-purple-300" /> DJ Track Requests
                </span>
              </div>
            </div>
          </div>

          {/* Envelope Status & Invitation Timeline Card */}
          <div className="w-full p-6 sm:p-8 rounded-[32px] bg-gradient-to-b from-[#141022]/90 via-[#0b0817]/95 to-black/95 border border-[#d4af37]/25 shadow-xl text-left space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-serif">
                <Radio className="w-4 h-4 text-[#eed180]" /> Invitation Envelope & Live Engagement Timeline
              </h3>
              <span className="text-[10px] text-[#eed180] font-mono bg-[#d4af37]/15 px-2.5 py-1 rounded-full border border-[#d4af37]/30" suppressHydrationWarning>
                Last sync: {lastCheck.toLocaleTimeString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Step 1: Created */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle className="w-4 h-4" />
                  <span>VIP Invitation Deployed</span>
                </div>
                <p className="text-xs text-slate-300 font-light">
                  3D Champagne & Gold particle universe live.
                </p>
                <span className="text-[10px] text-slate-500 font-mono block">
                  {new Date(data.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Step 2: Opened */}
              <div className={`p-4 rounded-2xl border space-y-1.5 ${
                openedAt ? "bg-emerald-500/[0.04] border-emerald-500/30" : "bg-amber-500/[0.04] border-amber-500/30"
              }`}>
                <div className={`flex items-center gap-2 font-bold text-xs ${
                  openedAt ? "text-emerald-400" : "text-amber-300 animate-pulse"
                }`}>
                  {openedAt ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  <span>{openedAt ? "Envelope Broken & Viewed 🍾" : "Awaiting First Guest View..."}</span>
                </div>
                <p className="text-xs text-slate-300 font-light" suppressHydrationWarning>
                  {openedAt 
                    ? `First viewed on ${new Date(openedAt).toLocaleDateString()} at ${new Date(openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : "Send invitation link to friends to record first visit."}
                </p>
              </div>

              {/* Step 3: RSVPs Active */}
              <div className={`p-4 rounded-2xl border space-y-1.5 ${
                rsvps.length > 0 ? "bg-purple-500/[0.04] border-purple-500/30" : "bg-white/[0.03] border-white/8"
              }`}>
                <div className={`flex items-center gap-2 font-bold text-xs ${
                  rsvps.length > 0 ? "text-purple-300" : "text-slate-400"
                }`}>
                  <PartyPopper className="w-4 h-4" />
                  <span>{rsvps.length > 0 ? `${rsvps.length} RSVPs Logged 🥂` : "Awaiting Guest Responses"}</span>
                </div>
                <p className="text-xs text-slate-300 font-light">
                  {rsvps.length > 0
                    ? `${totalConfirmedGuests} total guests confirmed on the VIP roster.`
                    : "Guest confirmations will populate below automatically."}
                </p>
              </div>
            </div>
          </div>

          {/* Live Guest RSVP & Blessings Hub */}
          <div className="w-full p-6 sm:p-10 rounded-[36px] bg-gradient-to-b from-[#141022]/95 via-[#0b0817]/95 to-black/95 border border-[#d4af37]/35 shadow-2xl space-y-6 text-left">
            
            {/* Header & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-serif">
                  Live Guest Roster & Blessings <Sparkles className="w-4 h-4 text-[#ffd700]" />
                </h3>
                <p className="text-xs text-slate-400 font-light">
                  Every attendance confirmation, heartfelt birthday blessing, and DJ track request logged in real-time.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-2xl border border-white/10 self-start sm:self-auto overflow-x-auto max-w-full">
                <button
                  onClick={() => setActiveFilterTab("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeFilterTab === "all" ? "bg-[#d4af37] text-black shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  All ({rsvps.length})
                </button>
                <button
                  onClick={() => setActiveFilterTab("attending")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeFilterTab === "attending" ? "bg-emerald-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Attending ({attendingList.length})
                </button>
                <button
                  onClick={() => setActiveFilterTab("blessings")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeFilterTab === "blessings" ? "bg-pink-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Wishes ({blessingsList.length})
                </button>
                <button
                  onClick={() => setActiveFilterTab("dj")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeFilterTab === "dj" ? "bg-purple-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  DJ Songs ({djRequestsList.length})
                </button>
              </div>
            </div>

            {/* Guest Cards Feed */}
            {filteredRsvps.length === 0 ? (
              <div className="py-16 border border-dashed border-[#d4af37]/25 rounded-3xl text-center space-y-3 bg-white/[0.01]">
                <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center mx-auto text-[#ffd700]">
                  <PartyPopper className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-white font-serif">
                  {rsvps.length === 0 ? "No Guest RSVPs Received Yet" : "No entries matching this filter."}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto font-light leading-relaxed">
                  {rsvps.length === 0
                    ? `Share your birthday invitation link with your friends. As soon as they submit their attendance, wishes, or DJ requests, they will appear here instantly!`
                    : "Try switching filter tabs to view all guest responses."}
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredRsvps.map((guest: any, idx: number) => {
                  const isAttending = guest.attendance === "attending";
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#d4af37]/50 transition-all flex flex-col gap-3.5 shadow-lg relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar Initials Badge */}
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#eed180] to-[#e8a598] text-black font-black text-sm flex items-center justify-center shadow-md flex-shrink-0">
                            {guest.name ? guest.name.charAt(0).toUpperCase() : "G"}
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-white font-serif">{guest.name}</h4>
                            <span className="text-[10px] text-slate-400 font-mono block" suppressHydrationWarning>
                              Submitted on {guest.submittedAt ? new Date(guest.submittedAt).toLocaleDateString() + " at " + new Date(guest.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"}
                            </span>
                          </div>
                        </div>

                        {/* Status & Headcount Badges */}
                        <div className="flex items-center gap-2 self-start sm:self-center">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                            isAttending
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/35"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/35"
                          }`}>
                            {isAttending ? "✓ Attending with Joy" : "✕ Regretfully Declined"}
                          </span>

                          {isAttending && (
                            <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/45 text-[#eed180] text-xs font-black whitespace-nowrap">
                              +{guest.headcount || 1} {guest.headcount > 1 ? "Guests" : "Guest"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Birthday Blessings & Wishes Speech Card */}
                      {guest.message && (
                        <div className="p-3.5 sm:p-4 rounded-xl bg-black/60 border border-[#d4af37]/25 space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#eed180] uppercase tracking-wider font-mono">
                            <MessageCircleHeart className="w-3.5 h-3.5 text-pink-400" />
                            <span>Birthday Wish for {birthdayPerson}:</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-200 italic font-serif leading-relaxed">
                            "{guest.message}"
                          </p>
                        </div>
                      )}

                      {/* DJ Song Request Pill */}
                      {guest.djSong && (
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs">
                          <Disc className="w-4 h-4 text-purple-300 flex-shrink-0 animate-spin-slow" />
                          <span className="text-[11px] font-mono text-purple-300 font-bold uppercase">
                            DJ Track Request:
                          </span>
                          <span className="text-xs font-bold text-white truncate">
                            "{guest.djSong}"
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

        </main>

        {/* Footer */}
        <footer className="w-full py-6 text-center text-xs text-slate-500 border-t border-white/8">
          SealedVibe • VIP Birthday Celebration & Guest Intelligence System
        </footer>
      </div>
    );
  }

  const rsvps = weddingData?.guestRsvps || [];
  const attendingList = rsvps.filter((r: any) => r.attendance === "attending");
  const blessingsList = rsvps.filter((r: any) => !!r.message?.trim());
  const totalGuestsCount = attendingList.reduce((sum: number, r: any) => sum + (Number(r.headcount) || 1), 0);

  // 👑 2. WEDDING / ENGAGEMENT LIVE GUESTBOOK TRACKING VIEW
  if (isWeddingOrEngagement) {
    const isEngagement = data.occasion === "engagement" || data.websiteType === "engagement";
    return (
      <div className="relative min-h-screen flex flex-col justify-between overflow-hidden text-slate-100 bg-[#06050e] selection:bg-amber-500/30 selection:text-amber-200">
        
        {/* Ambient Glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-amber-600/10 via-purple-900/15 to-transparent blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-bl from-pink-600/10 via-indigo-900/15 to-transparent blur-[160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        {/* Top Navbar */}
        <header className="w-full px-6 py-5 z-20 flex justify-between items-center max-w-5xl mx-auto">
          <NextLink href="/dashboard" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-300 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </NextLink>
          <div className="text-xs text-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-full bg-amber-500/15 font-mono font-bold flex items-center gap-2 shadow-lg shadow-amber-950/20 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Live Terminal Active</span>
          </div>
        </header>

        {/* Main Wedding/Engagement Tracking Container */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 z-10 max-w-4xl mx-auto w-full space-y-6">
          
          {/* Executive Header Banner */}
          <div className="w-full p-8 sm:p-10 rounded-[36px] bg-gradient-to-b from-[#121024]/95 via-[#0a0815]/95 to-black/95 border border-amber-500/25 shadow-2xl relative overflow-hidden text-left space-y-6">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                  {isEngagement ? <Sparkles className="w-3 h-3 text-emerald-400" /> : <Crown className="w-3 h-3 text-amber-400" />}
                  {isEngagement ? "💍 Botanical Engagement Guestbook & Attendance" : "👑 Royal Wedding Guestbook & Attendance Log"}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif italic">
                  {weddingData?.coupleNames || data.recipientName}
                </h1>
                <p className="text-xs text-slate-300 font-light">
                  Auspicious Date: <span className="text-amber-300 font-bold">{weddingData?.weddingDate || "2026-11-20"}</span> • Venue: <span className="text-slate-200 font-medium">{weddingData?.venueName || "The Botanical Meadow"}</span>
                </p>
              </div>

              {/* Share Actions */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleCopy}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-amber-950/40 cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  {copied ? <><Check className="w-4 h-4 text-black" /> Copied Link!</> : <><Copy className="w-4 h-4" /> Copy Share Link</>}
                </button>
                <NextLink
                  href={`/p/${data.slug}`}
                  target="_blank"
                  className="p-3 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/12 text-white transition-all shadow-md cursor-pointer"
                  title="Open Live Invitation"
                >
                  <ExternalLink className="w-4 h-4" />
                </NextLink>
              </div>
            </div>

            {/* 3 Real-time Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-black/60 border border-amber-500/25 text-center">
                <span className="text-3xl sm:text-4xl font-black text-amber-400 block font-mono">
                  {totalGuestsCount}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold flex items-center justify-center gap-1.5 mt-1">
                  <Users className="w-3.5 h-3.5 text-amber-400" /> Confirmed Guests
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-white/8 text-center">
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 block font-mono">
                  {rsvps.length}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold flex items-center justify-center gap-1.5 mt-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Families Responded
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-white/8 text-center">
                <span className="text-3xl sm:text-4xl font-black text-pink-400 block font-mono">
                  {blessingsList.length}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold flex items-center justify-center gap-1.5 mt-1">
                  <MessageCircleHeart className="w-3.5 h-3.5 text-pink-400" /> Blessings Received
                </span>
              </div>
            </div>
          </div>

          {/* Live Guest RSVP Feed & Table */}
          <div className="w-full p-8 sm:p-10 rounded-[36px] bg-gradient-to-b from-[#121024]/90 via-[#0a0815]/95 to-black/95 border border-white/10 shadow-2xl space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 font-serif italic">
                  Live Guest Responses <Sparkles className="w-4 h-4 text-amber-400" />
                </h3>
                <p className="text-xs text-slate-400 font-light">
                  Every RSVP entered by your family & guests automatically registers here in real-time.
                </p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono" suppressHydrationWarning>
                Last sync: {lastCheck.toLocaleTimeString()}
              </span>
            </div>

            {rsvps.length === 0 ? (
              <div className="py-16 border border-dashed border-white/10 rounded-3xl text-center space-y-3 bg-white/2">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white font-serif italic">No RSVPs Received Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto font-light leading-relaxed">
                  Share your wedding invitation link with family & friends. When they submit the RSVP form, their response will appear here instantly!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
                {rsvps.map((guest: any, idx: number) => {
                  const isAttending = guest.attendance === "attending";
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white/[0.04] border border-white/8 hover:border-amber-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2.5">
                          <h4 className="text-base font-bold text-white">{guest.name}</h4>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            isAttending
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          }`}>
                            {isAttending ? "✨ Attending with Joy" : "💖 Sending Blessings"}
                          </span>
                        </div>

                        {guest.message && (
                          <p className="text-xs text-amber-200/90 italic bg-black/40 px-3.5 py-2 rounded-xl border border-amber-500/15 max-w-xl">
                            "{guest.message}"
                          </p>
                        )}

                        <span className="text-[10px] text-slate-500 font-mono block" suppressHydrationWarning>
                          Submitted on {guest.submittedAt ? new Date(guest.submittedAt).toLocaleDateString() + " at " + new Date(guest.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                        </span>
                      </div>

                      {/* Headcount Badge */}
                      <div className="self-start sm:self-center">
                        {isAttending ? (
                          <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black text-center whitespace-nowrap shadow-sm">
                            +{guest.headcount || 1} {guest.headcount > 1 ? "Guests" : "Guest"}
                          </div>
                        ) : (
                          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold text-center whitespace-nowrap">
                            Blessings Only
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </main>

        {/* Footer */}
        <footer className="w-full py-6 text-center text-xs text-slate-500 border-t border-white/8">
          SealedVibe • Royal Wedding & Event Management System
        </footer>
      </div>
    );
  }

  // 💌 3. DEFAULT 1-TO-1 APOLOGY / CELEBRATION / PERSONAL TRACKING VIEW
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden text-slate-100 bg-[#06050e] selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-amber-600/10 via-purple-900/15 to-transparent blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-bl from-pink-600/10 via-indigo-900/15 to-transparent blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Header */}
      <header className="w-full px-6 py-5 z-20 flex justify-between items-center max-w-5xl mx-auto">
        <NextLink href="/dashboard" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-300 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </NextLink>
        <div className="text-xs text-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-full bg-amber-500/15 font-mono font-bold flex items-center gap-2 shadow-lg shadow-amber-950/20 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Live Tracking Active</span>
        </div>
      </header>

      {/* Main Board */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-xl rounded-[36px] p-8 sm:p-10 bg-gradient-to-b from-[#121024]/95 via-[#0a0815]/95 to-black/95 border border-amber-500/25 shadow-2xl relative overflow-hidden space-y-7">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />

          {/* Heading */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-300 uppercase tracking-widest">
              <Radio className="w-3 h-3 text-amber-400" /> Real-time surveillance
            </div>
            <h2 className="text-3xl font-extrabold text-white flex items-center justify-center sm:justify-start gap-2 font-serif italic">
              Recipient Status Log <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>
            <p className="text-xs text-slate-300 font-light">
              Tracking engagement for: <span className="text-amber-300 font-medium">"{data.headline}"</span>
            </p>
          </div>

          {/* Details Box */}
          <div className="grid grid-cols-2 gap-3 p-5 rounded-2xl bg-black/60 border border-white/8 text-xs text-left">
            <div>
              <span className="text-slate-400 block mb-0.5 text-[10px] uppercase tracking-wider font-bold">Occasion</span>
              <span className="font-bold text-amber-300 capitalize">{data.occasion}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 text-[10px] uppercase tracking-wider font-bold">Recipient</span>
              <span className="font-bold text-white">{data.recipientName}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 text-[10px] uppercase tracking-wider font-bold">Creator</span>
              <span className="font-bold text-white">{data.creatorName}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 text-[10px] uppercase tracking-wider font-bold">Sealed On</span>
              <span className="font-mono text-slate-300" suppressHydrationWarning>
                {new Date(data.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="space-y-6 py-2">
            {/* Step 1: Created */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-sm shadow-sm">
                  ✓
                </div>
                <div className="w-[2px] h-10 bg-emerald-500/30" />
              </div>
              <div className="text-left py-0.5">
                <h4 className="text-sm font-bold text-white">Experience Sealed & Ready</h4>
                <p className="text-xs text-slate-400 font-light">Custom 3D particle universe generated and deployed.</p>
              </div>
            </div>

            {/* Step 2: Opened */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                {openedAt ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-sm shadow-sm">
                    ✓
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 text-sm animate-pulse">
                    <Clock className="w-4 h-4" />
                  </div>
                )}
                <div className={`w-[2px] h-10 ${openedAt ? "bg-emerald-500/30" : "bg-white/8"}`} />
              </div>
              <div className="text-left py-0.5">
                <h4 className="text-sm font-bold text-white">
                  {openedAt ? "Wax Seal Broken & Viewed 🎉" : "Awaiting Recipient to Open..."}
                </h4>
                <p className="text-xs text-slate-400 font-light" suppressHydrationWarning>
                  {openedAt 
                    ? `Opened on ${new Date(openedAt).toLocaleDateString()} at ${new Date(openedAt).toLocaleTimeString()}`
                    : `Send your private link to ${data.recipientName} to trigger first visit logging.`}
                </p>
              </div>
            </div>

            {/* Step 3: Accepted */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                {status === "accepted" ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-sm shadow-sm">
                    ✓
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-slate-500 text-sm">
                    <Heart className="w-4 h-4" />
                  </div>
                )}
                {data.dateInvitation?.enabled && (
                  <div className={`w-[2px] h-10 ${status === "accepted" ? "bg-emerald-500/30" : "bg-white/8"}`} />
                )}
              </div>
              <div className="text-left py-0.5">
                <h4 className="text-sm font-bold text-white">
                  {status === "accepted" ? "Reconciled & Accepted! 💖" : "Awaiting Emotional Response"}
                </h4>
                <p className="text-xs text-slate-400 font-light">
                  {status === "accepted"
                    ? "Apology was accepted! The celebratory 3D stardust triggered."
                    : "Recipient has not pressed the reconcile button yet."}
                </p>
              </div>
            </div>

            {/* Step 4: Date Invitation Response */}
            {data.dateInvitation?.enabled && (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  {dateResponse === "accepted" ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-sm shadow-sm">
                      ✓
                    </div>
                  ) : dateResponse === "declined" ? (
                    <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 text-sm">
                      ✗
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 text-sm animate-pulse">
                      <Clock className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="text-left py-0.5">
                  <h4 className="text-sm font-bold text-white">
                    {dateResponse === "accepted"
                      ? "Date Invitation Accepted! 🥳"
                      : dateResponse === "declined"
                      ? "Date Proposal Declined 😢"
                      : "Awaiting Date Proposal Response..."}
                  </h4>
                  <p className="text-xs text-slate-400 font-light">
                    {dateResponse === "accepted"
                      ? `They said YES to going on a ${data.dateInvitation.dateType} date (${data.dateInvitation.dateName}) with you on ${data.dateInvitation.dateDate}!`
                      : dateResponse === "declined"
                      ? `They declined the date invitation.`
                      : "Recipient has not responded to the date card yet."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Links */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 py-3.5 rounded-2xl bg-white/6 hover:bg-white/12 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Link Copied to Clipboard
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4 text-amber-400" /> Copy Recipient Link
                </>
              )}
            </button>
            <NextLink
              href={`/p/${data.slug}`}
              target="_blank"
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 text-black font-black text-xs flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-950/40 hover:scale-105 active:scale-95"
            >
              <ExternalLink className="w-4 h-4" /> Preview Experience
            </NextLink>
          </div>

          <div className="pt-2 text-center">
            <span className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1.5" suppressHydrationWarning>
              <RefreshCw className="w-3 h-3 animate-spin text-amber-400" /> Real-time sync active (Last check: {lastCheck.toLocaleTimeString()})
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-slate-500 border-t border-white/8">
        SealedVibe • Real-Time Surveillance & Read Receipt Terminal
      </footer>
    </div>
  );
}
