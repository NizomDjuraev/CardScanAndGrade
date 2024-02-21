import { initializeApp } from "@react-native-firebase/app";
import { Platform } from "react-native";

const firebaseConfig = Platform.select({
  ios: {
    apiKey: "AIzaSyBpTm1BYek2XqC7J9HAlU5clhvPhv7TYVg",
    authDomain: "drexel-tcg-a7e29.firebaseapp.com",
    projectId: "drexel-tcg-a7e29",
    storageBucket: "drexel-tcg-a7e29.appspot.com",
    messagingSenderId: "693229136898",
    appId: "1:693229136898:ios:3bfd4b3f47037094d44b1b",
  },
  android: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
  },
});

const firebase = initializeApp(firebaseConfig);

export default firebase;
