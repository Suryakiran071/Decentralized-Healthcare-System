
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhZBM5LioLyXFk3_fOUkRJUllI5VJHbwI",
  authDomain: "medease-c1af7.firebaseapp.com",
  projectId: "medease-c1af7",
  storageBucket: "medease-c1af7.firebasestorage.app",
  messagingSenderId: "249675143610",
  appId: "1:249675143610:web:e4c2d4cb15f1cc08112583",
  measurementId: "G-CNZXDEHTXP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth };
