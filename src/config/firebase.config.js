import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBea_CtkA48A7lPOM841-L2_XYNRwir2JA",
  authDomain: "resume-builder-d20c7.firebaseapp.com",
  projectId: "resume-builder-d20c7",
  storageBucket: "resume-builder-d20c7.appspot.com", // Corrected value
  messagingSenderId: "226873749126",
  appId: "1:226873749126:web:248b6bdf3de8b232d52b07",
};

// Initialize Firebase app
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

console.log("Firebase App Initialized:", app.name); // Should log "[DEFAULT]"
console.log("Auth Instance:", auth);
console.log("Firestore Instance:", db);
console.log("Firebase Config:", app.options);

console.log("Sign-in Methods:", auth.config.authDomain);


console.log("Current User:", auth.currentUser);
console.log("Sign-in Methods:", auth.config.authDomain);

export { auth, db };
