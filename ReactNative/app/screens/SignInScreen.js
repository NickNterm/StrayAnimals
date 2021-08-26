import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import colors from "../config/colors";

import firebase from "../database/Firebase.js";

function SignInScreen({ navigation }) {
  const [errorMessage, setErrorMessage] = React.useState("");
  const [loading, setIsLoading] = React.useState(false);
  const [email, onChangeEmail] = React.useState("");
  const [pass, onChangePass] = React.useState("");
  function login() {
    setIsLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then((userCredential) => {
        setIsLoading(false);
        navigation.replace("SplashScreen");
      })
      .catch((error) => {
        setIsLoading(false);
        var errorMessage = error.message;
        setErrorMessage(errorMessage);
        console.log(error);
        // ..
      });
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={[{ marginTop: 10 }, styles.cardView]}>
        <TextInput
          style={inputStyle.input}
          onChangeText={onChangeEmail}
          placeholder={"Email"}
          autoCapitalize={"none"}
          value={email}
        />
        <TextInput
          style={inputStyle.input}
          value={pass}
          secureTextEntry={true}
          placeholder={"Password"}
          onChangeText={onChangePass}
        />

        <TouchableHighlight
          style={[{ width: "90%", marginTop: 5 }, buttonStyle.buttonFilled]}
          underlayColor={colors.primaryHighlight}
          onPress={login}
        >
          <View>
            {loading ? (
              <ActivityIndicator size={22} color="#fff" />
            ) : (
              <Text style={buttonStyle.buttonFilledText}>Sign In</Text>
            )}
          </View>
        </TouchableHighlight>
        {errorMessage != "" ? (
          <Text
            style={{
              width: "90%",
              textAlign: "center",
              marginTop: 5,
              paddingVertical: 10,
              borderRadius: 5,
              color: "#fff",
              backgroundColor: colors.errorRed,
            }}
          >
            {errorMessage}
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
const buttonStyle = require("../styles/ButtonStyles");
const inputStyle = require("../styles/InputStyles");
const styles = StyleSheet.create({
  titleText: {
    marginTop: 5,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 30,
  },
  cardView: {
    alignContent: "center",
    maxWidth: 400,
    borderRadius: 5,
    marginHorizontal: 20,
    borderColor: 0,
    borderWidth: 1,
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    height: "100%",
  },
});

export default SignInScreen;
