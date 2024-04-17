import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../components/Styles";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function SignInScreen({ navigation }) {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = async () => {
    try {
      await signInWithEmailAndPassword(auth, emailAddress, password);
      // Sign in successful, navigate to home screen
      navigation.replace("MainTabs");
    } catch (error) {
      // Handle error
      console.log("Error signing in:", error.message);
    }
  };

  const onSignUpPress = () => navigation.replace("SignUp");
  const onForgotPasswordPress = () =>
    navigation.navigate("ForgotPasswordScreen");

  return (
    <View style={styles.loginView}>
      <View style={styles.loginInputView}>
        <View style={styles.iconContainer}>
          <Ionicons name="ios-mail-outline" size={20} color="#fff" />
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
