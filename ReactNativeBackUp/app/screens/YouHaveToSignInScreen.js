import React from "react";
import { View, Text, TouchableHighlight } from "react-native";
import MyButton from "../components/MyButton";
function YouHaveToSignInScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ textAlign: "center", margin: 5, fontSize: 20 }}>
        You have to Sign Up or Sign In{"\n"}to have access in this Feature
      </Text>
      <MyButton
        type={"Filled"}
        text={"Sign In"}
        style={{ width: "90%", marginTop: 20 }}
        onClick={() => navigation.navigate("SignIn")}
      />
      <MyButton
        type={"Outline"}
        text={"Sign Up"}
        style={{ width: "90%", marginTop: 5 }}
        onClick={() => navigation.navigate("SignUp")}
      />
    </View>
  );
}

export default YouHaveToSignInScreen;
