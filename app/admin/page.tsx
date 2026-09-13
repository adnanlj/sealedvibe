"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Crown,
  Users,
  Globe,
  Gift,
  Coins,
  Trash2,
  Plus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck,
  Activity,
  Heart,
  Sparkle,
  Radio,
  Layers,
  Save
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<any>(null);
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [recentWebsites, setRecentWebsites] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New Promo Code Form State
  const [newCode, setNewCode] = useState("");
  const [newTokens, setNewTokens] = useState<number>(1);
  const [newMaxUses, setNewMaxUses] = useState<number>(50);
  const [creatingCode, setCreatingCode] = useState<boolean>(false);

  // User Search State
  const [userSearch, setUserSearch] = useState("");
  const [modifyingUserId, setModifyingUserId] = useState<string | null>(null);
  const [pricingPacks, setPricingPacks] = useState<any[]>([]);
  const [savingPackId, setSavingPackId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/stats");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load admin stats.");
      }

      setStats(data.stats);
      setPromoCodes(data.promoCodes || []);
      setRecentWebsites(data.recentWebsites || []);

      // Fetch all users list
      const usersRes = await fetch("/api/admin/users");
      const usersData = await usersRes.json();
      if (usersRes.ok) {
        setUsers(usersData.users || []);
      }

      // Fetch live pricing packs
      const pricingRes = await fetch("/api/pricing");
      const pricingData = await pricingRes.json();
      if (pricingRes.ok && pricingData.packs) {
        setPricingPacks(pricingData.packs);
      }
    } catch (err: any) {
      setError(err.message || "Access denied or session expired.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCreatePromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    setCreatingCode(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/admin/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newCode.trim(),
          tokensGranted: Number(newTokens) || 1,
          maxUses: Number(newMaxUses) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create promo code.");

      setSuccessMsg(`🎉 Promo code "${data.promoCode.code}" created successfully!`);
      setNewCode("");
      fetchAdminData();
    } catch (err: any) {
      setError(err.message || "Failed to create promo code.");
    } finally {
      setCreatingCode(false);
    }
  };

  const handleDeletePromoCode = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete promo code "${code}"?`)) return;

    try {
      const res = await fetch(`/api/admin/promo?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete code.");

      setSuccessMsg(`Promo code "${code}" deleted.`);
      fetchAdminData();
    } catch (err: any) {
      setError(err.message || "Failed to delete promo code.");
    }
  };

  const handleUpdatePrice = async (packId: string, priceInr: number, originalPriceInr: number, tagline: string) => {
    try {
      setSavingPackId(packId);
      setError(null);
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId, priceInr, originalPriceInr, priceUsd: 0, tagline }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update price.");

      setSuccessMsg(data.message || "Price updated successfully!");
      fetchAdminData();
    } catch (err: any) {
      setError(err.message || "Failed to update price.");
    } finally {
      setSavingPackId(null);
    }
  };

  const handleGrantTokens = async (userId: string, change: number) => {
    try {
      setModifyingUserId(userId);
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId, tokenChange: change }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to modify tokens.");

      setUsers(prev => prev.map(u => u._id === userId ? { ...u, tokens: data.user.tokens } : u));
      setSuccessMsg(`Updated balance for ${data.user.email} (+${change} tokens)`);
    } catch (err: any) {
      setError(err.message || "Failed to grant tokens.");
    } finally {
      setModifyingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06050e] text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        <p className="text-xs text-amber-300/80 uppercase tracking-widest font-mono">Opening Master Admin Center...</p>
      </div>
    );
  }

  if (error && (!stats || error.includes("Access Denied"))) {
    return (
      <div className="min-h-screen bg-[#06050e] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white font-serif italic">Admin Access Restricted</h2>
        <p className="text-xs text-slate-400 max-w-sm">
          {error || "Your account does not have master administrator privileges."}
        </p>
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#06050e] text-slate-100 font-sans flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      
      {/* 🔮 Luxury Ambient Mesh Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-amber-600/10 via-purple-900/15 to-transparent blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-bl from-pink-600/10 via-indigo-900/15 to-transparent blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* 🧭 Top Luxury Glass Navigation Bar */}
      <header className="w-full px-6 py-4 z-40 sticky top-0 bg-[#06050e]/80 backdrop-blur-2xl border-b border-amber-500/20 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-md">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2 font-serif">
                  Executive Control Center
                </h1>
                <span className="text-[9px] uppercase tracking-[0.25em] text-amber-300 font-extrabold block -mt-0.5">
                  Master Administrator
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-white/6 hover:bg-white/12 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Creator Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* 📊 Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 z-10 space-y-8">
        
        {/* Banner Alert Feedback */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-medium">{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white text-xs cursor-pointer">✕</button>
          </div>
        )}

        {/* 4 Stat Overview Bento Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-6 rounded-[28px] bg-gradient-to-b from-[#121024]/90 via-[#0a0815]/95 to-black/95 border border-white/8 backdrop-blur-md space-y-1 shadow-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Registered Users</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono">{stats?.totalUsers || 0}</div>
          </div>

          <div className="p-6 rounded-[28px] bg-gradient-to-b from-[#121024]/90 via-[#0a0815]/95 to-black/95 border border-white/8 backdrop-blur-md space-y-1 shadow-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Live Websites</span>
              <Globe className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono">{stats?.totalWebsites || 0}</div>
          </div>

          <div className="p-6 rounded-[28px] bg-gradient-to-b from-[#121024]/90 via-[#0a0815]/95 to-black/95 border border-white/8 backdrop-blur-md space-y-1 shadow-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Total RSVPs Logged</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono">{stats?.totalRsvps || 0}</div>
          </div>

          <div className="p-6 rounded-[28px] bg-gradient-to-b from-amber-500/15 via-[#0a0815]/95 to-black/95 border border-amber-500/30 backdrop-blur-md space-y-1 shadow-xl">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Active Promo Codes</span>
              <Gift className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-300 font-mono">{stats?.activePromoCodes || 0}</div>
          </div>
        </div>

        {/* 2-Column Split: Promo Code Generator & Active Codes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Promo Code Generator Card */}
          <div className="lg:col-span-1 p-7 rounded-[32px] bg-gradient-to-b from-[#180408]/90 via-[#0c0a18]/95 to-black/95 border border-amber-500/30 shadow-2xl space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 font-serif italic">
                <Gift className="w-5 h-5 text-amber-400" /> Generate Promo Code
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Create redeemable gift codes for free token distribution.
              </p>
            </div>

            <form onSubmit={handleCreatePromoCode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Code String</label>
                <input
                  type="text"
                  placeholder="e.g. FREEWEDDING / LAUNCH50"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-zinc-600 text-xs font-mono uppercase tracking-widest focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Tokens to Give</label>
                  <input
                    type="number"
                    min={1}
                    value={newTokens}
                    onChange={(e) => setNewTokens(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Max Redemptions</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0 = Unlimited"
                    value={newMaxUses}
                    onChange={(e) => setNewMaxUses(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={creatingCode || !newCode.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-amber-950/40"
              >
                {creatingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Create Promo Code</>}
              </button>
            </form>
          </div>

          {/* Active Promo Codes Table */}
          <div className="lg:col-span-2 p-7 rounded-[32px] bg-gradient-to-b from-[#121024]/90 via-[#0a0815]/95 to-black/95 border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 font-serif italic">
                <Coins className="w-5 h-5 text-amber-400" /> Active Promo Codes ({promoCodes.length})
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">1 Code / User Rule Enforced</span>
            </div>

            {promoCodes.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl space-y-2 bg-white/2">
                <Gift className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs text-slate-500">No promo codes created yet. Use the form on the left to create your first code.</p>
              </div>
            ) : (
              <div className="max-h-[280px] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                {promoCodes.map((p: any) => (
                  <div
                    key={p._id}
                    className="p-4 rounded-2xl bg-black/50 border border-white/6 hover:border-amber-500/30 transition-all flex items-center justify-between gap-3 shadow-md"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-amber-300 font-mono tracking-wider">{p.code}</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          +{p.tokensGranted} Token{p.tokensGranted > 1 ? "s" : ""}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Used: <span className="text-white font-bold">{p.usedCount}</span> / {p.maxUses === 0 ? "Unlimited" : p.maxUses} times
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeletePromoCode(p._id, p.code)}
                        className="p-2 rounded-xl bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer"
                        title="Delete Code"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* 💰 Live Token Pack Pricing Manager */}
        <div className="p-8 sm:p-10 rounded-[36px] bg-gradient-to-b from-[#180408]/90 via-[#0a0815]/95 to-black/95 border border-amber-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2 font-serif italic">
                <Coins className="w-5 h-5 text-amber-400" /> Token Pack Pricing Manager
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Change token pack prices in real-time. Any update here is immediately displayed in the user store and charged at checkout.
              </p>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-500/30 shadow-sm">
              ● Live Dynamic Sync
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricingPacks.map((pack) => (
              <div
                key={pack.packId}
                className="p-6 rounded-3xl bg-black/60 border border-white/8 hover:border-amber-500/40 space-y-4 transition-all shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{pack.name}</span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                    {pack.tokens} Token{pack.tokens > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-amber-400 uppercase">Selling Price (₹)</label>
                    <input
                      type="number"
                      defaultValue={pack.priceInr}
                      id={`price-inr-${pack.packId}`}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-amber-500/30 text-white font-mono font-bold text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Cutout / MRP (₹)</label>
                    <input
                      type="number"
                      defaultValue={pack.originalPriceInr || pack.priceInr * 2}
                      id={`price-orig-${pack.packId}`}
                      placeholder="e.g. 49"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-slate-300 font-mono font-bold text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Subtitle Tag</label>
                  <input
                    type="text"
                    defaultValue={pack.tagline}
                    id={`tagline-${pack.packId}`}
                    placeholder="e.g. Save 60% • ₹16 / site"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  onClick={() => {
                    const inrEl = document.getElementById(`price-inr-${pack.packId}`) as HTMLInputElement;
                    const origEl = document.getElementById(`price-orig-${pack.packId}`) as HTMLInputElement;
                    const tagEl = document.getElementById(`tagline-${pack.packId}`) as HTMLInputElement;
                    handleUpdatePrice(pack.packId, Number(inrEl.value), Number(origEl.value), tagEl.value);
                  }}
                  disabled={savingPackId === pack.packId}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-950/40"
                >
                  {savingPackId === pack.packId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Save className="w-3.5 h-3.5" /> Save Price</>}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* User Token Management Section */}
        <div className="p-8 sm:p-10 rounded-[36px] bg-gradient-to-b from-[#121024]/90 via-[#0a0815]/95 to-black/95 border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2 font-serif italic">
                <Users className="w-5 h-5 text-amber-400" /> User Token Management ({users.length} Users)
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Inspect registered users and manually grant or deduct tokens from their balance.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/60 border border-white/10 text-white placeholder:text-zinc-600 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="max-h-[380px] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
            {filteredUsers.map((u: any) => (
              <div
                key={u._id}
                className="p-4 rounded-2xl bg-black/50 border border-white/6 hover:border-amber-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{u.name}</h4>
                    {u.role === "admin" && (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono">{u.email}</p>
                </div>

                {/* Token Balance & Quick Actions */}
                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs">
                    🪙 {u.tokens ?? 1} Token{(u.tokens ?? 1) !== 1 ? "s" : ""}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleGrantTokens(u._id, 1)}
                      disabled={modifyingUserId === u._id}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase transition-all cursor-pointer"
                      title="Add 1 Token"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleGrantTokens(u._id, 5)}
                      disabled={modifyingUserId === u._id}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase transition-all cursor-pointer"
                      title="Add 5 Tokens"
                    >
                      +5
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* 📜 Footer */}
      <footer className="w-full py-6 text-center text-xs text-slate-500 border-t border-white/8">
        SealedVibe Master Administration & Licensing Infrastructure
      </footer>
    </div>
  );
}
