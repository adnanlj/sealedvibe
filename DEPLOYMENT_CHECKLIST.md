# 🚀 Production Deployment & Google OAuth Checklist

Keep this checklist handy for when you deploy SealedVibe to production (e.g., Vercel, Railway, AWS, or custom domain).

---

## 1. 🔑 Add Environment Variables on Your Hosting Provider
In your hosting project settings (e.g. Vercel Dashboard ➔ Settings ➔ Environment Variables), add:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://...` | Your production MongoDB Atlas connection string |
| `AUTH_SECRET` | `reconnect_secret_key_jwt_session_adnan_2026` | 32+ character secret for JWT sessions |
| `NEXT_PUBLIC_BASE_URL` | `https://sealedvibe.in` | Your live website domain |
| `GROQ_API_KEY` | `gsk_...` | Your Groq AI API key |
| `GOOGLE_CLIENT_ID` | `459356497823-...apps.googleusercontent.com` | Your Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-...` | Your Google OAuth Client Secret |

---

## 2. 🌐 Update Google Cloud Console Authorized URIs
1. Open [Google Cloud Console](https://console.cloud.google.com/) ➔ **APIs & Services** ➔ **Credentials**.
2. Click on **`SealedVibe Web Client`**.
3. Under **Authorized JavaScript origins**, click **"+ ADD URI"**:
   ```
   https://sealedvibe.in
   https://www.sealedvibe.in
   ```
4. Under **Authorized redirect URIs**, click **"+ ADD URI"**:
   ```
   https://sealedvibe.in/api/auth/google/callback
   https://www.sealedvibe.in/api/auth/google/callback
   ```
5. Click **"Save"**.

---

## 3. 🌍 Switch OAuth Consent Screen to "In Production"
1. In Google Cloud Console, go to **APIs & Services** ➔ **OAuth consent screen**.
2. Under **Publishing status**, click **"PUBLISH APP"** and confirm.
3. This removes the test user restriction and enables **unlimited users worldwide** to sign in with 1 click.

---

## 4. ✅ Post-Deployment Smoke Test
1. Visit `https://sealedvibe.in`.
2. Click **"Continue with Google"** to test 1-click login on live domain.
3. Create a test keepsake, open the live link on mobile, and check the creator dashboard to see real-time read receipts!
