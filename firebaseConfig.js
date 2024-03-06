import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAsif4NHD6nBTkWocDdu5goqz4QAvE7g54",
  authDomain: "drexel-tcg-a7e29.firebaseapp.com",
  projectId: "drexel-tcg-a7e29",
  storageBucket: "drexel-tcg-a7e29.appspot.com",
  messagingSenderId: "693229136898",
  appId: "1:693229136898:web:b2692b7fbdf2895cd44b1b",
  measurementId: "G-JRYL3HPG95",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { firebaseApp, auth };
