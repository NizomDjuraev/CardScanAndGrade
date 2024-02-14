import React from "react"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import useCachedResources from "./hooks/useCachedResources"
import Navigation from "./navigation"
import { ClerkProvider } from "@clerk/clerk-expo"
import { tokenCache } from "./cache"

const publishableKey = "pk_test_Y29ycmVjdC1jb2QtMTEuY2xlcmsuYWNjb3VudHMuZGV2JA"

/**
 * Main entry point of the application. It initializes the app, ensuring all assets are loaded before rendering. The app's navigation is wrapped within `ClerkProvider` for authentication management.
 * @function App
 * @returns {Object} The root component of the app, or null if assets are still loading.
 */
export default function App() {
  const isLoadingComplete = useCachedResources()

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar />
        </SafeAreaProvider>
      </ClerkProvider>
    )
  }
}

