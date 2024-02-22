import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../firebaseConfig";
import { log } from "../logger";
import { styles } from "../components/Styles";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const signUpWithEmail = async () => {
    try {
      await auth.createUserWithEmailAndPassword(emailAddress, password);
      navigation.navigate("VerifyCode");
    } catch (error) {
      log("Error signing up:", error.message);
    }
  };

  return (
    <View style={styles.loginView}>
      <View style={styles.loginInputView}>
        <View style={styles.iconContainer}>
          <Ionicons name="ios-person-outline" size={20} color="#fff" />
        </View>
        <TextInput
          value={firstName}
          style={styles.loginTextInput}
          placeholder="First name..."
          placeholderTextColor="#fff"
          onChangeText={setFirstName}
        />
      </View>

      <View style={styles.loginInputView}>
        <View style={styles.iconContainer}>
          <Ionicons name="ios-person-outline" size={20} color="#fff" />
        </View>
        <TextInput
          value={lastName}
          style={styles.loginTextInput}
          placeholder="Last name..."
          placeholderTextColor="#fff"
          onChangeText={setLastName}
        />
      </View>

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

      <TouchableOpacity style={styles.loginButton} onPress={signUpWithEmail}>
        <Text style={styles.loginButtonText}>Sign up with Email</Text>
      </TouchableOpacity>

      <View style={styles.loginFooter}>
        <Text style={{ color: "#fff" }}>Have an account?</Text>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.replace("SignIn")}
        >
          <Text style={styles.secondaryButtonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
