// --- LOCAL DEVELOPMENT CONFIGURATION ---
// IMPORTANT: This file is for your local environment ONLY. It should NOT be committed to git.
// You must fill in your own API keys and Firebase project details here.

window.mentorx_config = {
  // 1. GEMINI_API_KEY is now read from an environment variable for security.
  // For local development, you can temporarily set it here for the polyfill to pick up,
  // but the recommended approach is to use a proper development server that supports .env files.
  // Example for temporary local testing:
  // API_KEY: "AIzaSyBTVvVqJbazlHl5HC2E92O4uEmrtEKDwPg", 

  // 2. Get your Firebase configuration from your Firebase project settings.
  // https://console.firebase.google.com/ -> Project Settings -> General -> Your apps -> Web app
  FIREBASE_CONFIG: {
    apiKey: "AIzaSyBBx-1kDgMV6n0ZtohJRJKzm9wrtFldxKI",
    authDomain: "mentorx-cc0d2.firebaseapp.com",
    projectId: "mentorx-cc0d2",
    storageBucket: "mentorx-cc0d2.appspot.com",
    messagingSenderId: "869350590003",
    appId: "1:869350590003:web:34cce726321f7564c10546"
  }
};
