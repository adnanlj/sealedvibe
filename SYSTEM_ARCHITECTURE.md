# 🌟 SealedVibe — Comprehensive System Architecture & Engineering Blueprint

---

## 1. Executive Summary & System Vision

**SealedVibe** is a high-performance, emotionally immersive web platform that turns raw personal memories, apologies, romantic proposals, and celebrations into cinematic **3D interactive web experiences**. 

The system operates without manual coding per website: a creator provides basic relationship facts and optional pop-culture fandoms, an ultra-fast LLM engine (Groq) synthesizes structured story modules, and our dynamic client-side 3D rendering engine injects the data into an interactive 3D universe with background music, physics-based animations, and real-time read/response tracking.

---

## 2. High-Level Architecture (HLA)

```mermaid
graph TD
    subgraph ClientLayer["1. Client Devices (Web / Mobile)"]
        Creator["👨‍💻 Creator (Studio / Dashboard)"]
        Recipient["👩‍❤️‍👨 Recipient (3D Interactive Website)"]
    end

    subgraph EdgeLayer["2. Vercel Global Edge & CDN Network"]
        CDN["🌐 Edge CDN (Static Assets / Fonts / Media Cache)"]
        SecurityHeaders["🛡️ Security Gateway (HSTS, CSP, FrameGuard)"]
    end

    subgraph ComputeLayer["3. Serverless Application Engine (Next.js 16)"]
        AuthService["🔐 Auth & JWT Service (Google OAuth / Bcrypt)"]
        AIDirector["🤖 AI Content Pipeline (/api/generate, /api/generate-draft)"]
        PaymentService["💳 Cashfree PG Engine (/api/payments/cashfree/*)"]
        TrackingService["📊 Real-Time Analytics & Tracking (/api/track, /api/respond-proposal)"]
    end

    subgraph ExternalServices["4. Cloud & 3rd-Party Infrastructure"]
        GroqPool["⚡ Groq AI Pool (Llama-3 High-Speed LPU Inference)"]
        CashfreeAPI["🏦 Cashfree Payment Gateway (v3 Standard Checkout)"]
        UnsplashCDN["📸 Unsplash API (Aesthetic Landscape Backdrop Engine)"]
        SMTPMail["✉️ Nodemailer / SMTP Server (Transactional Alerts)"]
    end

    subgraph PersistenceLayer["5. Database Cloud (MongoDB Atlas)"]
        MongooseConn["🔌 Cached Global Mongoose Connection Pool"]
        DB_Apology[("📁 Apologies / Keepsakes")]
        DB_User[("👤 Users & Wallets")]
        DB_Order[("🧾 Orders & Receipts")]
        DB_RateLimit[("⏱️ Rate Limit Records (TTL)")]
    end

    Creator -->|HTTPS / REST| SecurityHeaders
    Recipient -->|HTTPS / REST| SecurityHeaders
    SecurityHeaders --> CDN
    CDN --> ComputeLayer

    AIDirector -->|Multi-Key Failover| GroqPool
    AIDirector -->|Query Imagery| UnsplashCDN
    PaymentService -->|Order Creation & Verification| CashfreeAPI
    AuthService -->|Deliver Password Tokens| SMTPMail

    ComputeLayer --> MongooseConn
    MongooseConn --> DB_Apology
    MongooseConn --> DB_User
    MongooseConn --> DB_Order
    MongooseConn --> DB_RateLimit
```

---

## 3. End-to-End System Workflow (Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor Creator as 👨‍💻 Creator
    participant UI as 🖥️ SealedVibe Studio
    participant API as ⚙️ Next.js Serverless API
    participant Groq as ⚡ Groq AI (Llama 3)
    participant DB as 🗄️ MongoDB Atlas
    actor Recipient as 👩‍❤️‍👨 Recipient
    participant 3DEngine as ✨ 3D Experience Engine

    %% Creation Phase
    Creator->>UI: Enters Partner Name, Memories & Fanbase ("Taylor Swift")
    Creator->>UI: Clicks "Generate Draft" or "Create Website"
    UI->>API: POST /api/generate (Payload + Auth Token)
    API->>DB: Atomically check & deduct 1 user token ($gte: 1)
    API->>Groq: Invokes Hidden Master Prompt with User Inputs
    Groq-->>API: Returns Structured JSON (Chapters, Vows, Coupons, Metaphors)
    API->>DB: Saves Keepsake Document with unique slug (/p/sara-7x8q)
    API-->>UI: Returns { success: true, slug: "sara-7x8q" }
    UI-->>Creator: Displays Share Link + Dynamic QR Code

    %% Recipient Unboxing Phase
    Creator->>Recipient: Sends Link via WhatsApp / Instagram
    Recipient->>3DEngine: Opens https://sealedvibe.in/p/sara-7x8q
    3DEngine->>API: GET /p/sara-7x8q data
    API->>DB: Fetches document & increments viewCount
    API->>DB: Stamps firstViewedAt timestamp
    API-->>3DEngine: Injects JSON into 3D Animation Slots
    3DEngine-->>Recipient: Unfolds 3D Wax Seal Envelope + Synthesizes Harp Audio
    Recipient->>3DEngine: Interacts with Vows, Star Map, Coupons, Dodge "No" Button
    Recipient->>3DEngine: Clicks "YES!" and types response note
    3DEngine->>API: POST /api/respond-proposal { status: "accepted", note: "..." }
    API->>DB: Updates responseStatus & responsePartnerNote
    Creator->>UI: Views Creator Dashboard (Sees Read Receipt & Partner's Reply Live)
```

---

## 4. Groq AI Story-Weaving & Fanbase Metaphor Engine

When the user enters raw inputs, the backend wraps them with a **Hidden Master System Prompt** before passing them to the Groq Multi-Key Pool.

```mermaid
flowchart TD
    A[Raw Creator Inputs\n- Names\n- Memories\n- Fanbase: 'Harry Potter' / 'Taylor Swift'] --> B[API Backend\n/api/generate]
    
    subgraph MasterPromptWrap["Invisible Master System Prompt Construction"]
        B --> C["1. Assign Persona:\n'Expert relationship writer & cinematic designer'"]
        C --> D["2. Fandom Metaphor Directive:\n'Convert obsessions into poetic metaphors of connection'"]
        D --> E["3. Output Contract:\n'Strict JSON Object Only — No markdown, no conversational text'"]
    end
    
    MasterPromptWrap --> F[Groq Multi-Key Failover Pool\nlib/groqPool.ts]
    F -->|Ultra-Fast LPU Inference| G[Meta Llama 3 70B Engine]
    
    G --> H["JSON Output Payload:\n- headline\n- act1 (The Spark)\n- act2 (The Fandom Metaphor)\n- act3 (The Vow)\n- colorPalette\n- memoriesList\n- dateLetterText"]
    
    H --> I[Backend Validation & Database Storage]
```

### Fanbase Metaphor Translation Examples:
* **Taylor Swift**: Synthesizes lines around *"invisible strings"*, *"midnight conversations"*, and *"enchanted memories"*.
* **Harry Potter**: Weaves in *"Golden Snitch finding"*, *"Patronus of joy"*, and *"After all this time? Always"*.
* **Marvel / Sci-Fi**: Embeds themes of *"destiny across every multiverse"*.

---

## 5. The No-Code 3D Engine & Template Injection Concept

We do not generate new source code files for every website. Instead, the application utilizes a **Pre-Engineered Master 3D Skeleton Component** ([`RomanticProposal.tsx`](file:///c:/Users/ADNAN/OneDrive/Desktop/apology_web_maker/components/RomanticProposal.tsx)):

```mermaid
graph LR
    subgraph Database["MongoDB Data Store"]
        JSONData["Structured JSON Document\n{ partnerName, chapter1Text, promises, coupons, youtubeUrl }"]
    end

    subgraph MasterComponent["Master 3D Engine (RomanticProposal.tsx)"]
        Slot1["Slot: Envelope Wax Seal Label"]
        Slot2["Slot: Falling Rose Petals & Stardust Canvas"]
        Slot3["Slot: Web Audio Synth Harp + YouTube Player"]
        Slot4["Slot: 3D Perspective Card Whispers"]
        Slot5["Slot: Interactive Constellation Star Map"]
        Slot6["Slot: Redeemable Love Coupons"]
        Slot7["Slot: Spring Physics Dodge Button"]
    end

    JSONData -->|Runtime State Injection| MasterComponent
    MasterComponent --> RenderedDOM["✨ Fully Interactive Recipient Experience"]
```

---

## 6. Low-Level System Design & Database Models

```mermaid
erDiagram
    USER ||--o{ APOLOGY : creates
    USER ||--o{ ORDER : places
    USER {
        ObjectId _id PK
        string name
        string email UK
        string passwordHash
        string googleId
        number tokens
        string role
        string resetToken
        date resetTokenExpiry
    }

    APOLOGY {
        ObjectId _id PK
        ObjectId creatorId FK
        string slug UK
        string creatorName
        string recipientName
        string occasion
        string theme
        string youtubeUrl
        string songName
        string status
        number viewCount
        date firstViewedAt
        object proposalData
        object weddingData
        object birthdayPartyData
        object endingSurprise
        object complimentStars
        object dateInvitation
        date createdAt
    }

    ORDER {
        ObjectId _id PK
        ObjectId userId FK
        string orderId UK
        string paymentId
        string packId
        number tokens
        number amount
        string currency
        string status
        string receipt
        date createdAt
    }

    RATELIMIT {
        ObjectId _id PK
        string key UK
        number count
        date createdAt "TTL: 15m"
    }

    PROMOCODE {
        ObjectId _id PK
        string code UK
        number discountPercent
        number tokensGranted
        number maxUses
        number usedCount
        date expiresAt
    }
```

---

## 7. Web Audio API Digital Signal Processing (DSP) Pipeline

The browser synthesizes dynamic acoustic harp plucks and ambient twilight pads locally without external audio streaming dependencies:

```mermaid
graph TD
    subgraph DroneSynth["1. Warm Twilight Ambient Pad (Drone)"]
        OscSine["5x Sine Oscillators\n(A2: 110Hz, E3: 164.8Hz, A3: 220Hz, C#4: 277.2Hz, E4: 329.6Hz)"]
        LowpassDrone["BiquadFilter (Lowpass @ 340 Hz)"]
        GainDrone["GainNode (Fixed Volume: 0.018)"]
        OscSine --> LowpassDrone --> GainDrone
    end

    subgraph HarpSequencer["2. Acoustic Harp String Pluck Sequencer (540ms Clock)"]
        OscTri["Triangle Oscillator\n(Cycling Pentatonic Frequency)"]
        BiquadHarp["BiquadFilter (Lowpass @ Freq * 2.8)"]
        GainEnvelope["GainNode (Exponential Ramp)\n0.048 -> 0.0001 over 1.8s"]
        OscTri --> BiquadHarp --> GainEnvelope
    end

    GainDrone --> AudioDestination["🔊 Browser AudioDestination (Speaker Output)"]
    GainEnvelope --> AudioDestination
```

---

## 8. HTML5 Canvas 60 FPS Particle Physics Engine

```mermaid
flowchart TD
    Init["Initialize Canvas & Viewport Dimensions (W x H)"] --> Spawn["Spawn N Particles (Rose Petals, Star Dust, Blooms)"]
    Spawn --> Loop["requestAnimationFrame(renderLoop)"]
    
    subgraph UpdateMath["Per-Frame Kinematic Equations"]
        Loop --> PosY["y = y + speedY"]
        PosY --> PosX["x = x + speedX"]
        PosX --> Rot["angle = angle + rotationSpeed"]
        Rot --> CheckBound{"y > Height + 20?"}
        CheckBound -- Yes --> ResetTop["Reset to y = -20, random x"]
        CheckBound -- No --> Draw["Draw Particle Geometry & Alpha"]
        
        Loop --> ShootingStarLogic["Poisson Timer (5s - 13s) -> Spawn Shooting Star"]
        ShootingStarLogic --> DecayAlpha["Decay Trail Alpha (-0.025/frame)"]
    end
    
    Draw --> Loop
    DecayAlpha --> Loop
```

---

## 9. 3D Wax-Seal Envelope Finite State Machine (FSM)

```mermaid
stateDiagram-v2
    [*] --> Sealed : Recipient arrives on URL

    Sealed --> SealBroken : User clicks Wax Seal
    note right of SealBroken : Trigger 65-particle confetti burst

    SealBroken --> FlapOpen : Delay 300ms
    note right of FlapOpen : Top envelope flap unfolds upward

    FlapOpen --> LetterOut : Delay 400ms
    note right of LetterOut : Letter slides upward out of envelope<br/>Audio Engine starts playing<br/>Grand Confetti burst (100 particles)

    LetterOut --> FullSiteOpen : User clicks "Read Our Story"
    note right of FullSiteOpen : Page scrolls into full 3D interactive story modules

    FullSiteOpen --> Accepted : User clicks "YES!"
    note right of Accepted : Triggers celebration modal & dispatches /api/respond-proposal
```

---

## 10. Cashfree Payment Gateway & Concurrency-Safe Token Credit

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 User
    participant Modal as 💳 TokenStoreModal (Client)
    participant CF_SDK as 🌐 Cashfree JS SDK v3
    participant API as ⚙️ API (/api/payments/cashfree/*)
    participant CF_Server as 🏦 Cashfree PG Server
    participant DB as 🗄️ MongoDB Atlas

    User->>Modal: Selects Token Pack ("Starter Pack - ₹49")
    Modal->>API: POST /api/payments/cashfree/order { packId: "starter" }
    API->>DB: Creates Order record (status: "created")
    API->>CF_Server: POST /pg/orders (order_id, amount, customer_details)
    CF_Server-->>API: Returns { payment_session_id: "session_xyz" }
    API-->>Modal: Returns paymentSessionId
    Modal->>CF_SDK: cashfree.checkout({ paymentSessionId, redirectTarget: "_modal" })
    CF_SDK-->>User: Renders Drop-in UPI / Card Payment Window
    User->>CF_SDK: Completes UPI/Card Payment
    CF_SDK-->>Modal: Payment Complete callback
    Modal->>API: POST /api/payments/cashfree/verify { orderId }
    API->>CF_Server: GET /pg/orders/{orderId}
    CF_Server-->>API: { order_status: "PAID", cf_order_id: "12345" }
    
    rect rgb(230, 245, 230)
    Note over API,DB: Atomic Double-Spend Prevention
    API->>DB: findOneAndUpdate({ orderId, status: { $ne: 'paid' } }, { $set: { status: 'paid' } })
    API->>DB: User.findByIdAndUpdate(userId, { $inc: { tokens: pack.tokens } })
    end

    API-->>Modal: { success: true, tokensAdded: 3, newTokens: 4 }
    Modal-->>User: Displays 🎉 Success + Instant Wallet Update
```

---

## 11. Security, Authentication & Rate Limiting

| Security Domain | Mechanism Implemented | Implementation File |
| :--- | :--- | :--- |
| **Password Security** | Bcrypt with salt cost factor 10 | [`app/api/auth/signup/route.ts`](file:///c:/Users/ADNAN/OneDrive/Desktop/apology_web_maker/app/api/auth/signup/route.ts) |
| **Session Cryptography** | `HS256` JWT cookies with `httpOnly`, `sameSite: "lax"`, `secure` | [`lib/session.ts`](file:///c:/Users/ADNAN/OneDrive/Desktop/apology_web_maker/lib/session.ts) |
| **API Rate Limiting** | Sliding window IP limiter (Max 5 generations/minute, Max 10 logins/minute) | [`lib/rateLimit.ts`](file:///c:/Users/ADNAN/OneDrive/Desktop/apology_web_maker/lib/rateLimit.ts) |
| **DDoS & Header Shield** | HSTS (`max-age=63072000`), `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff` | [`next.config.ts`](file:///c:/Users/ADNAN/OneDrive/Desktop/apology_web_maker/next.config.ts) |
| **Private Envelopes** | Optional recipient passcodes stored as cryptographic hashes | [`app/api/verify-passcode/route.ts`](file:///c:/Users/ADNAN/OneDrive/Desktop/apology_web_maker/app/api/verify-passcode/route.ts) |

---

## 12. Deployment Topology & Cloud Infrastructure

```mermaid
graph TB
    subgraph SourceControl["GitHub Repository"]
        Repo["adnanlj/sealedvibe (main branch)"]
    end

    subgraph CI_CD["Vercel Build & Deployment Pipeline"]
        Webhook["GitHub Webhook Trigger"]
        NextBuild["Next.js Production Optimizer & Bundle Generator"]
        EdgeDeployment["Deploy to Global Edge Serverless Pods"]
    end

    subgraph LiveDomain["Production Domain (sealedvibe.in)"]
        LiveSite["https://sealedvibe.in\n(Vercel Global Edge CDN)"]
        Analytics["Vercel Web Analytics (@vercel/analytics)"]
    end

    Repo -->|git push origin main| Webhook
    Webhook --> NextBuild
    NextBuild --> EdgeDeployment
    EdgeDeployment --> LiveSite
    LiveSite --> Analytics
```

---
*Document generated for **SealedVibe Architecture Standard (2026)**.*
