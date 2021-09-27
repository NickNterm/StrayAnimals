import React from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import CheckBox from "react-native-check-box";

import colors from "../config/colors";

import firebase from "../database/Firebase.js";
import MyButton from "../components/MyButton";
import InputStyles from "../styles/InputStyles";
import { Platform } from "react-native";
const images = [
  "https://firebasestorage.googleapis.com/v0/b/strayanimalsapp.appspot.com/o/ProfilePhotos%2Fcat.png?alt=media&token=80e0a5bc-c5c3-4c52-9ab0-d2884334932c",
  "https://firebasestorage.googleapis.com/v0/b/strayanimalsapp.appspot.com/o/ProfilePhotos%2Fdog.png?alt=media&token=e9bf3193-51c4-4a4f-8601-95008bdffd03",
  "https://firebasestorage.googleapis.com/v0/b/strayanimalsapp.appspot.com/o/ProfilePhotos%2Felephant.png?alt=media&token=4af6efec-004d-4283-a498-d1e31b471e4f",
  "https://firebasestorage.googleapis.com/v0/b/strayanimalsapp.appspot.com/o/ProfilePhotos%2Ffox.png?alt=media&token=43cfadf5-7878-4cb4-bed7-836c1e62c651",
  "https://firebasestorage.googleapis.com/v0/b/strayanimalsapp.appspot.com/o/ProfilePhotos%2Fmonkey.png?alt=media&token=9f01b29b-45a7-4ee5-be61-1dfffbda3be5",
  "https://firebasestorage.googleapis.com/v0/b/strayanimalsapp.appspot.com/o/ProfilePhotos%2Fpanda.png?alt=media&token=9f7eae57-dc84-4f92-97d7-fc9b65153dc8",
  "https://firebasestorage.googleapis.com/v0/b/strayanimalsapp.appspot.com/o/ProfilePhotos%2Fpig.png?alt=media&token=a07c5852-9864-4c63-b400-3f484973aa2c",
  "https://firebasestorage.googleapis.com/v0/b/strayanimalsapp.appspot.com/o/ProfilePhotos%2Fsquirrel.png?alt=media&token=2d552f7c-7a01-4441-811f-4b140da6dea6",
];
function UpdateProfileScreen({ navigation, route }) {
  const { user } = route.params;
  const [loading, setIsLoading] = React.useState(false);
  const [photo, onPhotoChange] = React.useState(user.photo);
  const [name, onChangeName] = React.useState(user.name);
  const [email, onChangeEmail] = React.useState(user.email);
  const [phone, onChangePhone] = React.useState(user.phone.toString());
  const [errorMessage, setErrorMessage] = React.useState("");
  const [checked, onChangeChecked] = React.useState(user.showPhone);

  if (photo == "") {
    onPhotoChange(images[Math.floor(Math.random() * images.length)]);
  }

  function changePhoto(value) {
    console.log("DOCE");
    onPhotoChange(value);
  }

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
      var mUser = {
        name: name,
        phone: parseInt(phone),
        photo: photo,
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
    } else {
      setIsLoading(false);
    }
  }
  /*
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
*/

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate("ProfilePhoto", { image: changePhoto });
        }}
      >
        <Image
          resizeMode="cover"
          style={styles.profileImage}
          source={{ uri: photo }}
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
    paddingTop: 10,
    alignItems: "center",
    height: "100%",
  },
});
export default UpdateProfileScreen;
