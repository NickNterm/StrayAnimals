import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./app/screens/SplashScreen";
import SignInScreen from "./app/screens/SignInScreen";
import SignUpScreen from "./app/screens/SignUpScreen";
import MainScreen from "./app/screens/MainScreen";
/*
import SelectLocationMap from "./app/screens/SelectLocationMap";
*/
import UploadScreenDetails from "./app/screens/UploadScreenDetails";
import AccountScreen from "./app/screens/AccountScreen";
import UpdateProfileScreen from "./app/screens/UpdateProfileScreen";
import AccountSettingsScreen from "./app/screens/AccountSettingsScreen";
import ForgetPasswordScreen from "./app/screens/ForgetPasswordScreen";
import { Platform } from "react-native";
import TermsScreen from "./app/screens/TermsScreen";
import PolicyScreen from "./app/screens/PolicyScreen";
let ShowLocationInMap;
if (Platform.OS !== "web") {
  ShowLocationInMap = require("./app/screens/ShowLocationInMap").default;
}
let SelectLocationMap;
if (Platform.OS !== "web") {
  SelectLocationMap = require("./app/screens/SelectLocationMap").default;
}
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View
      style={{ flex: 1, maxWidth: 500, width: "100%", alignSelf: "center" }}
    >
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"App"}>
          <Stack.Screen
            name="SplashScreen"
            options={{ headerShown: false }}
            component={SplashScreen}
          />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen
            name="MainScreen"
            options={{ headerShown: false }}
            component={MainScreen}
          />

          <Stack.Screen name="UploadDetails" component={UploadScreenDetails} />
          {Platform.OS !== "web" ? (
            <Stack.Screen
              name="SelectLocationMap"
              component={SelectLocationMap}
            />
          ) : null}
          {Platform.OS !== "web" ? (
            <Stack.Screen name="ShowLocation" component={ShowLocationInMap} />
          ) : null}

          <Stack.Screen name="ShowAccount" component={AccountScreen} />
          <Stack.Screen name="EditAccount" component={UpdateProfileScreen} />
          <Stack.Screen name="Settings" component={AccountSettingsScreen} />
          <Stack.Screen
            name="Terms"
            component={TermsScreen}
            options={{ title: "Terms & Conditions" }}
          />
          <Stack.Screen name="Policy" component={PolicyScreen} />
          <Stack.Screen
            name="ForgetPassword"
            component={ForgetPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
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
