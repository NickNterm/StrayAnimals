import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./app/screens/SplashScreen";
import IntroScreen from "./app/screens/IntroScreen";
import SignInScreen from "./app/screens/SignInScreen";
import SignUpScreen from "./app/screens/SignUpScreen";
import MainScreen from "./app/screens/MainScreen";
import UploadScreenDetails from "./app/screens/UploadScreenDetails";
import SelectLocationMap from "./app/screens/SelectLocationMap";
import ShowLocationInMap from "./app/screens/ShowLocationInMap";
import AccountScreen from "./app/screens/AccountScreen";
import UpdateProfileScreen from "./app/screens/UpdateProfileScreen";
import AccountSettingsScreen from "./app/screens/AccountSettingsScreen";
import ForgetPasswordScreen from "./app/screens/ForgetPasswordScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="SplashScreen"
          options={{ headerShown: false }}
          component={SplashScreen}
        />
        <Stack.Screen
          name="IntroScreen"
          options={{ headerShown: false }}
          component={IntroScreen}
        />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen
          name="MainScreen"
          options={{ headerShown: false }}
          component={MainScreen}
        />
        <Stack.Screen name="UploadDetails" component={UploadScreenDetails} />
        <Stack.Screen name="SelectLocationMap" component={SelectLocationMap} />
        <Stack.Screen name="ShowLocation" component={ShowLocationInMap} />
        <Stack.Screen name="ShowAccount" component={AccountScreen} />
        <Stack.Screen name="EditAccount" component={UpdateProfileScreen} />
        <Stack.Screen name="Settings" component={AccountSettingsScreen} />
        <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
