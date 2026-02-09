import { initializeApp } from "firebase/app";
import { initializeFirestore, setLogLevel } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Replace with your actual Firebase project configuration
// You can get this from the Firebase Console: Project settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyD25OyO3scj2Dk9MBXz7dUlkt4UQnGcns4",
  authDomain: "bizcard-manager-kymbms.firebaseapp.com",




  projectId: "bizcard-manager-kymbms",
  storageBucket: "bizcard-manager-kymbms.firebasestorage.app",
  messagingSenderId: "306201153415",
  appId: "1:306201153415:web:89ad93f9ad19babfd44d22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Enable verbose logging for debugging connectivity issues
setLogLevel('debug');

// Using initializeFirestore with auto-detect long polling for better resiliency
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  localCache: {
    kind: 'indexedDb',
    cacheSizeBytes: 40000000 // 약 40MB 캐시
  }
});


export const auth = getAuth(app);
export const storage = getStorage(app);
console.log("Firebase initialized with debug logging and Auto-detect Long Polling");
