import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebaseConfig";
import {
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

/**
* MyProfileScreen component displays the user's profile information and provides options for signing out and deleting the account.
* @function MyProfileScreen
* @returns {Object} The My Profile screen component.
*/
export default function MyProfileScreenScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  /**
  * Gets the initials of the user's display name.
  * @function getInitials
  * @param {string} displayName - The display name of the user.
  * @returns {string} The initials of the display name.
  */
  const getInitials = (displayName) => {
    const names = displayName.split(" ");
    const firstInitial = names[0] ? names[0][0].toUpperCase() : "";
    const lastInitial = names[1] ? names[1][0].toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  /**
  * Signs out the current user and navigates to the SignIn screen.
  * @async
  * @function handleSignOutPress
  * @returns {Promise<void>} A promise that resolves when the user is signed out.
  */
  const handleSignOutPress = async () => {
    try {
      await auth.signOut();
      navigation.replace("SignIn");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  /**
  * Prompts the user to enter their password for reauthentication.
  * @function promptForCredentials
  * @returns {Promise<string|null>} A promise that resolves with the entered password or null if canceled.
  */
  const promptForCredentials = async () => {
    return new Promise((resolve) => {
      Alert.prompt(
        "Reauthenticate",
        "Please enter your password to continue:",
        [
          {
            text: "Cancel",
            onPress: () => resolve(null),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: (password) => resolve(password),
          },
        ],
        "secure-text"
      );
    });
  };

  /**
  * Deletes the user's account after reauthentication.
  * @async
  * @function handleDeleteAccount
  * @returns {Promise<void>} A promise that resolves when the account is deleted.
  */
  const handleDeleteAccount = async () => {
    try {
      // Prompt the user to re-enter their password for reauthentication
      const password = await promptForCredentials();

      if (!password) {
        // User canceled reauthentication, do nothing
        return;
      }

      const user = auth.currentUser;

      // Reauthenticate the user with their password
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // If reauthentication is successful, proceed with account deletion
      await deleteUser(user);

      // Show success message
      Alert.alert(
        "Success",
        "Your account has been successfully deleted.",
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate back to the sign-up screen
              navigation.replace("SignUp");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error deleting account:", error);
      // Handle errors
      if (error.code === "auth/wrong-password") {
        // Incorrect password entered, show an error message
        Alert.alert("Error", "Incorrect password. Please try again.");
      } else {
        // Handle other errors if needed
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Username Heading */}
      <View style={styles.userContainer}>
        <View style={styles.userInitials}>
          <Text style={styles.initialsText}>
            {user ? getInitials(user.displayName) : ""}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user ? user.displayName : ""}</Text>
          <Text style={styles.email}>{user ? user.email : ""}</Text>
        </View>
      </View>

      {/* My Collections setting */}
      <TouchableOpacity style={styles.settingItem}>
        <Ionicons
          name="albums"
          size={24}
          color="#004554"
          style={styles.settingIcon}
        />
        <Text style={styles.settingText}>My Collections</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="#004554"
          style={styles.settingArrow}
        />
      </TouchableOpacity>
      {/* Divider */}
      <View style={styles.divider}></View>

      {/* My Grades setting */}
      <TouchableOpacity style={styles.settingItem}>
        <Ionicons
          name="star"
          size={24}
          color="#004554"
          style={styles.settingIcon}
        />
        <Text style={styles.settingText}>My Grades</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="#004554"
          style={styles.settingArrow}
        />
      </TouchableOpacity>
      {/* Divider */}
      <View style={styles.divider}></View>

      {/* Capture Card setting */}
      <TouchableOpacity style={styles.settingItem}>
        <Ionicons
          name="camera"
          size={24}
          color="#004554"
          style={styles.settingIcon}
        />
        <Text style={styles.settingText}>Capture Card</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="#004554"
          style={styles.settingArrow}
        />
      </TouchableOpacity>
      {/* Divider */}
      <View style={styles.divider}></View>

      {/* Account setting */}
      <TouchableOpacity style={styles.settingItem}>
        <Ionicons
          name="settings"
          size={24}
          color="#004554"
          style={styles.settingIcon}
        />
        <Text style={styles.settingText}>Account Settings</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="#004554"
          style={styles.settingArrow}
        />
      </TouchableOpacity>
      {/* Divider */}
      <View style={styles.divider}></View>

      {/* Settings setting */}
      <TouchableOpacity style={styles.settingItem}>
        <Ionicons
          name="options"
          size={24}
          color="#004554"
          style={styles.settingIcon}
        />
        <Text style={styles.settingText}>Settings</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="#004554"
          style={styles.settingArrow}
        />
      </TouchableOpacity>
      {/* Divider */}
      <View style={styles.divider}></View>

      {/* Account Details setting */}
      <TouchableOpacity style={styles.settingItem}>
        <Ionicons
          name="alert-circle-outline"
          size={24}
          color="#004554"
          style={styles.settingIcon}
        />
        <Text style={styles.settingText}>Account Details</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="#004554"
          style={styles.settingArrow}
        />
      </TouchableOpacity>
      {/* Divider */}
      <View style={styles.divider}></View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutItem} onPress={handleSignOutPress}>
        <Ionicons
          name="log-out-outline"
          size={24}
          color="#8E0909"
          style={styles.logoutIcon}
        />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Delete account button */}
      <TouchableOpacity
        style={[styles.settingItem, styles.deleteButton]}
        onPress={handleDeleteAccount}
      >
        <Text style={[styles.settingText, { color: "#ffffff" }]}>
          Delete Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#959595",
    width: "100%",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginBottom: 10,
    marginTop: 10,
  },
  settingIcon: {
    marginRight: 10,
  },
  settingText: {
    fontSize: 18,
    color: "#004554",
  },
  settingArrow: {
    marginLeft: "auto",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#272727",
    width: "90%",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userInitials: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#004554",
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    color: "white",
    fontSize: 18,
  },
  userInfo: {
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
  },
  email: {
    fontSize: 16,
  },
  logoutText: {
    fontSize: 18,
    color: "#8E0909",
  },
  logoutIcon: {
    marginRight: 10,
    transform: [{ scaleX: -1 }],
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "30%",
    marginBottom: 10,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "#8E0909",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 20,
    alignSelf: "center",
  },
});
