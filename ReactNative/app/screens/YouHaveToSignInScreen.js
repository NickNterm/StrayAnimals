import React from "react";
import { View, Text, TouchableHighlight } from "react-native";
import colors from "../config/colors";
import firebase from "../database/Firebase.js";
function YouHaveToSignInScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ textAlign: "center", margin: 5, fontSize: 20 }}>
        You have to Sign Up or Sign In{"\n"}to have access in this Feature
      </Text>
      <TouchableHighlight
        style={[{ width: "90%", marginTop: 20 }, buttonStyle.buttonFilled]}
        underlayColor={colors.primaryHighlight}
        onPress={() => {
          firebase.auth().signOut();
          navigation.navigate("SignIn");
        }}
      >
        <Text style={buttonStyle.buttonFilledText}>Sign In</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={[{ width: "90%", marginTop: 5 }, buttonStyle.buttonOutlined]}
        underlayColor={colors.outlineHighlight}
        onPress={() => {
          navigation.navigate("SignUp");
        }}
      >
        <Text style={buttonStyle.buttonOutlinedText}>Sign Up</Text>
      </TouchableHighlight>
    </View>
  );
}

const buttonStyle = require("../styles/ButtonStyles");

export default YouHaveToSignInScreen;
