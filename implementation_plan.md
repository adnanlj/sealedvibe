# Implementation Plan: User Authentication, Creator Dashboard, and Redesigned Interactive Landing Page

We will implement a secure, compulsory user authentication system (Option B: Gated before AI draft generation), a Creator Dashboard for managing and tracking websites in real-time, and a redesigned landing page featuring the selected headline and interactive live occasion examples.

## User Review Required

> [!IMPORTANT]
> **Authentication Gate Location (Option B)**: The user will fill out the wizard questions anonymously. The moment they click **"Generate AI Letter Draft"**, they will be prompted with a mandatory Login/Signup modal. Once they complete authentication, their progress is saved to their new account, and they transition to the draft narrative editor.

> [!NOTE]
> **Autoredirect for Logged-In Users**: If a user is already logged in, visiting the root URL `/` will automatically redirect them straight to `/dashboard` to view their websites, avoiding the marketing screens.

---

## Proposed Changes

### 1. Database & Session Management

#### [NEW] [User.ts](file:///c:/Users/ADNAN/OneDrive/Desktop/sealedvibe/models/User.ts)
Create the Mongoose Schema for user credentials and Google accounts:
*   `name`: String
*   `email`: String (indexed & unique)
*   `password`: Hashed string (empty for Google users)
*   `createdAt`: Date

#### [MODIFY] [Apology.ts](file:///c:/Users/ADNAN/OneDrive/Desktop/sealedvibe/models/Apology.ts)
Add a reference field linking the website to a user:
*   `creatorId`: `{ type: Schema.Types.ObjectId, ref: 'User' }` (optional for older pages, required for new ones).

#### [NEW] [session.ts](file:///c:/Users/ADNAN/OneDrive/Desktop/sealedvibe/lib/session.ts)
Helper library using JOSE/JWT tokens to set, decrypt, and clear secure HTTP-only cookies (`auth-token`) for Next.js session validation on client/server components.

---

### 2. Authentication API & Endpoints

#### [NEW] `/app/api/auth/signup/route.ts`
Registers a new user, hashes the password using bcrypt, and sets the secure session cookie.

#### [NEW] `/app/api/auth/login/route.ts`
Verifies user credentials, sets the session cookie, and returns user data.

#### [NEW] `/app/api/auth/logout/route.ts`
Clears the session cookie to log the user out.

#### [NEW] `/app/api/auth/me/route.ts`
Checks if the user has an active session cookie and returns their profile details (used for page hydration and auth state checks).

#### [NEW] [AuthModal.tsx](file:///c:/Users/ADNAN/OneDrive/Desktop/sealedvibe/components/AuthModal.tsx)
An animated, sliding modal card overlay prompting the creator to Log In / Sign Up, styled with deep dark themes and glassmorphism buttons.

---

### 3. Creator Dashboard

#### [NEW] [dashboard/page.tsx](file:///c:/Users/ADNAN/OneDrive/Desktop/sealedvibe/app/dashboard/page.tsx)
Build a premium, responsive creator command center showing:
*   **Websites Overview Grid**: A list of cards containing active letter links, occasion emojis, and creation dates.
*   **Live Tracker Metrics**: Reads status (`Opened: Yes / No`), passcode verification logs, and date invitation RSVPs (`Accepted` / `Declined` / `Pending`) in real-time.
*   **Actions**:
    *   *Copy Link*: Copy URL directly.
    *   *Edit*: Re-open the narrative wizard draft editor.
    *   *Delete*: Remove the document from MongoDB, immediately disabling the dynamic page.

#### [NEW] `/app/api/websites/route.ts`
GET endpoint to retrieve all published websites belonging to the logged-in user.

#### [NEW] `/app/api/websites/delete/route.ts`
POST endpoint to securely delete a website owned by the user.

---

### 4. Landing Page Redesign

#### [MODIFY] [page.tsx](file:///c:/Users/ADNAN/OneDrive/Desktop/sealedvibe/app/page.tsx)
Redesign the root page with the selected headline & styling:
*   **Hero Headline**: *"For the feelings too big for a text message. Build their private universe."*
*   **Hero Sub-headline**: *"Easily craft personalized, interactive websites to celebrate milestones, express gratitude, or make amends with music, interactive cards, and animations."*
*   **Visual Entrance**: Framer-motion entrance fades, scroll-triggered text animations, and slow-moving ambient backdrop glow points.
*   **"Live Examples" Showroom**:
    *   Adds tabs for *Apology*, *Birthday*, *Anniversary*, and *Appreciation*.
    *   Clicking a tab opens a live mockup preview allowing the visitor to click, enter sample passcode `1234`, read demo text, scratch the card, and click the RSVP buttons.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify there are 0 compilation errors across all new TSX/API files.

### Manual Verification
1.  Open homepage `/` anonymously, confirm new animated landing page layout and test occasion live example clicks.
2.  Click "Start Building" and complete the questionnaire.
3.  Confirm that clicking "Generate AI Draft" halts the wizard and opens the Signup modal.
4.  Register a test account. Verify the draft generates, customize it, and publish.
5.  Check that the success page links to the dashboard.
6.  Visit `/dashboard`, verify the new website card, and test copy/edit/delete actions.
7.  Verify visiting `/` while logged in redirects immediately to `/dashboard`.
