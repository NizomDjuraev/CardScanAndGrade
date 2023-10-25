import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import Constants from "expo-constants"
import SignUpScreen from "./components/SignUpScreen";
import SignInWithEmail from "./components/SignInWithEmail";
import SignInWithGoogle from "./components/SignInWithGoogle";
import * as SecureStore from "expo-secure-store";

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key)
    } catch (err) {
      return null
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  }
}
 
const App = () => {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={Constants.expoConfig.extra.clerkPublishableKey}>
      <SafeAreaView style={styles.container}>
        <SignedIn>
            <Text>You are signed in!</Text>
        </SignedIn>
        <SignedOut>
            <SignInWithGoogle />
        </SignedOut>
      </SafeAreaView>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;