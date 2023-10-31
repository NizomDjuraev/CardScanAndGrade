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

const Tab = createBottomTabNavigator();


export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <RootNavigator />
    </NavigationContainer>
  )
}

const Stack = createNativeStackNavigator();


function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Profile" component={MyProfileScreen} />
    </Tab.Navigator>
  );
}

const RootNavigator = () => {
  const { isSignedIn } = useUser();

  return (
    <ClerkLoaded>
      <Stack.Navigator>
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
              options={{ title: "Sign Up" }}
            />
          </>
        )}
      </Stack.Navigator>
    </ClerkLoaded>
  )
}

