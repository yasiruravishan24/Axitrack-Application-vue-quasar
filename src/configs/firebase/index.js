import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: JSON.parse(process.env.API_KEY),
  authDomain: JSON.parse(process.env.AUTH_DOMIAN),
  databaseURL: JSON.parse(process.env.DATABASE_URL),
  projectId: JSON.parse(process.env.PROJECT_ID),
  storageBucket: JSON.parse(process.env.STORAGE_BUCKET),
  messagingSenderId: JSON.parse(process.env.MESSAGING_SENDER_ID),
  appId: JSON.parse(process.env.APP_ID),
  measurementId:JSON.parse(process.env.MEASUREMENT_ID)
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

export { app, auth, db, storage, getCurrentUser };
