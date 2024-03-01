import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { styles } from "../components/Styles";
import { auth } from "../firebaseConfig";

export default function VerifyCodeScreen({ navigation }) {
  useEffect(() => {
    // Check if the user's email is already verified
    const isEmailVerified = auth.currentUser.emailVerified;

    // If the email is already verified, navigate to the home screen
    if (isEmailVerified) {
      navigation.navigate("HomeScreen");
    } else {
      // Listen for changes in the user's authentication state
      const unsubscribe = auth.onAuthStateChanged((user) => {
        // If the user's email is verified, navigate to the home screen
        if (user && user.emailVerified) {
          navigation.navigate("HomeScreen");
        }
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    }
  }, []);

  return (
    <View style={styles.loginView}>
      <Text style={styles.loginTextInput}>
        Please check your email to verify your account.
      </Text>
    </View>
  );
}
