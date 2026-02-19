# Tombola Music Direction

## Project Structure

```
/public
  index.html          ← main page (served at root)
/api
  tracks.js           ← Vercel serverless function (Spotify playlist fetch)
package.json
vercel.json
```

## Setup

### 1. Vercel Environment Variables

In your Vercel project → Settings → Environment Variables, add:

- `SPOTIFY_CLIENT_ID` → `d938983f296449d8ab43ba59993f6606`
- `SPOTIFY_CLIENT_SECRET` → (click "View client secret" on developer.spotify.com)

### 2. Firebase Setup

1. Go to https://console.firebase.google.com
2. Create a new project (name it anything, e.g. "tombola-votes")
3. Disable Google Analytics (not needed)
4. Once created → Build → Realtime Database → Create Database
5. Choose a location (europe-west1 for UK)
6. Start in **test mode** (allows read/write — fine for internal tool)
7. Go to Project Settings (gear icon) → General → scroll to "Your apps" → click Web (</> icon)
8. Register the app (name doesn't matter)
9. Copy the `firebaseConfig` object
10. Paste the values into `public/index.html` replacing the placeholder config block

The config block in index.html looks like:
```js
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "000000000000",
    appId: "YOUR_APP_ID"
};
```

### 3. Deploy

Push to your Git repo connected to Vercel, or run `vercel` from the project root.

### How It Works

- `/api/tracks` fetches the Spotify playlist server-side (no auth needed from the browser)
- The voting table renders tracks from the API and syncs checkbox state via Firebase Realtime Database
- When anyone ticks a checkbox, all other viewers see it update in real-time
- Tracks vetoed by both Meanwhile and BRB fade out and drop to the bottom
- Adding tracks to the Spotify playlist automatically adds them to the voting table on next page load
