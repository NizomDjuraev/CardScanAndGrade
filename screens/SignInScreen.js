import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { useSignIn } from "@clerk/clerk-expo"
import { log } from "../logger"
import { OAuthButtons } from "../components/OAuth"
import { styles } from "../components/Styles"
import { Ionicons } from '@expo/vector-icons';

/**
 * SignInScreen component enables users to sign in using their email and password. It leverages the useSignIn hook for authentication processes, including signing in and managing user sessions. Manages state for user input fields.
 * @function SignInScreen
 * @param {Object} navigation - Navigation prop for screen transitions.
 * @returns {Object} The SignIn screen component.
 */
export default function SignInScreen({ navigation }) {
  const { signIn, setSession, isLoaded } = useSignIn()

  const [emailAddress, setEmailAddress] = React.useState("")
  const [password, setPassword] = React.useState("")

  /**
   * Attempts to sign in the user using provided credentials. Sets the user session upon successful sign-in.
   * @async
   * @function onSignInPress
   * @returns {Promise<void>} A promise resolving when sign-in process is complete.
   */
  const onSignInPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password
      })

      await setSession(completeSignIn.createdSessionId)
    } catch (err) {
      log("Error:> " + err?.status || "")
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err)
    }
  }

  /**
   * Handles navigation to the SignUp screen.
   * @function onSignUpPress
   */
  const onSignUpPress = () => navigation.replace("SignUp")

  return (
    <View style={styles.loginView}>
      <View style={styles.oauthView}>
        <OAuthButtons />
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
          onChangeText={emailAddress => setEmailAddress(emailAddress)}
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
          onChangeText={password => setPassword(password)}
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={onSignInPress}>
        <Text style={styles.loginButtonText}>Sign in</Text>
      </TouchableOpacity>

      <View style={styles.loginFooter}>
        <Text style={{ color: '#fff' }}>Don't have an account?</Text>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onSignUpPress}
        >
          <Text style={styles.secondaryButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

