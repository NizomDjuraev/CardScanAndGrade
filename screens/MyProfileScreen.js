import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebaseConfig";

export default function MyProfileScreenScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const getInitials = (displayName) => {
    const names = displayName.split(" ");
    const firstInitial = names[0] ? names[0][0].toUpperCase() : "";
    const lastInitial = names[1] ? names[1][0].toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  const handleSignOutPress = async () => {
    try {
      await auth.signOut();
      navigation.replace("SignIn");
    } catch (error) {
      console.error("Error signing out:", error);
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
});
