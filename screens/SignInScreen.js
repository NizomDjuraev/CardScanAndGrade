import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { firebase } from "@react-native-firebase/auth";
import { log } from "../logger";
import { styles } from "../components/Styles";
import { Ionicons } from "@expo/vector-icons";

export default function SignInScreen({ navigation }) {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const signInWithEmail = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(emailAddress, password);
    } catch (error) {
      log("Error signing in:", error.message);
    }
  };

  const onSignUpPress = () => navigation.replace("SignUp");

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
          onChangeText={setEmailAddress}
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
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={signInWithEmail}>
        <Text style={styles.loginButtonText}>Sign in</Text>
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
