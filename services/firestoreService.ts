import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, Firestore } from 'firebase/firestore';
import { User, UserDataBundle } from '../types';

// This file is modified for deployment. It reads credentials from a global config object.
declare global {
  interface Window {
    mentorx_config: {
      GEMINI_API_KEY: string;
      FIREBASE_CONFIG: any;
    }
  }
}

let db: Firestore | null = null;
let isFirebaseInitialized = false;

/**
 * Lazily initializes and returns the Firestore database instance.
 * This ensures the Firebase config from config.js is loaded before the client is created.
 */
function getDb(): Firestore | null {
    if (isFirebaseInitialized) {
        return db;
    }

    isFirebaseInitialized = true; // Attempt initialization only once.

    const firebaseConfig = window.mentorx_config?.FIREBASE_CONFIG;
    if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YOUR_")) {
        console.warn("Firebase is not configured. Cross-device sync will be disabled. Please add your Firebase project configuration to config.js (local) or Netlify environment variables (deployment).");
        return null;
    }

    try {
        const app: FirebaseApp = initializeApp(firebaseConfig);
        db = getFirestore(app);
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        db = null;
    }

    return db;
}


export const saveUserDataBundle = async (user: User, data: UserDataBundle): Promise<void> => {
    const firestoreDb = getDb();
    if (!firestoreDb || !user) return;
    try {
        const userDocRef = doc(firestoreDb, 'users', user.id);
        // We can't store non-plain objects like React nodes in Firestore.
        // Create a serializable copy of the data.
        const serializableData = JSON.parse(JSON.stringify(data, (key, value) => {
            // Remove the 'icon' property from personas as it contains React components.
            if (key === 'icon') {
                return undefined;
            }
            return value;
        }));
        
        await setDoc(userDocRef, serializableData, { merge: true });
    } catch (error) {
        console.error("Error saving user data to Firestore:", error);
        throw error;
    }
};

export const getUserDataBundle = async (user: User): Promise<UserDataBundle | null> => {
    const firestoreDb = getDb();
    if (!firestoreDb || !user) return null;
    try {
        const userDocRef = doc(firestoreDb, 'users', user.id);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            // Firestore timestamps need to be converted back to JS Dates
            const data = docSnap.data() as any; // Cast to any to handle Firestore Timestamps
            if (data.sessions) {
                data.sessions.forEach((session: any) => {
                    if (session.createdAt && session.createdAt.toDate) {
                       session.createdAt = session.createdAt.toDate();
                    }
                    if (session.messages) {
                      session.messages.forEach((message: any) => {
                          if(message.timestamp && message.timestamp.toDate) {
                              message.timestamp = message.timestamp.toDate();
                          }
                      });
                    }
                });
            }
            return data as UserDataBundle;
        } else {
            console.log("No data found for user, will create new document on first save.");
            return null; // No document for this user yet
        }
    } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
        return null;
    }
};