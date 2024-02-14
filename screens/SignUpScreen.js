import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { log } from "../logger";
import { styles } from "../components/Styles";
import { OAuthButtons } from "../components/OAuth";
import { Ionicons } from '@expo/vector-icons';


/**
 * SignUpScreen component enables user registration using their personal information. Leverages the useSignUp hook for registration processes and state management for user input.
 * @function SignUpScreen
 * @param {Object} navigation - Navigation prop for screen transitions.
 * @returns {Object} The SignUp screen component.
 */
export default function SignUpScreen({ navigation }) {
  const { isLoaded, signUp } = useSignUp();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  /**
   * Initiates the sign-up process with provided user information. Upon successful sign-up, prepares for email address verification and navigates to the verification code screen.
   * @async
   * @function onSignUpPress
   * @returns {Promise<void>} Promimse resolves when the sign-up process is complete.
   */
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });

      // https://docs.clerk.dev/popular-guides/passwordless-authentication
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      navigation.navigate("VerifyCode");
    } catch (err) {
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
    }
  };

  /**
   * Handles navigation back to the SignIn screen.
   * @function onSignInPress
   */
  const onSignInPress = () => navigation.replace("SignIn");

  return (
    <View style={styles.loginView}>
      <View style={styles.oauthView}>
        <OAuthButtons />
      </View>

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
        <Text style={{ color: '#fff' }}>Have an account?</Text>

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
