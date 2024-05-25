import { FontAwesome } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";

/**
* useCachedResources hook loads resources and data that are needed prior to rendering the app. It ensures that fonts and other assets are loaded and the splash screen remains visible until loading is complete.
* @function useCachedResources
* @returns {boolean} The loading completion status. Returns true if loading is complete, false otherwise.
*/
export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {

    /**
    * Loads resources and data asynchronously.
    * @async
    * @function loadResourcesAndDataAsync
    * @returns {Promise<void>} A promise that resolves when resources are loaded and the splash screen is hidden.
    */
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
