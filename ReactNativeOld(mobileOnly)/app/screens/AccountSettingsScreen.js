import { StackActions, NavigationActions } from "@react-navigation/native";
import React from "react";
import {
  View,
  FlatList,
  Text,
  Switch,
  TouchableHighlight,
  Linking,
} from "react-native";
import colors from "../config/colors";
import firebase from "../database/Firebase.js";
function AccountSettingsScreen({ navigation, route }) {
  const { mUser } = route.params;
  function openLink(url) {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  }
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
            onPress={() =>
              openLink("http://strayanimalsapp.web.app/terms_and_conditions")
            }
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
            onPress={() => openLink("http://strayanimalsapp.web.app/policy")}
          >
            <Text>Privacy Policy</Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
}

export default AccountSettingsScreen;
