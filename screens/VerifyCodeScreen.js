import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { styles } from "../components/Styles";
import { log } from "../logger";

export default function SignUpScreen({ navigation }) {
  const { isLoaded, signUp, setSession } = useSignUp();

  const [code, setCode] = React.useState("");

  const onPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setSession(completeSignUp.createdSessionId);
    } catch (err) {
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
    }
  };

  return (
    <View style={styles.loginView}>
      <View style={styles.loginInputView}>
        <TextInput
          value={code}
          style={styles.loginTextInput}
          placeholder="Code..."
          placeholderTextColor="#fff"
          onChangeText={(code) => setCode(code)}
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={onPress}>
        <Text style={styles.loginButtonText}>Verify Email</Text>
      </TouchableOpacity>
    </View>
  );
}
