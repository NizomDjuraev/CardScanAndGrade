import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { log } from "../logger";

/**
 * ProfileScreen component displays the user's profile with sign-out functionality. It uses authentication and user context hooks.
 * @function ProfileScreen
 * @returns {Object} The Profile screen component.
 */
export default function ProfileScreen() {

  //Authentication actions and user information from context.
  const { getToken, signOut } = useAuth();
  const { user } = useUser();

  //State to store the session token.
  const [sessionToken, setSessionToken] = React.useState("");

  /**
   * Signs out the current user and handles potential errors.
   * @async
   * @function onSignOutPress
   * @returns {Promise<void>} A promise that resolves when the user is signed out.
   */
  const onSignOutPress = async () => {
    try {
      await signOut();
    } catch (err) {
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
    }
  };

  /**
   * Periodically fetches and updates the session token.
   * @function useSessionTokenEffect
   */
  React.useEffect(() => {
    const scheduler = setInterval(async () => {
      const token = await getToken();
      setSessionToken(token);
    }, 1000);

    return () => clearInterval(scheduler);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello {user?.firstName}</Text>
      <TouchableOpacity onPress={onSignOutPress} style={styles.link}>
        <Text style={styles.linkText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  link: {
    marginTop: 15,
    paddingVertical: 15
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7"
  },

})

