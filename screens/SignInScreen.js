import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { useSignIn } from "@clerk/clerk-expo"
import { log } from "../logger"
import { OAuthButtons } from "../components/OAuth"
import { styles } from "../components/Styles"
import { Ionicons } from '@expo/vector-icons';

/**
 * SignInScreen component provides a UI for users to sign in. Uses useSignIn
 * for authentication processes including signing in and session management. The component manages
 * input states for email address and password.
 * 
 * @param {Object} props.navigation - Navigation prop for navigating between screens.
 */
export default function SignInScreen({ navigation }) {
  const { signIn, setSession, isLoaded } = useSignIn()

  const [emailAddress, setEmailAddress] = React.useState("")
  const [password, setPassword] = React.useState("")

  /**
   * Sign in the user with email and password.
   * If successful, sets the user session. If not loaded or an error occurs, logs the error.
   * 
   * @async
   * @function onSignInPress
   * @returns {Promise<void>}
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
   * Navigates to the SignUp screen.
   * 
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

