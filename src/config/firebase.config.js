import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCECM8ZJHr9o1DM2GODI5yYZTa6NupzMEY",
  authDomain: "resume-6d2fa.firebaseapp.com",
  projectId: "resume-6d2fa",
  storageBucket: "resume-6d2fa.appspot.com", // Correct storage bucket domain
  messagingSenderId: "566486487309",
  appId: "1:566486487309:web:be2b908adfc36c00c7e044",
};

// Initialize Firebase app
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

const storage = getStorage(app);
console.log("Firebase App Initialized:", app.name); // Should log "[DEFAULT]"
console.log("Firebase Config:", app.options);
console.log("Current User:", auth.currentUser); // Will be null if no user is signed in

export { auth, db ,storage};
