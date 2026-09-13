"use client";

import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { QrCode, Download, Copy, Check, Share2, X } from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "wedding" | "engagement" | "birthday_party";
  title?: string;
  names?: string;
  date?: string;
  time?: string;
  venue?: string;
  url?: string;
}

export default function QRCodeModal({
  isOpen,
  onClose,
  type,
  title,
  names,
  date,
  time,
  venue,
  url
}: QRCodeModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Compute live URL if not supplied
  const shareUrl = typeof window !== "undefined" ? (url || window.location.href) : (url || "https://www.sealedvibe.in");

  useEffect(() => {
    if (isOpen && shareUrl) {
      QRCode.toDataURL(shareUrl, {
        width: 480,
        margin: 2,
        color: {
          dark: type === "wedding" ? "#0f3a2a" : type === "engagement" ? "#1e3a29" : "#3d2b1f",
          light: "#ffffff"
        },
        errorCorrectionLevel: "H"
      })
        .then((dataUri) => {
          setQrDataUrl(dataUri);
        })
        .catch((err) => {
          console.error("QR Code Generation Error:", err);
        });
    }
  }, [isOpen, shareUrl, type]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    let text = "";
    if (type === "wedding") {
      text = `👑 You're cordially invited to the Royal Wedding of ${names || "Adnan & Sujan"}!\n\n📅 Date: ${date || "Dec 18, 2035"}\n📍 Venue: ${venue || "The Royal Grand Palace"}\n\n✨ View our digital invitation & RSVP here: ${shareUrl}`;
    } else if (type === "engagement") {
      text = `💍 You're warmly invited to the Engagement & Ring Ceremony of ${names || "Adnan & Sujan"}!\n\n🌿 Date: ${date || "Nov 20, 2030"}\n📍 Venue: ${venue || "The Botanical Meadow"}\n\n🌸 View our botanical invitation & RSVP here: ${shareUrl}`;
    } else {
      text = `🎉 You're invited to ${names ? `${names}'s Birthday Celebration` : "our Grand Birthday Party"}!\n\n📅 Date: ${date || "Aug 18, 2027"}\n📍 Venue: ${venue || "The Grand Imperial Ballroom"}\n\n🎂 View party details, RSVP & request your favorite DJ songs here: ${shareUrl}`;
    }
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  // Download high-resolution themed canvas card
  const handleDownloadCard = async () => {
    if (!qrDataUrl) return;
    setIsDownloading(true);

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = 1000;
      const height = 1400;
      canvas.width = width;
      canvas.height = height;

      if (type === "wedding") {
        // Emerald & Gold Royal Theme
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, "#062319");
        bgGrad.addColorStop(0.5, "#0b3d2b");
        bgGrad.addColorStop(1, "#041811");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Gold border
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 4;
        ctx.strokeRect(36, 36, width - 72, height - 72);
        ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(48, 48, width - 96, height - 96);

        // Title
        ctx.textAlign = "center";
        ctx.font = "italic 28px serif";
        ctx.fillStyle = "#e6ca65";
        ctx.fillText("ROYAL WEDDING INVITATION", width / 2, 130);

        ctx.font = "bold 52px serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(names || "Adnan & Sujan", width / 2, 210);

        ctx.font = "24px serif";
        ctx.fillStyle = "#a7f3d0";
        ctx.fillText("— ⚜️ THE SACRED UNION ⚜️ —", width / 2, 260);

        if (date) {
          ctx.font = "26px sans-serif";
          ctx.fillStyle = "#fef08a";
          ctx.fillText(`📅 ${date}${time ? ` • ${time}` : ""}`, width / 2, 320);
        }

        if (venue) {
          ctx.font = "22px sans-serif";
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.fillText(`📍 ${venue}`, width / 2, 360);
        }

        // QR Box
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(width / 2 - 190, 420, 380, 380, 24);
        ctx.fill();

        // Draw QR
        const qrImg = new Image();
        qrImg.crossOrigin = "anonymous";
        await new Promise((res) => {
          qrImg.onload = res;
          qrImg.src = qrDataUrl;
        });
        ctx.drawImage(qrImg, width / 2 - 160, 450, 320, 320);

        ctx.font = "bold 26px sans-serif";
        ctx.fillStyle = "#d4af37";
        ctx.fillText("SCAN WITH PHONE CAMERA", width / 2, 860);

        ctx.font = "20px sans-serif";
        ctx.fillStyle = "#a7f3d0";
        ctx.fillText("To View Interactive Invitation & RSVP", width / 2, 900);

        ctx.font = "18px sans-serif";
        ctx.fillStyle = "rgba(212, 175, 55, 0.7)";
        ctx.fillText("✨ Created with SealedVibe ✨", width / 2, height - 70);

      } else if (type === "engagement") {
        // Botanical Sage & Ivory Theme
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, "#193524");
        bgGrad.addColorStop(0.5, "#254832");
        bgGrad.addColorStop(1, "#14281b");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Sage border
        ctx.strokeStyle = "#c5a880";
        ctx.lineWidth = 4;
        ctx.strokeRect(36, 36, width - 72, height - 72);
        ctx.strokeStyle = "rgba(197, 168, 128, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(48, 48, width - 96, height - 96);

        // Title
        ctx.textAlign = "center";
        ctx.font = "italic 28px serif";
        ctx.fillStyle = "#e2d2ba";
        ctx.fillText("ENGAGEMENT & RING CEREMONY", width / 2, 130);

        ctx.font = "bold 52px serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(names || "Adnan & Sujan", width / 2, 210);

        ctx.font = "24px serif";
        ctx.fillStyle = "#bbf7d0";
        ctx.fillText("🌿 — A BOTANICAL CELEBRATION — 🌿", width / 2, 260);

        if (date) {
          ctx.font = "26px sans-serif";
          ctx.fillStyle = "#fef08a";
          ctx.fillText(`💍 ${date}${time ? ` • ${time}` : ""}`, width / 2, 320);
        }

        if (venue) {
          ctx.font = "22px sans-serif";
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.fillText(`📍 ${venue}`, width / 2, 360);
        }

        // QR Box
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(width / 2 - 190, 420, 380, 380, 24);
        ctx.fill();

        // Draw QR
        const qrImg = new Image();
        qrImg.crossOrigin = "anonymous";
        await new Promise((res) => {
          qrImg.onload = res;
          qrImg.src = qrDataUrl;
        });
        ctx.drawImage(qrImg, width / 2 - 160, 450, 320, 320);

        ctx.font = "bold 26px sans-serif";
        ctx.fillStyle = "#e2d2ba";
        ctx.fillText("SCAN WITH PHONE CAMERA", width / 2, 860);

        ctx.font = "20px sans-serif";
        ctx.fillStyle = "#bbf7d0";
        ctx.fillText("To View Botanical Invitation & RSVP", width / 2, 900);

        ctx.font = "18px sans-serif";
        ctx.fillStyle = "rgba(226, 210, 186, 0.7)";
        ctx.fillText("🌿 Created with SealedVibe 🌿", width / 2, height - 70);

      } else {
        // Luxury Champagne & Rose Gold Birthday Party
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, "#fffdf9");
        bgGrad.addColorStop(0.5, "#fff9f0");
        bgGrad.addColorStop(1, "#fdf5ea");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Gold border
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 4;
        ctx.strokeRect(36, 36, width - 72, height - 72);
        ctx.strokeStyle = "rgba(212, 175, 55, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(48, 48, width - 96, height - 96);

        // Title
        ctx.textAlign = "center";
        ctx.font = "italic 28px serif";
        ctx.fillStyle = "#996515";
        ctx.fillText("BIRTHDAY PARTY INVITATION", width / 2, 130);

        ctx.font = "bold 50px serif";
        ctx.fillStyle = "#2d2013";
        ctx.fillText(names ? `${names}'s Celebration` : "Grand Birthday Soirée", width / 2, 210);

        ctx.font = "24px serif";
        ctx.fillStyle = "#b48b3b";
        ctx.fillText("🎈 — VIP GUEST INVITATION — 🎈", width / 2, 260);

        if (date) {
          ctx.font = "bold 26px sans-serif";
          ctx.fillStyle = "#854d0e";
          ctx.fillText(`📅 ${date}${time ? ` • ${time}` : ""}`, width / 2, 320);
        }

        if (venue) {
          ctx.font = "22px sans-serif";
          ctx.fillStyle = "#5c4033";
          ctx.fillText(`📍 ${venue}`, width / 2, 360);
        }

        // QR Box
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(180, 139, 59, 0.25)";
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.roundRect(width / 2 - 190, 420, 380, 380, 24);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = "#e5c578";
        ctx.lineWidth = 2;
        ctx.strokeRect(width / 2 - 190, 420, 380, 380);

        // Draw QR
        const qrImg = new Image();
        qrImg.crossOrigin = "anonymous";
        await new Promise((res) => {
          qrImg.onload = res;
          qrImg.src = qrDataUrl;
        });
        ctx.drawImage(qrImg, width / 2 - 160, 450, 320, 320);

        ctx.font = "bold 26px sans-serif";
        ctx.fillStyle = "#996515";
        ctx.fillText("SCAN WITH PHONE CAMERA", width / 2, 860);

        ctx.font = "20px sans-serif";
        ctx.fillStyle = "#78350f";
        ctx.fillText("To RSVP & Request DJ Songs 🎶", width / 2, 900);

        ctx.font = "18px sans-serif";
        ctx.fillStyle = "rgba(153, 101, 21, 0.7)";
        ctx.fillText("✨ Created with SealedVibe ✨", width / 2, height - 70);
      }

      // Download file
      const link = document.createElement("a");
      link.download = `${type}_invitation_qr_card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Error downloading card:", e);
    } finally {
      setIsDownloading(false);
    }
  };

  const getThemeDetails = () => {
    if (type === "wedding") {
      return {
        bg: "from-[#062319] via-[#093525] to-[#041811]",
        border: "border-amber-400/50 shadow-emerald-950/80",
        goldText: "text-amber-300",
        subText: "text-emerald-200/90",
        title: "Royal Wedding Invitation",
        icon: "👑",
        subtitle: "The Sacred Union of Love",
        rsvpNote: "Scan to View Royal Invitation & RSVP"
      };
    }
    if (type === "engagement") {
      return {
        bg: "from-[#193524] via-[#244733] to-[#122619]",
        border: "border-amber-300/40 shadow-emerald-950/80",
        goldText: "text-amber-200",
        subText: "text-emerald-100/90",
        title: "Engagement & Ring Ceremony",
        icon: "💍",
        subtitle: "A Botanical Garden Celebration",
        rsvpNote: "Scan to View Botanical Invitation & RSVP"
      };
    }
    // Birthday Party
    return {
      bg: "from-[#fffdf9] via-[#fcf6ed] to-[#f7eedc]",
      border: "border-[#d4af37]/60 shadow-amber-900/15",
      goldText: "text-[#996515]",
      subText: "text-[#5c4033]",
      title: "Birthday Party Invitation",
      icon: "🎉",
      subtitle: "Milestone Celebration Soirée",
      rsvpNote: "Scan to RSVP & Request DJ Songs 🎶"
    };
  };

  const theme = getThemeDetails();
  const isLight = type === "birthday_party";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl transition-all duration-300">
        <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-b ${theme.bg} ${theme.border} border-2 relative overflow-hidden`}>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
              isLight ? "bg-amber-100 hover:bg-amber-200 text-[#5c4033]" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Card Preview Container */}
          <div ref={cardRef} className="text-center space-y-4">
            
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border border-current/20 shadow-sm">
              <span>{theme.icon}</span>
              <span className={theme.goldText}>{theme.title}</span>
            </div>

            {/* Event & Names */}
            <div>
              <h3 className={`text-2xl sm:text-3xl font-bold font-serif ${isLight ? "text-[#2d2013]" : "text-white"}`}>
                {names || title || "Event Invitation"}
              </h3>
              <p className={`text-xs sm:text-sm italic mt-1 font-serif ${theme.subText}`}>
                {theme.subtitle}
              </p>
            </div>

            {/* Date & Venue pill */}
            {(date || venue) && (
              <div className={`p-2.5 rounded-xl text-xs space-y-1 ${isLight ? "bg-amber-50/80 border border-amber-200/70" : "bg-white/5 border border-white/10"}`}>
                {date && (
                  <p className={`font-semibold ${isLight ? "text-amber-900" : "text-amber-300"}`}>
                    📅 {date} {time ? `• ${time}` : ""}
                  </p>
                )}
                {venue && (
                  <p className={`truncate ${isLight ? "text-[#5c4033]" : "text-white/80"}`}>
                    📍 {venue}
                  </p>
                )}
              </div>
            )}

            {/* QR Code Frame */}
            <div className="flex flex-col items-center justify-center pt-2">
              <div className={`p-3.5 rounded-2xl bg-white shadow-xl border-2 ${isLight ? "border-amber-300/80 shadow-amber-900/10" : "border-amber-400/40 shadow-emerald-950/60"}`}>
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Invitation QR Code"
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-gray-50 text-gray-400">
                    <QrCode className="w-12 h-12 animate-pulse" />
                  </div>
                )}
              </div>
              <p className={`text-xs font-semibold mt-3.5 tracking-wide ${theme.goldText}`}>
                {theme.rsvpNote}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 grid grid-cols-2 gap-2.5">
              <button
                onClick={handleDownloadCard}
                disabled={isDownloading}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all ${
                  isLight
                    ? "bg-[#d4af37] hover:bg-[#c29d2b] text-white cursor-pointer"
                    : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold cursor-pointer"
                }`}
              >
                <Download className="w-4 h-4" />
                {isDownloading ? "Generating..." : "Download Card"}
              </button>

              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                Share WhatsApp
              </button>
            </div>

            {/* Copy Link Row */}
            <div className="pt-1">
              <button
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  isLight
                    ? "border-amber-200/80 bg-amber-50/50 hover:bg-amber-100/60 text-[#5c4033]"
                    : "border-white/15 bg-white/5 hover:bg-white/10 text-white/90"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[280px]">Copy Invitation Link</span>
                  </>
                )}
              </button>
            </div>

            <p className={`text-[10px] tracking-wider opacity-60 ${isLight ? "text-[#5c4033]" : "text-white"}`}>
              ✨ SealedVibe Digital Luxury Invitations ✨
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
