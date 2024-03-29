import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../components/Styles";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";

export default function SignUpScreen({ navigation }) {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

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
      // await sendEmailVerification(user);

      // Navigate to verification code screen
      navigation.navigate("MainTabs");
    } catch (error) {
      console.log("Error signing up:", error.message);
    }
  };

  const onSignInPress = () => navigation.replace("SignIn");

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
          onChangeText={(firstName) => setFirstName(firstName)}
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
          onChangeText={(lastName) => setLastName(lastName)}
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
