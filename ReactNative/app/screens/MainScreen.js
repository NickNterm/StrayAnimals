import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

import colors from "../config/colors";

import MainFeedScreen from "./MainFeedScreen";
var MapScreen;
import UploadScreen from "./UploadScreen";
if (Platform.OS !== "web") {
  MapScreen = require("./MapScreen").default;
}
import AccountScreen from "./AccountScreen";
import YouHaveToSignInScreen from "./YouHaveToSignInScreen";
import { Platform } from "react-native";
const Tab = createBottomTabNavigator();
function MainScreen({ route, navigation }) {
  const { postList, user } = route.params;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={MainFeedScreen}
        initialParams={{ postList: postList }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Upload"
        component={user != null ? UploadScreen : YouHaveToSignInScreen}
        screenOptions={{
          toolbar: false,
        }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="file-upload" color={color} size={size} />
          ),
        }}
      />
      {Platform.OS !== "web" ? (
        <Tab.Screen
          name="Map"
          component={MapScreen}
          initialParams={{ postList: postList }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="location-pin" color={color} size={size} />
            ),
          }}
        />
      ) : null}
      <Tab.Screen
        name="Account"
        component={user != null ? AccountScreen : YouHaveToSignInScreen}
        initialParams={user != null ? { user: user } : null}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="account-circle" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MainScreen;
