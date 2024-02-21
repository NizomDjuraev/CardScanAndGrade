// import React from "react";
// import { Text, TouchableOpacity } from "react-native";
// import { firebase } from "@react-native-firebase/auth";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
// import { log } from "../logger";
// import { styles } from "./Styles";

// GoogleSignin.configure({
//   webClientId:
//     "693229136898-ci6i2hv4i46691nf8ht7k5bnd6a2bpds.apps.googleusercontent.com",
// });

// export function OAuthButtons() {
//   const signInWithGoogle = async () => {
//     try {
//       // Get the Google OAuth credential
//       const { idToken } = await GoogleSignin.signIn();

//       // Create a Google credential with the token
//       const googleCredential =
//         firebase.auth.GoogleAuthProvider.credential(idToken);

//       // Sign in with the Google credential
//       await firebase.auth().signInWithCredential(googleCredential);
//     } catch (error) {
//       log("Google sign-in error:", error.message);
//     }
//   };

//   return (
//     <TouchableOpacity
//       style={{ ...styles.secondaryButton, marginBottom: 20 }}
//       onPress={signInWithGoogle}
//     >
//       <Text style={styles.secondaryButtonText}>Continue with Google</Text>
//     </TouchableOpacity>
//   );
// }
