import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "./cache";
import { firebase } from "@react-native-firebase/app";

const firebaseConfigAndroid = {
  apiKey: "AIzaSyAvfWHI7x7v4RpmTrhOfn7Mmtw8y1lEK5U",
  authDomain: "drexel-tcg-a7e29.firebaseapp.com",
  projectId: "drexel-tcg-a7e29",
  storageBucket: "drexel-tcg-a7e29.appspot.com",
  messagingSenderId: "693229136898",
  appId: "1:693229136898:android:808e24430959f275d44b1b",
};

const firebaseConfigIOS = {
  apiKey: "AIzaSyBpTm1BYek2XqC7J9HAlU5clhvPhv7TYVg",
  authDomain: "drexel-tcg-a7e29.firebaseapp.com",
  projectId: "drexel-tcg-a7e29",
  storageBucket: "drexel-tcg-a7e29.appspot.com",
  messagingSenderId: "693229136898",
  appId: "1:693229136898:ios:b4eb54451ed6df84d44b1b",
  iosClientId: "",
  iosBundleId: "",
};

// Your publishable Key goes here
const publishableKey = "pk_test_Y29ycmVjdC1jb2QtMTEuY2xlcmsuYWNjb3VudHMuZGV2JA";

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar />
        </SafeAreaProvider>
      </ClerkProvider>
    );
  }
}
