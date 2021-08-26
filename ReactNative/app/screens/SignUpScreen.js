import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  Linking,
} from "react-native";
import colors from "../config/colors";
import * as ImagePicker from "expo-image-picker";
import CheckBox from "react-native-check-box";

import firebase from "../database/Firebase.js";
function SignUpScreen({ navigation }) {
  const [errorMessage, setErrorMessage] = React.useState("");
  const [loading, setIsLoading] = React.useState(false);
  const [name, onChangeName] = React.useState("");
  const [email, onChangeEmail] = React.useState("");
  const [phone, onChangePhone] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const [repeat, onChangeRepeat] = React.useState("");
  const [photo, onPhotoChange] = React.useState("");
  const [checked, onChangeChecked] = React.useState(true);
  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      onPhotoChange(result.uri);
    }
  };
  function validateForm() {
    var isValid = true;
    var errorMessage = "";
    if (name.trim() == "") {
      isValid = false;
      errorMessage = "Name cannot be empty";
    }
    if (email.trim() == "") {
      isValid = false;
      errorMessage = "Email cannot be empty";
    }
    if (phone.trim().length != 10) {
      isValid = false;
      errorMessage = "Phone number is not valid";
    }
    if (password.trim() == "" || repeat.trim() == "") {
      isValid = false;
      errorMessage = "Password cannot be empty";
    }
    if (repeat.trim() != password.trim()) {
      isValid = false;
      errorMessage = "Passwords do not match";
    }
    if (!isValid) {
      setErrorMessage(errorMessage);
    }
    return isValid;
  }
  var db = firebase.firestore();

  function signUp() {
    setIsLoading(true);
    if (validateForm()) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          var user = {
            name: name,
            email: email,
            id: userCredential.user.uid.toString(),
            block: 0,
            phone: phone,
            photo: photo,
            showPhone: checked,
          };
          db.collection("Users")
            .doc(userCredential.user.uid)
            .set(user)
            .then(() => {
              navigation.replace("SplashScreen");
              setIsLoading(false);
            })
            .catch((error) => {
              setIsLoading(false);
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
          setErrorMessage(error.message);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }

  function openLink() {
    var url = "http://strayanimalsapp.web.app/terms_and_conditions";
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[{ marginTop: 10 }, styles.cardView]}>
        <TouchableWithoutFeedback onPress={pickImage}>
          <Image
            resizeMode="cover"
            style={styles.profileImage}
            source={
              photo == ""
                ? require("../assets/accountPlaceholder.png")
                : { uri: photo }
            }
          />
        </TouchableWithoutFeedback>
        <TextInput
          style={inputStyle.input}
          onChangeText={onChangeName}
          placeholder={"Name"}
          value={name}
        />
        <TextInput
          style={inputStyle.input}
          value={email}
          placeholder={"Email"}
          autoCapitalize={"none"}
          onChangeText={onChangeEmail}
        />
        <TextInput
          style={inputStyle.input}
          value={phone}
          keyboardType="numeric"
          placeholder={"Phone"}
          onChangeText={onChangePhone}
        />
        <TextInput
          style={inputStyle.input}
          value={password}
          secureTextEntry={true}
          placeholder={"Password"}
          onChangeText={onChangePassword}
        />
        <TextInput
          style={inputStyle.input}
          value={repeat}
          secureTextEntry={true}
          placeholder={"Repeat"}
          onChangeText={onChangeRepeat}
        />

        <View
          style={{
            width: "90%",
            flexDirection: "row",
            alignSelf: "center",
          }}
        >
          <CheckBox
            style={{ flex: 1, padding: 10 }}
            onClick={() => {
              onChangeChecked(!checked);
            }}
            isChecked={checked}
            rightText={"Show my phone to Everyone"}
          />
        </View>
        <TouchableHighlight
          style={[{ width: "90%" }, buttonStyle.buttonFilled]}
          underlayColor={colors.primaryHighlight}
          onPress={signUp}
        >
          {loading ? (
            <ActivityIndicator size={22} color="#fff" />
          ) : (
            <Text style={buttonStyle.buttonFilledText}>Sign Up</Text>
          )}
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
        <Text
          style={{
            textAlign: "center",
            marginTop: 10,
            color: colors.textGrayBlack,
          }}
        >
          By signing up, you agree to our{"\n"}
          <TouchableWithoutFeedback onPress={openLink}>
            <Text style={{ fontWeight: "bold" }}>Terms {"&"} Conditions</Text>
          </TouchableWithoutFeedback>
        </Text>
      </View>
    </SafeAreaView>
  );
}
const buttonStyle = require("../styles/ButtonStyles");
const inputStyle = require("../styles/InputStyles");
const styles = StyleSheet.create({
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
  },
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

export default SignUpScreen;
