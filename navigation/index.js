/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";

import SignUpScreen from "../screens/SignUpScreen";
import SignInScreen from "../screens/SignInScreen";
import VerifyCodeScreen from "../screens/VerifyCodeScreen";
import MyProfileScreen from "../screens/MyProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
import SettingsScreen from "../screens/SettingsScreen";

import LinkingConfiguration from "./LinkingConfiguration";
import { ClerkLoaded, useUser } from "@clerk/clerk-expo";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

/**
 * @name Navigation
 * @description Sets up the app's navigation using React Navigation, including a bottom tab navigator for main app sections and a stack navigator for authentication and profile management. Integrates Clerk for authentication, dynamically adjusting navigation based on the user's sign-in status.
 * @global
 */
export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <RootNavigator />
    </NavigationContainer>
  )
}

const Stack = createNativeStackNavigator();

/**
 * @name MainTabs
 * @description Defines the main tab navigation interface, including tabs for the Home, Camera, Settings, and Profile screens, each with custom icons and styling.
 * @global
 */
function MainTabs() {
  const iconColor = '#1D9DB9';

  return (
    <Tab.Navigator 
      screenOptions={{
        headerStyle: {
          backgroundColor: '#272727',
        },
        headerTitleStyle: {
          color: '#1D9DB9'
        },
        tabBarStyle: {
          backgroundColor: '#272727',
        }, 
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: iconColor,
      }}
    >
      <Tab.Screen 
        name="My Collections" 
        component={HomeScreen} 
        options={{
            tabBarIcon: ({ color, size, focused }) => (
              <AntDesign name="home" size={size} color={focused ? 'white' : iconColor} />
            ), headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AntDesign name="camerao" size={size} color={focused ? 'white' : iconColor} />
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AntDesign name="setting" size={size} color={focused ? 'white' : iconColor} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={MyProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="person-outline" size={size} color={focused ? 'white' : iconColor} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


/**
 * Manages the root navigation stack of the app, dynamically adjusting its structure based on the user's authentication
 * status. This makes sure theres a smooth transition between different parts of the app based on user state.
 */
const RootNavigator = () => {
  const { isSignedIn } = useUser();

  return (
    <ClerkLoaded>
      <Stack.Navigator
        screenOptions={{ 
          headerStyle: {backgroundColor: "#272727"}, headerTitleStyle: {color: "#fff"},
        }}
      >
        {isSignedIn ? (
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }} 
          />
        ) : (
          <>
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ title: "Sign Up" }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ title: "Sign In" }}
            />
            <Stack.Screen
              name="VerifyCode"
              component={VerifyCodeScreen}
              options={{ title: "Verify Code" }}
            />
          </>
        )}
      </Stack.Navigator>
    </ClerkLoaded>
  )
}
