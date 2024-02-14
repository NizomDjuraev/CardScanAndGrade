import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

/**
 * SettingsScreen component that displays settings options for the user.
 * This screen is part of a navigation stack, where the user can navigate to different parts of the application.
 * Currently, it only displays a static title.
 * 
 * @param {Object} props.navigation - Navigation prop provided by the navigation library.
 * @returns {React.ReactElement} The Settings screen element.
 */
export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
});
