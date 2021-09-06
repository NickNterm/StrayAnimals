import React from "react";
import {
  View,
  TextInput,
  TouchableHighlight,
  Text,
  ActivityIndicator,
} from "react-native";
import colors from "../config/colors";
import firebase from "../database/Firebase.js";
function ForgetPasswordScreen(props) {
  const [email, onChangeEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  function sendResetEmail() {
    if (email != "") {
      if (successMessage == "") {
        setLoading(true);
        setErrorMessage("");
        firebase
          .auth()
          .sendPasswordResetEmail(email)
          .then(() => {
            setLoading(false);
            setSuccessMessage(
              "Email Sent!!! Check your email to reset the password"
            );
          })
          .catch((error) => {
            setErrorMessage(error.message);
            setLoading(false);
          });
      }
    } else {
      setErrorMessage("Fill the Email entry");
    }
  }
  return (
    <View
      style={{
        alignItems: "center",
        marginTop: 20,
        width: "90%",
        alignSelf: "center",
      }}
    >
      <TextInput
        style={inputStyle.input}
        onChangeText={onChangeEmail}
        placeholder={"Email"}
        autoCapitalize={"none"}
        value={email}
      />
      <TouchableHighlight
        style={[{ width: "90%", marginTop: 5 }, buttonStyle.buttonFilled]}
        underlayColor={colors.primaryHighlight}
        onPress={sendResetEmail}
      >
        <View>
          {loading ? (
            <ActivityIndicator size={22} color="#fff" />
          ) : (
            <Text style={buttonStyle.buttonFilledText}>Send Reset Link</Text>
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
      {successMessage != "" ? (
        <Text
          style={{
            width: "90%",
            textAlign: "center",
            marginTop: 5,
            paddingVertical: 10,
            borderRadius: 5,
            color: "#fff",
            backgroundColor: colors.successGreen,
          }}
        >
          {successMessage}
        </Text>
      ) : null}
    </View>
  );
}
const buttonStyle = require("../styles/ButtonStyles");
const inputStyle = require("../styles/InputStyles");
export default ForgetPasswordScreen;
