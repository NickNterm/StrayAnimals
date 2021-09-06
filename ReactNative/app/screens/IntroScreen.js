import React from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Image,
  TouchableHighlight,
  SafeAreaView,
} from "react-native";

import colors from "../config/colors";
import firebase from "../database/Firebase.js";
function IntroScreen({ navigation }) {
  function loginAsGuest() {
    firebase
      .auth()
      .signInAnonymously()
      .then(() => {
        navigation.navigate("SplashScreen");
      });
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>StrayAnimals</Text>
      <Image
        resizeMode="contain"
        style={{ height: 250, marginBottom: 30 }}
        source={require("../assets/animal-shelter.png")}
      />
      <Text style={styles.messageText}>Welcome to Stray Animals App!!!</Text>
      <Text style={styles.messageText}>
        This app is all about helping stray animals to find a home to live
      </Text>
      <TouchableHighlight
        style={[{ width: "90%", marginTop: 20 }, buttonStyle.buttonFilled]}
        underlayColor={colors.primaryHighlight}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={buttonStyle.buttonFilledText}>Sign In</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={[{ width: "90%", marginTop: 5 }, buttonStyle.buttonOutlined]}
        underlayColor={colors.outlineHighlight}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={buttonStyle.buttonOutlinedText}>Sign Up</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={[{ width: "90%", marginTop: 5 }, buttonStyle.buttonOutlined]}
        underlayColor={colors.outlineHighlight}
        onPress={() => loginAsGuest()}
      >
        <Text style={buttonStyle.buttonOutlinedText}>Continue as a guest</Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
}
const buttonStyle = require("../styles/ButtonStyles");
const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    alignItems: "center",
  },
  titleText: {
    marginTop: 20,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 30,
  },
  messageText: {
    fontSize: 17,
    marginHorizontal: 30,
    textAlign: "center",
  },
});

export default IntroScreen;
