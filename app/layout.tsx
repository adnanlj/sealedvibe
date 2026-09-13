import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SealedVibe - Personalized 3D Memory Websites & Digital Invitations",
  description: "Create breathtaking 3D personal websites, royal digital wedding invitations, birthday keepsakes & emotional letters with interactive music, wax seal animations, and live RSVP tracking.",
  icons: {
    icon: [
      { url: "/sealedvibe_logo.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/sealedvibe_logo.png",
    apple: "/sealedvibe_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/sealedvibe_logo.png" />
        <link rel="apple-touch-icon" href="/sealedvibe_logo.png" />
        <link rel="shortcut icon" href="/sealedvibe_logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=Great+Vibes&family=MonteCarlo&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0b0a12] text-slate-100 antialiased min-h-screen flex flex-col selection:bg-purple-500/30 selection:text-purple-200">
        {children}
      </body>
    </html>
  );
}
