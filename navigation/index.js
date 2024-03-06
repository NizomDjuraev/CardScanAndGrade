import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SignUpScreen from "../screens/SignUpScreen";
import SignInScreen from "../screens/SignInScreen";
import VerifyCodeScreen from "../screens/VerifyCodeScreen";
import MyProfileScreen from "../screens/MyProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ExportScreen from "../screens/ExportScreen";

import AnnotateScreen from "../screens/AnnotateScreen";
import AdjustBordersScreen from "../screens/AdjustBordersScreen";


import LinkingConfiguration from "./LinkingConfiguration";
import { ClerkLoaded, useUser } from "@clerk/clerk-expo";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <ClerkLoaded>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: "#272727" },
            headerTitleStyle: { color: "#fff" },
          }}
        >
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
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </ClerkLoaded>
    </NavigationContainer>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#272727",
        },
        headerTitleStyle: {
          color: "#1D9DB9",
        },
        tabBarStyle: {
          backgroundColor: "#272727",
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#1D9DB9",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AntDesign
              name="home"
              size={size}
              color={focused ? "white" : "#1D9DB9"}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AntDesign
              name="camerao"
              size={size}
              color={focused ? "white" : "#1D9DB9"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AntDesign
              name="setting"
              size={size}
              color={focused ? "white" : "#1D9DB9"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={MyProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={focused ? "white" : "#1D9DB9"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
