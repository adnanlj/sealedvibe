# 🏛️ SealedVibe — Master System Architecture & Engineering Blueprint

> **A Comprehensive Guide to the High-Level, Low-Level, AI, and Rendering Architecture of SealedVibe**

---

## 📑 Table of Contents
1. [System Overview & Core Philosophy](#1-system-overview--core-philosophy)
2. [High-Level Architecture (Visual Diagram)](#2-high-level-architecture-visual-diagram)
3. [End-to-End User Journey & Data Flow](#3-end-to-end-user-journey--data-flow)
4. [The AI Story-Weaving & Fanbase Engine (Groq LPU)](#4-the-ai-story-weaving--fanbase-engine-groq-lpu)
5. [The No-Code 3D Engine & Dynamic Slot Injection](#5-the-no-code-3d-engine--dynamic-slot-injection)
6. [Low-Level Database Architecture & Entity Models](#6-low-level-database-architecture--entity-models)
7. [Digital Audio Processing (Web Audio API Synthesizer)](#7-digital-audio-processing-web-audio-api-synthesizer)
8. [60-FPS Canvas Physics & Particle Simulation](#8-60-fps-canvas-physics--particle-simulation)
9. [Recipient Unboxing: 3D Envelope Finite State Machine](#9-recipient-unboxing-3d-envelope-finite-state-machine)
10. [Cashfree Payment Lifecycle & Concurrency Control](#10-cashfree-payment-lifecycle--concurrency-control)
11. [Security, Authentication & Rate-Limiting Shield](#11-security-authentication--rate-limiting-shield)
12. [Cloud Infrastructure, Vercel Serverless & Deployment](#12-cloud-infrastructure-vercel-serverless--deployment)

---

## 1. System Overview & Core Philosophy

**SealedVibe** is an emotionally immersive, dynamic web experience platform that converts simple memories, confessions, romantic proposals, apologies, and event invitations into **living, interactive 3D digital keepsakes**.

### 🌟 The Core Innovation: Zero Manual Coding
Traditional web design requires writing HTML, CSS, and animations for each client. SealedVibe replaces this with a **Two-Tier Engine**:
* **Tier 1 (The AI Story Architect)**: Uses high-speed LLM inference (Groq) with invisible system prompts to structure raw personal thoughts and pop-culture fandoms into standardized JSON data blocks.
* **Tier 2 (The Client-Side 3D Skeleton Engine)**: A pre-built, GPU-accelerated interactive web component (`RomanticProposal.tsx` / `ApologyClient.tsx`) that pulls the JSON from the database and dynamically slots names, vows, songs, and physics games into place in milliseconds.

---

## 2. High-Level Architecture (Visual Diagram)

### 🗺️ Visual Architecture Map

```
====================================================================================================
                                      1. CLIENT ACCESS LAYER
====================================================================================================
       [ 👨‍💻 Creator Device ]                                  [ 👩‍❤️‍👨 Recipient Device ]
   (Creates site, buys tokens,                             (Unseals 3D envelope, listens to
    tracks real-time read receipts)                         music, interacts with vows & games)
                 │                                                          │
                 └──────────────────────────┬───────────────────────────────┘
                                            ▼
====================================================================================================
                               2. EDGE ROUTING & SECURITY LAYER
====================================================================================================
                        ┌──────────────────────────────────────┐
                        │      VERCEL GLOBAL EDGE NETWORK      │
                        │ • Global CDN (Cached Images/Fonts)   │
                        │ • DDoS Protection & HSTS Headers     │
                        │ • Automatic HTTPS & SSL Termination  │
                        └──────────────────┬───────────────────┘
                                           ▼
====================================================================================================
                           3. SERVERLESS APPLICATION ENGINE (Next.js 16)
====================================================================================================
 ┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────────┐  ┌────────────────────┐
 │  🔐 Auth & Sessions  │  │  🤖 AI Director API  │  │  💳 Cashfree Engine │  │ 📊 Tracking Engine │
 │ • Google OAuth 2.0   │  │ • Multi-Key Failover │  │ • Order Generation  │  │ • First Open Time  │
 │ • JWT HS256 Cookies  │  │ • JSON Structuring   │  │ • Signature Verify  │  │ • View Counter     │
 │ • Bcrypt Hash (w:10) │  │ • Prompt Engineering │  │ • Atomic Token Add  │  │ • Response Notes   │
 └──────────┬───────────┘  └──────────┬───────────┘  └──────────┬──────────┘  └─────────┬──────────┘
            │                         │                         │                       │
            └─────────────────────────┼─────────────────────────┼───────────────────────┘
                                      ▼
====================================================================================================
                               4. THIRD-PARTY & CLOUD SERVICES
====================================================================================================
      ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
      │   ⚡ Groq AI Cloud    │   │  🏦 Cashfree Payment  │   │  📸 Unsplash CDN API  │
      │ • Llama-3 70B Engine  │   │ • UPI, Cards, NetBank │   │ • Automatic Aesthetic │
      │ • Sub-second Response │   │ • Webhook Verification│   │   Background Search   │
      └───────────────────────┘   └───────────────────────┘   └───────────────────────┘
                                      │
====================================================================================================
                               5. DATABASE & PERSISTENCE LAYER
====================================================================================================
                        ┌──────────────────────────────────────┐
                        │         MONGODB ATLAS CLOUD          │
                        │  (Global Cached Mongoose Connection) │
                        ├──────────────────┬───────────────────┤
                        │ • Users & Wallet │ • Orders & Trans  │
                        │ • Keepsakes Data │ • IP Rate Limits  │
                        └──────────────────┴───────────────────┘
```

---

## 3. End-to-End User Journey & Data Flow

Below is the step-by-step sequence of events from website creation to recipient response:

```
CREATOR                         SEALEDVIBE BACKEND                 GROQ AI / DB                 RECIPIENT
   │                                     │                               │                          │
   │─── 1. Enters names, memories, ─────>│                               │                          │
   │       fandom ("Taylor Swift")       │                               │                          │
   │                                     │─── 2. Invokes Master Prompt ─>│                          │
   │                                     │       with invisible schema   │                          │
   │                                     │<── 3. Returns Structured JSON ┤ (Groq)                   │
   │                                     │       (Chapters, Vows, Quotes)│                          │
   │                                     │                               │                          │
   │                                     │─── 4. Saves to MongoDB ──────>│ (MongoDB)                │
   │                                     │       under unique slug       │                          │
   │<── 5. Receives live link ───────────┤                               │                          │
   │       (sealedvibe.in/p/sara-7x8q)   │                               │                          │
   │                                                                                                │
   │─── 6. Sends link to Partner on WhatsApp / Instagram ──────────────────────────────────────────>│
   │                                                                                                │
   │                                     │<── 7. Opens URL & requests keepsake data ────────────────│
   │                                     │─── 8. Sends JSON to recipient browser ──────────────────>│
   │                                     │                                                          │
   │                                     │                                                          │── 9. Browser synthesizes harp
   │                                     │                                                          │   music, opens 3D wax seal,
   │                                     │                                                          │   and renders falling petals
   │                                     │                                                          │
   │                                     │<── 10. Recipient clicks YES and types reply note ────────┤
   │                                     │─── 11. Stores response note & timestamp in DB ──────────>│
   │<── 12. Creator Dashboard updates ───┤
   │       with live read receipt & note │
```

---

## 4. The AI Story-Weaving & Fanbase Engine (Groq LPU)

When a user provides basic input, our server does not send it raw to Groq. Instead, it wraps the data inside an **Invisible Master System Prompt** (`app/api/generate/route.ts` & `app/api/generate-draft/route.ts`).

### 🧠 How Pop-Culture Obsessions Become Metaphors

```
┌───────────────────────────┐
│ User enters:              │
│ "Obsession: Taylor Swift" │
└─────────────┬─────────────┘
              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ INVISIBLE MASTER DIRECTIVE TO GROQ:                                         │
│ "Weave their obsession into Act II as poetic metaphors of connection rather │
│  than a plain list. Match the emotional tone to cinematic romance."         │
└─────────────┬───────────────────────────────────────────────────────────────┘
              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ GROQ OUTPUT (Structured JSON):                                              │
│ "Like an invisible string tying our worlds together, you turned every       │
│  ordinary moment into something enchanted. You are my forever lover."       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 📋 Fanbase Translation Reference Matrix

| Fanbase Provided | How Groq Weaves It Into Story Chapters & Vows | Visual Backdrop Matching |
| :--- | :--- | :--- |
| **Taylor Swift** | References *"invisible strings"*, *"enchanted memories"*, and *"midnight conversations"*. | Lavender haze aesthetic skies |
| **Harry Potter** | Uses *"Golden Snitch"*, *"Patronus of joy"*, and *"After all this time? Always"*. | Warm candlelight / starry library |
| **Marvel / Sci-Fi** | Blends metaphors of *"in every universe, across every timeline, my heart finds you"*. | Cosmic galaxy & nebula backdrops |
| **Anime / Romance** | Weaves *"the red string of fate"* and *"destined cross-paths"*. | Soft cherry blossom landscapes |

---

## 5. The No-Code 3D Engine & Dynamic Slot Injection

SealedVibe does **not** generate new code files when someone creates a website. Instead, the application uses a **Master Interactive 3D Skeleton Component** (`RomanticProposal.tsx` / `ApologyClient.tsx`).

```
=========================================================================================
                           MASTER 3D ENGINE (RomanticProposal.tsx)
=========================================================================================

  [Slot: Wax Seal] ───────> Injects: Recipient Name & Creator Name
  
  [Slot: Background] ─────> Injects: Falling Rose Petals Canvas + Unsplash Aesthetic Photo
  
  [Slot: Audio Engine] ───> Injects: YouTube Track OR Web Audio Harp Synthesizer
  
  [Slot: Story Module] ───> Injects: Act I (Meeting), Act II (Metaphor), Act III (The Vow)
  
  [Slot: Constellations] ─> Injects: 3 Interactive Star Alignment Nodes & Celestial Quotes
  
  [Slot: Love Coupons] ───> Injects: 3 Redeemable Passes ("1x Warm Hug", "1x Late Drive")
  
  [Slot: Secret Whispers] ─> Injects: 3D CSS Perspective Flip Cards with Hidden Love Letters
  
  [Slot: Dodge Button] ───> Injects: Spring Physics Evasion Game for the "No" button
  
  [Slot: YES Finale] ─────> Injects: 180-Particle Confetti Shower + Partner Reply Form
=========================================================================================
```

When a user visits `https://sealedvibe.in/p/their-slug`, the master component mounts, fetches the stored JSON, and fills each slot in less than **100 milliseconds**.

---

## 6. Low-Level Database Architecture & Entity Models

The application utilizes **MongoDB Atlas** managed via **Mongoose**. Below are the core database schemas and their relationships:

```
┌──────────────────────────┐               ┌──────────────────────────┐
│          USER            │               │         APOLOGY          │
├──────────────────────────┤ 1           * ├──────────────────────────┤
│ _id: ObjectId (PK)       │──────────────<│ _id: ObjectId (PK)       │
│ name: String             │               │ creatorId: ObjectId (FK) │
│ email: String (Unique)   │               │ slug: String (Unique)    │
│ passwordHash: String     │               │ creatorName: String      │
│ googleId: String         │               │ recipientName: String    │
│ tokens: Number           │               │ occasion: String         │
│ role: 'user' | 'admin'   │               │ proposalData: Object     │
│ resetToken: String       │               │ viewCount: Number        │
│ resetTokenExpiry: Date   │               │ firstViewedAt: Date      │
└────────────┬─────────────┘               │ status: 'pending'|'paid' │
             │                             └──────────────────────────┘
             │ 1
             │
             │ *
┌────────────▼─────────────┐
│          ORDER           │
├──────────────────────────┤
│ _id: ObjectId (PK)       │
│ userId: ObjectId (FK)    │
│ orderId: String (Unique) │
│ paymentId: String        │
│ packId: String           │
│ tokens: Number           │
│ amount: Number (INR)     │
│ status: 'created'|'paid' │
│ receipt: String          │
└──────────────────────────┘
```

### Data Dictionary

1. **`User` (`models/User.ts`)**: Manages authentication, OAuth identities, password hashes, and the user's available token balance for site creation.
2. **`Apology` (`models/Apology.ts`)**: Stores the full payload of a personalized site (chapters, promises, coupons, YouTube song, passcode, read receipts, and partner reply notes).
3. **`Order` (`models/Order.ts`)**: Tracks payment orders initiated via Cashfree, payment verification IDs, and token fulfillment statuses.
4. **`RateLimit` (`models/RateLimit.ts`)**: Implements IP-based sliding window rate limiting with a 15-minute MongoDB TTL (Time-To-Live) index for automatic record cleanup.

---

## 7. Digital Audio Processing (Web Audio API Synthesizer)

To ensure romantic background music plays even when external YouTube links are absent or blocked, SealedVibe features a **pure client-side Web Audio API synthesizer** (`RomanticProposalAudioEngine` in `RomanticProposal.tsx`):

```
                               AUDIO DSP ROUTING GRAPH
                               
┌────────────────────────────────┐
│  5x SINE OSCILLATORS           │
│  Fundamental Chord Frequencies:│
│  A2 (110.0 Hz), E3 (164.8 Hz)  │───> [ Lowpass Filter ] ───> [ Gain Node ] ──┐
│  A3 (220.0 Hz), C#4 (277.2 Hz) │     (Cutoff: 340 Hz)        (Fixed: 0.018)  │
│  E4 (329.6 Hz)                 │                                             │
└────────────────────────────────┘                                             │
                                                                               ├─> [ 🔊 AudioDestination ]
┌────────────────────────────────┐                                             │   (Speaker / Headphones)
│  TRIANGLE OSCILLATOR           │                                             │
│  Pentatonic Melody Sequencer:  │───> [ Biquad Filter ]  ───> [ Gain Node ] ──┘
│  Notes: 220 Hz - 880 Hz        │     (Cutoff: Freq*2.8)      (Exponential Decay)
│  Trigger Clock: Every 540ms    │                             0.048 ➔ 0.0001 over 1.8s
└────────────────────────────────┘
```

* **Ambient Twilight Pad**: 5 sine oscillators generate a soothing drone filtered through a 340 Hz lowpass filter to eliminate harsh frequencies.
* **Acoustic Harp Pluck**: A triangle oscillator plays a pentatonic acoustic melody. Each pluck triggers an exponential volume ramp that decays smoothly over 1.8 seconds, simulating a physical plucked string.

---

## 8. 60-FPS Canvas Physics & Particle Simulation

The ambient drifting rose petals, stardust, and shooting stars run entirely on the recipient's GPU via an **HTML5 Canvas 60 FPS animation loop**:

```
                       CANVAS KINEMATIC UPDATE CYCLE
                       
     ┌────────────────────────────────────────────────────────┐
     │  1. Clear Canvas Frame (clearRect)                     │
     └───────────────────────────┬────────────────────────────┘
                                 ▼
     ┌────────────────────────────────────────────────────────┐
     │  2. Update Position:                                   │
     │     y = y + speedY                                     │
     │     x = x + speedX                                     │
     │     angle = angle + rotationSpeed                      │
     └───────────────────────────┬────────────────────────────┘
                                 ▼
     ┌────────────────────────────────────────────────────────┐
     │  3. Boundary Check:                                    │
     │     If (y > ScreenHeight + 20) ➔ Reset y = -20         │
     │     Spawn at random x across screen width              │
     └───────────────────────────┬────────────────────────────┘
                                 ▼
     ┌────────────────────────────────────────────────────────┐
     │  4. Shooting Star Generator (Poisson Timer: 5s - 13s)  │
     │     Speed = 7-12 px/frame, Trail Length = 70-120 px    │
     │     Alpha Decay = -0.025 per frame                     │
     └───────────────────────────┬────────────────────────────┘
                                 ▼
     ┌────────────────────────────────────────────────────────┐
     │  5. Render Geometry (Bézier Petal / Arc Stardust)      │
     └───────────────────────────┬────────────────────────────┘
                                 ▼
     ┌────────────────────────────────────────────────────────┐
     │  6. requestAnimationFrame(renderLoop)                  │
     └────────────────────────────────────────────────────────┘
```

---

## 9. Recipient Unboxing: 3D Envelope Finite State Machine

The recipient unboxing journey follows a deterministic, 5-stage animation state machine:

```
[ State: "sealed" ]
   │
   │  Recipient taps on Wax Seal
   ▼
[ State: "seal_broken" ]  ───► Confetti burst (65 particles)
   │
   │  Wait 300ms
   ▼
[ State: "flap_open" ]    ───► Envelope top flap unfolds upward in 3D
   │
   │  Wait 400ms
   ▼
[ State: "letter_out" ]   ───► Letter slides out + Background music starts + 100-particle confetti
   │
   │  Recipient clicks "Enter Full Website"
   ▼
[ State: "full_site_open" ] ─► Page scrolls smoothly into Story Chapters, Vows, Star Map & Dodge Game
```

---

## 10. Cashfree Payment Lifecycle & Concurrency Control

To ensure complete financial integrity and prevent double-crediting of token packs, the payment architecture uses atomic operations:

```
CUSTOMER                        TOKEN STORE MODAL                  SEALEDVIBE API                  CASHFREE PG
   │                                    │                                 │                             │
   │─── 1. Selects Token Pack ─────────>│                                 │                             │
   │       ("Starter Pack - ₹49")       │                                 │                             │
   │                                    │─── 2. POST /api/payments/order ─>│                            │
   │                                    │       { packId: "starter" }     │                             │
   │                                    │                                 │─── 3. Create PG Session ───>│
   │                                    │<── 4. Returns paymentSessionId ──┤<── 4. Returns Session ID ───┤
   │                                    │                                 │                             │
   │                                    │─── 5. Opens Cashfree Modal ──────────────────────────────────>│
   │<── 6. Pays via UPI / Card / NetBanking ────────────────────────────────────────────────────────────│
   │                                    │<── 7. Checkout Success Callback ──────────────────────────────┤
   │                                    │                                 │                             │
   │                                    │─── 8. POST /api/payments/verify ─>│                           │
   │                                    │       { orderId }               │─── 9. Queries Status ──────>│
   │                                    │                                 │<── 10. order_status: PAID ──┤
   │                                    │                                 │                             │
   │                                    │                                 │── [ Atomic Lock Check ] ────┐
   │                                    │                                 │   Order status != 'paid'?   │
   │                                    │                                 │   Set status = 'paid'       │
   │                                    │                                 │   User.tokens += pack.tokens│
   │                                    │                                 │◄── [ End Atomic Lock ] ─────┘
   │                                    │                                 │
   │<── 11. Modal displays success & updated tokens ──────────────────────┤
```

---

## 11. Security, Authentication & Rate-Limiting Shield

| Layer | Implementation | Protection Mechanism |
| :--- | :--- | :--- |
| **Passwords** | Bcrypt (Work Factor 10) | One-way cryptographic hashing against rainbow table attacks. |
| **Sessions** | JWT Signed with HS256 (`lib/session.ts`) | Stored in `httpOnly`, `sameSite: "lax"`, and `secure` cookies to block XSS theft. |
| **API Rate Limiting** | Sliding Window via MongoDB TTL (`lib/rateLimit.ts`) | Caps website generation at 5 requests/min and auth attempts at 10 requests/min. |
| **Headers** | Next.js Security Headers (`next.config.ts`) | `Strict-Transport-Security` (HSTS), `X-Frame-Options: SAMEORIGIN`, and `X-Content-Type-Options: nosniff`. |
| **Passcode Locks** | Recipient Envelopes (`/api/verify-passcode`) | Allows creators to password-protect sensitive anniversary/apology letters. |

---

## 12. Cloud Infrastructure, Vercel Serverless & Deployment

```
┌─────────────────────────────────┐
│     GITHUB REPOSITORY           │
│     adnanlj/sealedvibe          │
└────────────────┬────────────────┘
                 │ git push origin main
                 ▼
┌─────────────────────────────────┐
│   VERCEL CI/CD PIPELINE         │
│ • Production Bundle Optimizer   │
│ • Turbopack Next.js Compiler    │
│ • Extended MaxDuration: 30s     │
└────────────────┬────────────────┘
                 │ Automatic Deploy
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                 LIVE PRODUCTION DEPLOYMENT                  │
│               Domain: https://sealedvibe.in                 │
│                                                             │
│ • Serverless Compute: 100,000 requests/day (Free Tier)      │
│ • Edge CDN Bandwidth: 100 GB/month (100,000+ monthly visits)│
│ • Telemetry: Real-time traffic via @vercel/analytics        │
└─────────────────────────────────────────────────────────────┘
```

---

### 📊 Summary Checklist

* ✅ **High-Level System Design**: Documented with visual ASCII architecture maps.
* ✅ **Low-Level Specifications**: Documented with exact database schemas, DSP audio routing, and canvas physics equations.
* ✅ **Backstage AI Mechanics**: Full walkthrough of Groq system prompts and fandom metaphor weaving.
* ✅ **Rendering & No-Code Mechanism**: Detailed explanation of dynamic JSON slot injection.
* ✅ **Payments & Security**: Detailed Cashfree concurrency control, rate limiting, and session security.

*Document maintained under the **SealedVibe Engineering Standard**.*
