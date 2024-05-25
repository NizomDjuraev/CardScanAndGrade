import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { styles } from "../components/Styles";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

/**
* SignInScreen component for user authentication. It provides fields for email and password, and manages the sign-in process.
* @function SignInScreen
* @param {Object} navigation - Navigation prop for screen transitions.
* @returns {Object} The Sign In screen component.
*/
export default function SignInScreen({ navigation }) {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  /**
  * Handles the sign-in process. Checks if the user's email is verified before signing in.
  * @async
  * @function onSignInPress
  * @returns {Promise<void>} A promise that resolves when the sign-in process is complete.
  */
  const onSignInPress = async () => {
    try {
      // Sign in to trigger emailVerified to update
      await signInWithEmailAndPassword(auth, emailAddress, password);
      // Check if the user's email is verified before signing in
      const user = auth.currentUser;
      if (user && user.emailVerified) {
        // Sign in successful and verified, navigate to home screen
        navigation.replace("MainTabs");
      } else {
        // If email is not verified, show alert and return
        Alert.alert(
          "Email Verification Required",
          "Please verify your email before signing in."
        );
        return;
      }
    } catch (error) {
      // Handle error
      console.log("Error signing in:", error.message);
    }
  };

  /**
  * Navigates to the SignUp screen.
  * @function onSignUpPress
  */
  const onSignUpPress = () => navigation.replace("SignUp");
  
  /**
  * Navigates to the ForgotPasswordScreen.
  * @function onForgotPasswordPress
  */
  const onForgotPasswordPress = () =>
    navigation.navigate("ForgotPasswordScreen");

  return (
    <View style={styles.loginView}>
      <View style={styles.loginInputView}>
        <View style={styles.iconContainer}>
          <Ionicons name="mail-outline" size={20} color="#fff" />
        </View>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          style={styles.loginTextInput}
          placeholder="Email..."
          placeholderTextColor="#fff"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
      </View>

      <View style={styles.loginInputView}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#fff" />
        </View>
        <TextInput
          value={password}
          style={styles.loginTextInput}
          placeholder="Password..."
          placeholderTextColor="#fff"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={onSignInPress}>
        <Text style={styles.loginButtonText}>Sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.forgotPasswordLink}
        onPress={onForgotPasswordPress}
      >
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      </TouchableOpacity>

      <View style={styles.loginFooter}>
        <Text style={{ color: "#fff" }}>Don't have an account?</Text>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onSignUpPress}
        >
          <Text style={styles.secondaryButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
