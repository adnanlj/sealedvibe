"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Coins,
  Sparkles,
  Gift,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  CreditCard,
  QrCode,
  ArrowRight,
} from "lucide-react";

interface TokenStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTokens?: number;
  onSuccess: (newTokens: number) => void;
}

export default function TokenStoreModal({
  isOpen,
  onClose,
  currentTokens = 0,
  onSuccess,
}: TokenStoreModalProps) {
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [purchasingPackId, setPurchasingPackId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [razorpayReady, setRazorpayReady] = useState(false);

  const [packs, setPacks] = useState<any[]>([
    {
      packId: "single",
      name: "Single Website",
      tokens: 1,
      priceInr: 19,
      originalPriceInr: 49,
      tagline: "1 Full Lifetime Website",
      isPopular: false,
    },
    {
      packId: "starter",
      name: "✨ Starter Pack",
      tokens: 3,
      priceInr: 49,
      originalPriceInr: 99,
      tagline: "Save 50% • ₹16.3 / site",
      isPopular: true,
    },
    {
      packId: "creator",
      name: "👑 Royal Creator",
      tokens: 10,
      priceInr: 149,
      originalPriceInr: 299,
      tagline: "Best Value • ₹14.9 / site",
      isPopular: false,
    },
  ]);

  // 🔒 Lock background scrolling on mobile & PC when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isOpen]);

  // Load Cashfree standard JS SDK v3
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).Cashfree) {
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Fetch live prices from database
  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setSuccessMsg(null);
    fetch("/api/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.packs && data.packs.length > 0) {
          setPacks(data.packs);
        }
      })
      .catch((err) => console.error("Failed to fetch live prices:", err));
  }, [isOpen]);

  if (!isOpen) return null;

  // Redeem Promo Code Handler
  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/promo/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to redeem code.");
      }

      setSuccessMsg(data.message || `🎉 Success! Granted +${data.tokensGranted} tokens!`);
      setPromoCode("");
      if (typeof data.tokens === "number") {
        onSuccess(data.tokens);
      }
    } catch (err: any) {
      setError(err.message || "Failed to redeem code.");
    } finally {
      setLoading(false);
    }
  };

  // Buy Pack via Cashfree Checkout
  const handleBuyPack = async (pack: any) => {
    setPurchasingPackId(pack.packId);
    setError(null);
    setSuccessMsg(null);

    try {
      // 1. Create order on server
      const orderRes = await fetch("/api/payments/cashfree/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId: pack.packId }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.paymentSessionId) {
        throw new Error(orderData.error || "Failed to create payment order.");
      }

      // 2. Launch Cashfree Drop-in / Modal Checkout
      if ((window as any).Cashfree) {
        const cashfree = (window as any).Cashfree({
          mode: orderData.environment === "PROD" ? "production" : "sandbox",
        });

        cashfree.checkout({
          paymentSessionId: orderData.paymentSessionId,
          redirectTarget: "_modal",
        }).then(async (result: any) => {
          if (result.error) {
            console.error("Cashfree checkout error:", result.error);
            setError(result.error.message || "Payment cancelled or failed.");
            setPurchasingPackId(null);
            return;
          }

          // Verify payment with server
          try {
            setLoading(true);
            const verifyRes = await fetch("/api/payments/cashfree/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: orderData.orderId }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setSuccessMsg(`🎉 Payment successful! Added +${verifyData.tokensAdded || orderData.tokens} tokens to your wallet.`);
              if (typeof verifyData.newTokens === "number") {
                onSuccess(verifyData.newTokens);
              }
            } else {
              setError("Payment was not completed. Please try again.");
            }
          } catch (vErr: any) {
            console.error("Verify Error:", vErr);
          } finally {
            setLoading(false);
            setPurchasingPackId(null);
          }
        });
      } else {
        // Fallback to standard redirect if SDK is blocked by browser
        window.location.href = `https://${orderData.environment === "PROD" ? "api" : "sandbox"}.cashfree.com/pg/orders/${orderData.orderId}`;
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Failed to initiate payment.");
      setPurchasingPackId(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          className="w-full max-w-xl rounded-t-[28px] sm:rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-amber-500/30 p-5 sm:p-8 shadow-2xl relative overflow-hidden text-slate-100 space-y-4 sm:space-y-6 max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto"
        >
          {/* Mobile Drag Indicator Pill */}
          <div className="w-10 h-1 rounded-full bg-white/20 mx-auto sm:hidden mb-1" />

          {/* Ambient Glow Stripe */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
          <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-amber-500/15 blur-[80px] pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-extrabold text-white flex items-center gap-1.5">
                  Token Store <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                </h2>
                <div className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1.5">
                  Balance: 
                  <span className="text-amber-300 font-bold font-mono px-1.5 py-0.2 bg-amber-500/20 border border-amber-500/30 rounded text-[11px] sm:text-xs">
                    {currentTokens} Token{currentTokens !== 1 ? "s" : ""}
                  </span>
                  <span className="text-[10px] text-slate-500 hidden sm:inline">(1 Token = 1 Website)</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Store"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 🎟️ Promo Code Redeem Box */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-amber-950/25 border border-amber-500/35 space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> Redeem Promo / Gift Code
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">Free Instant Tokens</span>
            </div>

            <form onSubmit={handleRedeem} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Code (e.g. LAUNCH50)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-black/60 border border-amber-500/30 text-white placeholder:text-zinc-600 text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={loading || !promoCode.trim()}
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1 cursor-pointer flex-shrink-0"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Redeem"}
              </button>
            </form>
          </div>

          {/* 💎 Live Token Packs Grid with Razorpay Checkout */}
          <div className="space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" /> Instant Token Packs (UPI / Card / NetBanking)
              </span>
              <span className="text-[9px] sm:text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Cashfree Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
              {packs.map((p) => {
                const isBuyingThis = purchasingPackId === p.packId;
                const isPopular = p.isPopular || p.popular;

                return (
                  <div
                    key={p.packId || p.id}
                    className={`p-3.5 sm:p-5 rounded-2xl border flex sm:flex-col justify-between items-center sm:items-stretch gap-3 relative transition-all ${
                      isPopular
                        ? "bg-gradient-to-r sm:bg-gradient-to-b from-amber-500/15 via-zinc-900 to-black border-amber-500/50 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/30"
                        : "bg-zinc-900/60 border-white/10 hover:border-amber-500/30"
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-2.5 left-4 sm:left-1/2 sm:-translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-md">
                        Popular Choice
                      </div>
                    )}

                    <div className="space-y-1 sm:space-y-2 text-left sm:text-center min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block truncate">
                        {p.name}
                      </span>
                      <div className="text-xl sm:text-3xl font-black text-white font-mono leading-tight">
                        {p.tokens} Token{p.tokens > 1 ? "s" : ""}
                      </div>
                      <div className="flex items-baseline justify-start sm:justify-center gap-1.5 flex-wrap">
                        <span className="text-sm sm:text-lg font-black text-amber-400 font-mono">
                          ₹{p.priceInr}
                        </span>
                        {p.originalPriceInr && p.originalPriceInr > p.priceInr ? (
                          <span className="text-xs text-slate-500 line-through font-mono font-semibold">
                            ₹{p.originalPriceInr}
                          </span>
                        ) : null}
                        {p.originalPriceInr && p.originalPriceInr > p.priceInr ? (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-extrabold">
                            {Math.round(((p.originalPriceInr - p.priceInr) / p.originalPriceInr) * 100)}% OFF
                          </span>
                        ) : null}
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-emerald-400 font-bold block truncate">{p.tagline || p.desc}</span>
                    </div>

                    <button
                      onClick={() => handleBuyPack(p)}
                      disabled={isBuyingThis || loading}
                      className={`w-auto sm:w-full px-4 sm:px-0 py-2.5 sm:py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 flex-shrink-0 ${
                        isPopular
                          ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black"
                          : "bg-white/10 hover:bg-white/15 text-white"
                      } disabled:opacity-60`}
                    >
                      {isBuyingThis ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> <span className="hidden sm:inline">Opening...</span>
                        </>
                      ) : (
                        <>
                          Pay ₹{p.priceInr} <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 text-center border-t border-white/5 space-y-1">
            <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>1 Token = 1 Lifetime Website with custom music, 3D animations & live RSVP.</span>
            </p>
            <p className="text-[9px] text-slate-500">
              Supports GPay, PhonePe, Paytm, BHIM UPI, Cards & NetBanking.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
