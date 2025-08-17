// --- LOCAL DEVELOPMENT CONFIGURATION ---
// IMPORTANT: This file is for your local environment ONLY. It should NOT be committed to git.
// You must fill in your own API keys and Firebase project details here.

window.mentorx_config = {
  // 1. GEMINI_API_KEY is now read from an environment variable for security.
  // For local development, you can temporarily set it here for the polyfill to pick up,
  // but the recommended approach is to use a proper development server that supports .env files.
  // Example for temporary local testing:
  // API_KEY: "YOUR_GEMINI_API_KEY_HERE", 

  // 2. Get your Firebase configuration from your Firebase project settings.
  // https://console.firebase.google.com/ -> Project Settings -> General -> Your apps -> Web app
  FIREBASE_CONFIG: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};