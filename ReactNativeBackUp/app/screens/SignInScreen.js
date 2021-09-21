import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import MyButton from "../components/MyButton";
import colors from "../config/colors";

import firebase from "../database/Firebase.js";
import InputStyles from "../styles/InputStyles";

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
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={InputStyles.input}
        onChangeText={onChangeEmail}
        placeholder={"Email"}
        autoCapitalize={"none"}
        value={email}
      />
      <TextInput
        style={InputStyles.input}
        value={pass}
        secureTextEntry={true}
        placeholder={"Password"}
        onChangeText={onChangePass}
      />
      <MyButton
        type={"Filled"}
        text={"Sign In"}
        style={{ width: "80%", marginTop: 5 }}
        onClick={login}
        loading={loading}
      />
      {errorMessage != "" ? (
        <Text
          style={{
            width: "80%",
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
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate("ForgetPassword")}
      >
        <Text
          style={{
            alignSelf: "flex-start",
            marginStart: "10%",
            color: colors.textGray,
          }}
        >
          Forgot Password?
        </Text>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  titleText: {
    marginTop: 5,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 30,
  },
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 10,
    height: "100%",
  },
});

export default SignInScreen;
