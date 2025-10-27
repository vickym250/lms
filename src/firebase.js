// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqPGFTXaJNo6a5Nro5b4hXTQ-qMEUhKA8",
  authDomain: "loginlms-70bc2.firebaseapp.com",
  projectId: "loginlms-70bc2",
  storageBucket: "loginlms-70bc2.appspot.com",  // <-- thoda fix kiya
  messagingSenderId: "26378495405",
  appId: "1:26378495405:web:02eae36bef19e921386d24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export for use in other files
export { auth, provider };
