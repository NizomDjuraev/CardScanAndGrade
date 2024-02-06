import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";

export default function SettingsScreen({ navigation }) {
  const { signOut } = useAuth();

  const handleSignOutPress = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchBox}>
          <Ionicons
            name="search"
            size={24}
            color="black"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search for a setting..."
            placeholderTextColor="#999"
            style={styles.input}
            onChangeText={(text) => {
              // Handle text change to filter out settings
            }}
          />
        </TouchableOpacity>
      </View>

      {/* Account setting */}
      <TouchableOpacity style={styles.settingItem}>
        <Ionicons
          name="person-outline"
          size={24}
          color="#004554"
          style={styles.settingIcon}
        />
        <Text style={styles.settingText}>Account</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="#004554"
          style={styles.settingArrow}
        />
      </TouchableOpacity>
      {/* Divider */}
      <View style={styles.divider}></View>

      {/* Notifications setting */}
      <TouchableOpacity style={styles.settingItem}>
        <Ionicons
          name="notifications-outline"
          size={24}
          color="#004554"
          style={styles.settingIcon}
        />
        <Text style={styles.settingText}>Notifications</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="#004554"
          style={styles.settingArrow}
        />
      </TouchableOpacity>
      {/* Divider */}
      <View style={styles.divider}></View>

      {/* Preferences setting */}
      <TouchableOpacity style={styles.settingItem}>
        <Ionicons
          name="options-outline"
          size={24}
          color="#004554"
          style={styles.settingIcon}
        />
        <Text style={styles.settingText}>Preferences</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="#004554"
          style={styles.settingArrow}
        />
      </TouchableOpacity>
      {/* Divider */}
      <View style={styles.divider}></View>

      {/* Appearance setting */}
      <TouchableOpacity style={styles.settingItem}>
        <Ionicons
          name="image-outline"
          size={24}
          color="#004554"
          style={styles.settingIcon}
        />
        <Text style={styles.settingText}>Appearance</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="#004554"
          style={styles.settingArrow}
        />
      </TouchableOpacity>
      {/* Divider */}
      <View style={styles.divider}></View>

      {/* Privacy & Security setting */}
      <TouchableOpacity style={styles.settingItem}>
        <Ionicons
          name="lock-closed-outline"
          size={24}
          color="#004554"
          style={styles.settingIcon}
        />
        <Text style={styles.settingText}>Privacy & Security</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="#004554"
          style={styles.settingArrow}
        />
      </TouchableOpacity>
      {/* Divider */}
      <View style={styles.divider}></View>

      {/* Help & Support setting */}
      <TouchableOpacity style={styles.settingItem}>
        <Ionicons
          name="alert-circle-outline"
          size={24}
          color="#004554"
          style={styles.settingIcon}
        />
        <Text style={styles.settingText}>Help & Support</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="#004554"
          style={styles.settingArrow}
        />
      </TouchableOpacity>
      {/* Divider */}
      <View style={styles.divider}></View>

      {/* About setting */}
      <TouchableOpacity style={styles.settingItem}>
        <Ionicons
          name="document-text-outline"
          size={24}
          color="#004554"
          style={styles.settingIcon}
        />
        <Text style={styles.settingText}>About</Text>
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
    justifyContent: "start",
    alignItems: "center",
    backgroundColor: "#959595",
  },
  searchContainer: {
    width: "100%",
    alignItems: "center",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    width: "90%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "black",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
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
    width: "80%",
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
