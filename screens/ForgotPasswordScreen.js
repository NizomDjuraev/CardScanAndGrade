import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { auth } from "../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

/**
* ForgotPasswordScreen component for handling the password reset process. Allows users to enter their email to receive a password reset link.
* @function ForgotPasswordScreen
* @returns {Object} The Forgot Password screen component.
*/
export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  /**
  * Sends a password reset email to the provided email address. Alerts the user about the status and navigates back to the SignIn screen upon success.
  * @async
  * @function handleResetPassword
  * @returns {Promise<void>} A promise that resolves when the password reset email is sent.
  */
  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(
          "Password Reset Email Sent",
          "Please check your email to reset your password.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("SignIn"),
            },
          ]
        );
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Enter your email address to reset your password.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#272727",
    padding: 30,
  },
  description: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    color: "#fff",
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1D9DB9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
