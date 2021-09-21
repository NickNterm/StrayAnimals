import React from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import CheckBox from "react-native-check-box";

import colors from "../config/colors";

import firebase from "../database/Firebase.js";
import MyButton from "../components/MyButton";
import InputStyles from "../styles/InputStyles";
import { Platform } from "react-native";

function UpdateProfileScreen({ navigation, route }) {
  const { user } = route.params;
  const [loading, setIsLoading] = React.useState(false);
  const [photo, onPhotoChange] = React.useState(user.photo);
  const [name, onChangeName] = React.useState(user.name);
  const [email, onChangeEmail] = React.useState(user.email);
  const [phone, onChangePhone] = React.useState(user.phone.toString());
  const [errorMessage, setErrorMessage] = React.useState("");
  const [checked, onChangeChecked] = React.useState(user.showPhone);

  function validateForm() {
    var isValid = true;
    var errorMessage = "";
    if (name == "") {
      isValid = false;
      errorMessage = "Name cannot be empty";
    }
    if (phone.trim().length != 10 || isNaN(phone.trim())) {
      isValid = false;
      errorMessage = "Phone number is not valid";
    }
    if (!isValid) {
      setErrorMessage(errorMessage);
    }
    return isValid;
  }
  var db = firebase.firestore();
  function editAccount() {
    setIsLoading(true);
    if (validateForm()) {
      var upload = async (uri) => {
        var fileName = uri.split(".");
        const response = await fetch(uri);
        const blob = await response.blob();
        firebase
          .storage()
          .ref()
          .child(
            "PROFILE_IMAGE_" + Date.now() + "." + fileName[fileName.length - 1]
          )
          .put(blob)
          .then((snapshot) => {
            snapshot.ref.getDownloadURL().then((downloadURL) => {
              var mUser = {
                name: name,
                phone: parseInt(phone),
                photo: downloadURL,
                showPhone: checked,
              };
              db.collection("Users")
                .doc(user.id)
                .update(mUser)
                .then(() => {
                  setIsLoading(false);
                  navigation.replace("SplashScreen");
                })
                .catch((error) => {
                  setIsLoading(false);
                  console.log(error);
                });
            });
          })
          .catch((error) => console.log(error));
      };
      if (photo != user.photo) {
        upload(photo);
      } else {
        var mUser = {
          name: name,
          phone: parseInt(phone),
          showPhone: checked,
        };
        db.collection("Users")
          .doc(user.id)
          .update(mUser)
          .then(() => {
            setIsLoading(false);
            navigation.replace("SplashScreen");
          })
          .catch((error) => {
            setIsLoading(false);
            console.log(error);
          });
      }
    } else {
      setIsLoading(false);
    }
  }
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

  return (
    <View style={styles.container}>
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
        style={InputStyles.input}
        onChangeText={onChangeName}
        placeholder={"Name"}
        value={name}
      />
      <TextInput
        style={InputStyles.input}
        value={email}
        placeholder={"Email"}
      />
      <TextInput
        style={InputStyles.input}
        value={phone}
        keyboardType="numeric"
        placeholder={"Phone"}
        onChangeText={onChangePhone}
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
      {Platform.OS !== "web" ? (
        <View
          style={{
            width: "80%",
            flexDirection: "row",
            alignSelf: "center",
          }}
        >
          <CheckBox
            style={{ flex: 1, padding: 10 }}
            checkBoxColor={colors.elementBackgroundDark}
            onClick={() => {
              onChangeChecked(!checked);
            }}
            isChecked={checked}
            rightText={"Show my phone to Everyone"}
          />
        </View>
      ) : null}
      <MyButton
        type={"Filled"}
        text={"Update Profile"}
        style={{ width: "80%", marginTop: 5 }}
        onClick={editAccount}
        loading={loading}
      />
    </View>
  );
}
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
    alignItems: "center",
    height: "100%",
  },
});
export default UpdateProfileScreen;
