import { StackActions, NavigationActions } from "@react-navigation/native";
import React from "react";
import { Linking } from "react-native";
import { View, Text, TouchableHighlight } from "react-native";
import colors from "../config/colors";
import firebase from "../database/Firebase.js";
function AccountSettingsScreen({ navigation, route }) {
  const { mUser } = route.params;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <View style={{ margin: 10 }}>
        <Text style={{ marginStart: 10, fontWeight: "bold", fontSize: 16 }}>
          Account
        </Text>
        <View
          style={{
            borderRadius: 5,
            borderWidth: 1,
            borderColor: colors.textGray,
            backgroundColor: colors.background,
          }}
        >
          <TouchableHighlight
            style={{ padding: 10, overflow: "hidden" }}
            underlayColor={colors.inputBackgoundGray}
            onPress={() => {
              navigation.navigate("EditAccount", { user: mUser });
            }}
          >
            <Text>Edit Account</Text>
          </TouchableHighlight>
          <View
            style={{
              borderWidth: 0.7,
              borderColor: colors.inputBackgoundGray,
            }}
          />
          <TouchableHighlight
            style={{ padding: 10, overflow: "hidden" }}
            underlayColor={colors.inputBackgoundGray}
            onPress={() => {
              firebase.auth().signOut();
              navigation.replace("SplashScreen");
            }}
          >
            <Text>Log Out</Text>
          </TouchableHighlight>
        </View>
      </View>

      <View style={{ margin: 10 }}>
        <Text style={{ marginStart: 10, fontWeight: "bold", fontSize: 16 }}>
          About
        </Text>
        <View
          style={{
            borderRadius: 5,
            borderWidth: 1,
            borderColor: colors.textGray,
            backgroundColor: colors.background,
          }}
        >
          <TouchableHighlight
            style={{ padding: 10, overflow: "hidden" }}
            underlayColor={colors.inputBackgoundGray}
            onPress={() => navigation.navigate("Terms")}
          >
            <Text>Terms {"&"} Conditions</Text>
          </TouchableHighlight>
          <View
            style={{
              borderWidth: 0.7,
              borderColor: colors.inputBackgoundGray,
            }}
          />
          <TouchableHighlight
            style={{ padding: 10, overflow: "hidden" }}
            underlayColor={colors.inputBackgoundGray}
            onPress={() => navigation.navigate("Policy")}
          >
            <Text>Privacy Policy</Text>
          </TouchableHighlight>
          <View
            style={{
              borderWidth: 0.7,
              borderColor: colors.inputBackgoundGray,
            }}
          />
          <TouchableHighlight
            style={{ padding: 10, overflow: "hidden" }}
            underlayColor={colors.inputBackgoundGray}
            onPress={() =>
              Linking.openURL("https://www.freepik.com/vectors/icons")
            }
          >
            <Text>Icons vector created by freepik</Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
}

export default AccountSettingsScreen;
