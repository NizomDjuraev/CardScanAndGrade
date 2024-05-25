import * as React from "react";
import { Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { styles } from "../components/Styles";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { createCollection } from "../backend/server";

/**
* SignUpScreen component for user registration. It provides fields for first name, last name, email, and password, and manages the sign-up process.
* @function SignUpScreen
* @param {Object} navigation - Navigation prop for screen transitions.
* @returns {Object} The Sign Up screen component.
*/
export default function SignUpScreen({ navigation }) {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  /**
  * Handles the sign-up process. Creates a new user, updates the profile, sends an email verification, and creates a default collection.
  * @async
  * @function onSignUpPress
  * @returns {Promise<void>} A promise that resolves when the sign-up process is complete.
  */
  const onSignUpPress = async () => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailAddress,
        password
      );

      // Extract user from userCredential
      const user = userCredential.user;

      // Update profile with first and last name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Send email verification
      await sendEmailVerification(user);

      navigation.replace("SignIn");

      // Show alert after navigating to sign-in screen
      Alert.alert(
        "Email Verification",
        "A verification email has been sent. Please verify your email then sign in.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );

      //Create Default Collection if new user signs up with valid email and password
      await createCollection(
        user.email,
        user.displayName.split(" ")[0],
        user.displayName.split(" ")[1] || "",
        "Default Collection"
      );
    } catch (error) {
      console.log("Error signing up:", error.message);
    }
  };

  /**
  * Navigates to the SignIn screen.
  * @function onSignInPress
  */
  const onSignInPress = () => navigation.replace("SignIn");

  return (
    <View style={styles.loginView}>
      <View style={styles.loginInputView}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-outline" size={20} color="#fff" />
        </View>
        <TextInput
          value={firstName}
          style={styles.loginTextInput}
          placeholder="First name..."
          placeholderTextColor="#fff"
          onChangeText={(firstName) => setFirstName(firstName)}
        />
      </View>

      <View style={styles.loginInputView}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-outline" size={20} color="#fff" />
        </View>
        <TextInput
          value={lastName}
          style={styles.loginTextInput}
          placeholder="Last name..."
          placeholderTextColor="#fff"
          onChangeText={(lastName) => setLastName(lastName)}
        />
      </View>

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
          onChangeText={(email) => setEmailAddress(email)}
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

      <TouchableOpacity style={styles.loginButton} onPress={onSignUpPress}>
        <Text style={styles.loginButtonText}>Sign up</Text>
      </TouchableOpacity>

      <View style={styles.loginFooter}>
        <Text style={{ color: "#fff" }}>Have an account?</Text>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onSignInPress}
        >
          <Text style={styles.secondaryButtonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
