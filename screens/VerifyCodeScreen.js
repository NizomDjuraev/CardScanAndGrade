import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../firebaseConfig";
import { log } from "../logger";
import { styles } from "../components/Styles";

export default function VerifyCodeScreen({ navigation }) {
  const [code, setCode] = useState("");

  const onPress = async () => {
    try {
      // Verify the email address with Firebase using the code sent to user's email
      await auth.applyActionCode(code);

      // Navigate the user to home screen upon successful verification
      navigation.navigate("HomeScreen");
    } catch (error) {
      log("Error verifying email:", error.message);
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
          onChangeText={setCode}
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={onPress}>
        <Text style={styles.loginButtonText}>Verify Email</Text>
      </TouchableOpacity>
    </View>
  );
}
