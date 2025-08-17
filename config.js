// --- LOCAL DEVELOPMENT & PRODUCTION CONFIGURATION ---
// IMPORTANT: This file is for your local environment and for configuring your public deployment.
// It should NOT be committed to git with sensitive keys.

window.mentorx_config = {
  // 1. BACKEND_URL: This tells your frontend where to find your backend server.
  //    - For LOCAL development (running `npm start`), leave this as an empty string: ''.
  //    - For PUBLIC deployment, you must change this to the URL of your deployed backend server.
  //      (e.g., 'https://your-mentorx-backend.onrender.com')
  BACKEND_URL: 'https://mntorx-the-one-unified-ai-backend.onrender.com',

  // 2. GEMINI_API_KEY: The Gemini API key is managed by your backend server.
  //    You must set it as an environment variable (e.g., API_KEY) on your hosting provider.

  // 3. FIREBASE_CONFIG: Required for saving chats and settings to the cloud.
  //    Get this from your Firebase project settings.
  //    https://console.firebase.google.com/ -> Project Settings -> General -> Your apps -> Web app
  FIREBASE_CONFIG: {
    apiKey: "AIzaSyBBx-1kDgMV6n0ZtohJRJKzm9wrtFldxKI",
    authDomain: "mentorx-cc0d2.firebaseapp.com",
    projectId: "mentorx-cc0d2",
    storageBucket: "mentorx-cc0d2.firebasestorage.app",
    messagingSenderId: "869350590003",
    appId: "1:869350590003:web:34cce726321f7564c10546"
  }
};
