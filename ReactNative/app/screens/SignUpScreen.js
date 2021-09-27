import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import colors from "../config/colors";
import CheckBox from "react-native-check-box";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "../database/Firebase.js";
import InputStyles from "../styles/InputStyles";
import MyButton from "../components/MyButton";
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

  if (photo == "") {
    onPhotoChange(images[Math.floor(Math.random() * images.length)]);
  }
  function changePhoto(value) {
    console.log("DOCE");
    onPhotoChange(value);
  } /*
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
  };*/
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

  async function changeIntro() {
    try {
      await AsyncStorage.setItem("ShowIntro", "false");
      navigation.navigate("SplashScreen");
    } catch (e) {
      // saving error
    }
  }

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
              changeIntro();
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
    navigation.navigate("Terms");
  }

  return (
    <SafeAreaView style={styles.container}>
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
        autoCapitalize={"none"}
        onChangeText={onChangeEmail}
      />
      <TextInput
        style={InputStyles.input}
        value={phone}
        keyboardType="numeric"
        placeholder={"Phone"}
        onChangeText={onChangePhone}
      />
      <TextInput
        style={InputStyles.input}
        value={password}
        secureTextEntry={true}
        placeholder={"Password"}
        onChangeText={onChangePassword}
      />
      <TextInput
        style={InputStyles.input}
        value={repeat}
        secureTextEntry={true}
        placeholder={"Repeat"}
        onChangeText={onChangeRepeat}
      />

      <View
        style={{
          width: "80%",
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
      <MyButton
        type={"Filled"}
        text={"Sign Up"}
        style={{ width: "80%" }}
        onClick={signUp}
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
    </SafeAreaView>
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
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 10,
    height: "100%",
  },
});

export default SignUpScreen;
