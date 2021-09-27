import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import { StatusBar } from "react-native";
import { Platform } from "react-native";
import { TouchableHighlight } from "react-native";
import colors from "../config/colors";

const slidesEN = [
  {
    key: "one",
    title: "Welcome",
    text: "Let's transform our society in a place where\nanimals will be treated with care\n\nThis app is all about helping stray animals",
    image: require("../assets/ProfilePhotos/fox.png"),
    backgroundColor: "#62a5a2",
  },
  {
    key: "two",
    title: "Why this is useful?",
    text: "This is useful for everyone who loves Stray Animals\nand wants to help them\n\nYou can post, share, like photos of stray animals\nin your area so everyone who cares can give them treats",
    image: require("../assets/ProfilePhotos/dog.png"),
    backgroundColor: "#f0592b",
  },
  {
    key: "three",
    title: "How to use",
    text: "Using the app is pretty simple\n\nDouble tap for like ❤️\nClick the pin to see the location 📍\nAnd don't forget to share ✉️",
    image: require("../assets/ProfilePhotos/monkey.png"),
    backgroundColor: "#185787",
  },
  {
    key: "three",
    title: "How to upload",
    text: "Upload up to 9 photos in every post 👀\nGive a short description 📝\nAdd the location of the animal 🗺️",
    image: require("../assets/ProfilePhotos/cat.png"),
    backgroundColor: "#62a5a2",
  },
  {
    key: "four",
    title: "Finish",
    text: "You can unlock more features if you\nSign Up or Sign In",
    image: require("../assets/ProfilePhotos/squirrel.png"),
    backgroundColor: "#f0592b",
  },
];
const slidesGR = [
  {
    key: "one",
    title: "Καλωσορίσατε",
    text: "Ας μεταμορφώσουμε την κοινωνία μας\nσε ένα μέρος οπού όλα τα αδέσποτα έχουν ενα σπίτι",
    image: require("../assets/ProfilePhotos/fox.png"),
    backgroundColor: "#62a5a2",
  },
  {
    key: "two",
    title: "Σε τι χρησιμέυει;",
    text: "Αυτή η εφαρμογή είναι χρήσιμη για όλους όσους αγαπούν\nτα αδέσποτα ζώα και θέλουν να τα βοηθήσουν.\nΜπορείτε να δημοσιεύσετε, να μοιραστείτε\nκαι να ανεβάσετε φωτογραφίες αδέσποτων ζώων\nστην περιοχή σας, ώστε όλοι όσοι νοιάζονται\nνα μπορούν να τους προσφέρουν βοήθεια",
    image: require("../assets/ProfilePhotos/dog.png"),
    backgroundColor: "#f0592b",
  },
  {
    key: "three",
    title: "Πως λειτουργεί;",
    text: "Η χρήση της εφαρμογής είναι αρκετά απλή\nΠατήστε δύο φορές για like ❤️\nΚάντε κλικ στο pin για να δείτε την τοποθεσία 📍\nΚαι μην ξεχάσετε να μοιραστείτε τις δημοσιεύσεις ✉️",
    image: require("../assets/ProfilePhotos/monkey.png"),
    backgroundColor: "#185787",
  },
  {
    key: "three",
    title: "Πως δημοσιεύω μια φωτογραφία",
    text: "Ανεβάστε έως και 9 φωτογραφίες σε κάθε ανάρτηση 👀\nΓράψτε μια σύντομη περιγραφή 📝\nΠροσθέστε τη θέση του ζώου 🗺️",
    image: require("../assets/ProfilePhotos/cat.png"),
    backgroundColor: "#62a5a2",
  },
  {
    key: "four",
    title: "Τέλος",
    text: "Μπορείτε να ξεκλειδώσετε περισσότερες δυνατότητες εάν\nΕγγραφείτε ή συνδεθείτε",
    image: require("../assets/ProfilePhotos/squirrel.png"),
    backgroundColor: "#f0592b",
  },
];
if (Platform.OS === "web") {
  const queryParams = new URLSearchParams(window.location.search);
  var lang = queryParams.get("language");
}
const slides = lang == "GR" ? slidesGR : slidesEN;

function IntroScreen({ navigation }) {
  async function done() {
    try {
      await AsyncStorage.setItem("ShowIntro", "false");
      navigation.navigate("SplashScreen");
    } catch (e) {
      // saving error
    }
  }

  return (
    <AppIntroSlider
      style={{ flex: 1 }}
      scrollEnabled={Platform.OS !== "web"}
      dotStyle={{ backgroundColor: "#d4d4d4" }}
      activeDotStyle={{ backgroundColor: "#545454" }}
      renderItem={({ item, index }) => (
        <View
          style={{
            height:
              Dimensions.get("window").height +
              (Platform.OS != "web" ? StatusBar.currentHeight : null),
            backgroundColor: item.backgroundColor,
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 100,
          }}
        >
          <Image
            style={styles.introImageStyle}
            resizeMode="contain"
            source={item.image}
          />
          <Text style={styles.introTitleStyle}>{item.title}</Text>
          <Text style={styles.introTextStyle}>{item.text}</Text>
          {item.key == "four" ? (
            <View style={{ width: "100%", alignItems: "center" }}>
              <TouchableHighlight
                style={styles.buttonFilled}
                underlayColor={colors.primaryHighlight}
                onPress={() => navigation.navigate("SignIn")}
              >
                <Text style={styles.buttonFilledText}>
                  {lang == "GR" ? "Σύνδεση" : "Sign In"}
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.buttonOutlined}
                underlayColor={"#e0714f"}
                onPress={() => navigation.navigate("SignUp")}
              >
                <Text style={styles.buttonOutlinedText}>
                  {lang == "GR" ? "Εγγραφή" : "Sign Up"}
                </Text>
              </TouchableHighlight>
            </View>
          ) : null}
        </View>
      )}
      data={slides}
      onDone={done}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
  },
  titleStyle: {
    padding: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  paragraphStyle: {
    padding: 20,
    textAlign: "center",
    fontSize: 16,
  },
  introImageStyle: {
    width: 200,
    height: 200,
  },
  introTextStyle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    paddingVertical: 10,
  },
  introTitleStyle: {
    fontSize: 25,
    color: "#fff",
    textAlign: "center",
    margin: 16,
    fontWeight: "bold",
  },
  buttonFilled: {
    width: "70%",
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#e0dcd3ff",
    borderRadius: 5,
    borderColor: 0,
  },
  buttonFilledText: {
    color: "#6b6b6b",
    fontSize: 16,
    textAlign: "center",
  },
  buttonOutlined: {
    margin: 10,
    width: "70%",
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e0dcd3ff",
  },
  buttonOutlinedText: {
    color: "#e0dcd3ff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default IntroScreen;
