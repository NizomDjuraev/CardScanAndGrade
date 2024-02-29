import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../components/Styles";
import { auth } from "../firebaseConfig";

export default function VerifyCodeScreen({ navigation }) {
  const [code, setCode] = useState("");

  const onPress = async () => {
    try {
      await auth.applyActionCode(code);
      // Email successfully verified, navigate to home screen
      navigation.navigate("HomeScreen");
    } catch (error) {
      // Handle error
      console.log("Error verifying email:", error.message);
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
