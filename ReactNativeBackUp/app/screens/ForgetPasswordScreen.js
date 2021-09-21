import React from "react";
import {
  View,
  TextInput,
  TouchableHighlight,
  Text,
  ActivityIndicator,
} from "react-native";
import MyButton from "../components/MyButton";
import colors from "../config/colors";
import firebase from "../database/Firebase.js";
import InputStyles from "../styles/InputStyles";

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
    <View style={{ flex: 1, backgroundColor: "#fff", alignItems: "center" }}>
      <TextInput
        style={InputStyles.input}
        onChangeText={onChangeEmail}
        placeholder={"Email"}
        autoCapitalize={"none"}
        value={email}
      />
      <MyButton
        type={"Filled"}
        text={"Send Reset Link"}
        style={{ width: "80%", marginTop: 5 }}
        onClick={sendResetEmail}
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
export default ForgetPasswordScreen;
