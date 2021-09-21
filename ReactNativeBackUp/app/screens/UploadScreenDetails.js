import React from "react";
import { View, StyleSheet, TextInput, FlatList, Image } from "react-native";
import RadioGroup from "react-native-radio-buttons-group";

import colors from "../config/colors";
let MapView, Marker;
if (Platform.OS !== "web") {
  MapView = require("react-native-maps").default;
  Marker = require("react-native-maps").default.Marker;
}
import firebase from "../database/Firebase.js";
import MyButton from "../components/MyButton";
import InputStyles from "../styles/InputStyles";
import { Platform } from "react-native";
import { Text } from "react-native";

const radioButtonsData = [
  {
    id: "1", // acts as primary key, should be unique and non-empty string
    label: "Dog",
    value: "Dog",
    selected: true,
  },
  {
    id: "2",
    label: "Cat",
    value: "Cat",
  },
];

function UploadScreenDetails({ route, navigation }) {
  const [animal, onChangeAnimal] = React.useState("Dog");
  const [description, onChangeDescription] = React.useState("");
  const [imageList, setImageList] = React.useState(route.params?.imageList);
  const [loading, setIsLoading] = React.useState(false);
  const [locationError, setLocationError] = React.useState(false);
  var lat = route.params?.lat;
  var long = route.params?.long;
  const locationString = typeof lat == "undefined" ? "" : lat + ", " + long;
  const [locationText, onChangeLocationText] = React.useState(locationString);

  const [radioButtons, setRadioButtons] = React.useState(radioButtonsData);

  function onPressRadioButton(radioButtonsArray) {
    setRadioButtons(radioButtonsArray);
  }

  React.useEffect(() => {
    if (typeof lat != "undefined") {
      setLocationError(false);
      onChangeLocationText(locationString);
    }
    let selectedItem = radioButtons.find((e) => e.selected == true);
    onChangeAnimal(selectedItem ? selectedItem.value : radioButtons[0].value);
  });

  function openSelectMap() {
    if (Platform.OS !== "web") {
      navigation.navigate("SelectLocationMap");
    }
  }

  function createPost() {
    if (Platform.OS === "web") {
      var latLong = locationText.split(",");
      if (latLong.length == 2) {
        lat = parseFloat(latLong[0]);
        long = parseFloat(latLong[1]);
      } else {
        setLocationError(true);
        setIsLoading(false);
      }
    }
    if (typeof lat != "undefined" && !loading) {
      setIsLoading(true);
      var db = firebase.firestore();
      var URLimages = new Array();
      var upload = async (uri) => {
        let fileName;
        if (Platform.OS === "web") {
          fileName = uri.split(";")[0];
          fileName = fileName.split("/")[1];
        } else {
          fileName = uri.split(".");
          fileName = fileName[fileName.length - 1];
        }
        const response = await fetch(uri);
        const blob = await response.blob();
        firebase
          .storage()
          .ref()
          .child("POST_IMAGE_" + Date.now() + "." + fileName)
          .put(blob)
          .then((snapshot) => {
            snapshot.ref.getDownloadURL().then((downloadURL) => {
              URLimages.push(downloadURL);
              if (URLimages.length == imageList.length) {
                var post = {
                  id: "",
                  animal: animal,
                  createdBy: firebase.auth().currentUser.uid,
                  description: description,
                  found: 1,
                  lost: 0,
                  image: URLimages,
                  likeIdList: [],
                  location: {
                    latitude: lat,
                    longitude: long,
                  },
                  postedTime: Date.now(),
                  rated: 0,
                };

                db.collection("Posts")
                  .doc()
                  .set(post)
                  .then((data) => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "SplashScreen" }],
                    });
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            });
          })
          .catch((error) => {
            console.log(error);
            setIsLoading(false);
          });
      };

      for (let i = 0; i < imageList.length; i++) {
        upload(imageList[i].source);
      }
    } else if (typeof lat == "undefined") {
      setLocationError(true);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ alignItems: "center" }}>
        <FlatList
          horizontal={true}
          data={imageList}
          renderItem={({ item }) => (
            <View>
              <Image
                style={styles.imageView}
                source={{
                  uri: item.source,
                }}
              />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
        <TextInput
          style={[InputStyles.input, { width: "90%" }]}
          onChangeText={onChangeDescription}
          placeholder={"Description"}
          multiline={true}
          value={description}
        />
        <TextInput
          style={[
            InputStyles.input,
            { width: "90%" },
            locationError ? { backgroundColor: colors.errorRed } : null,
          ]}
          value={locationText}
          onChangeText={onChangeLocationText}
          placeholder={"Location"}
          onFocus={openSelectMap}
        />
        {Platform.OS === "web" ? (
          <Text
            style={{
              textAlign: "center",
              borderRadius: 5,
              marginTop: 5,
              margingBottom: 10,
              color: "#2e2e2e",
              paddingVertical: 5,
              backgroundColor: colors.inputBackgoundGray,
              width: "90%",
            }}
          >
            Info: Import the location in the form: lat, log{"\n"}Example:
            37.419857, -122.078827
          </Text>
        ) : null}
        {typeof lat != "undefined" && Platform.OS !== "web" ? (
          <View
            style={{
              width: "90%",
              marginTop: 5,
              overflow: "hidden",
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <MapView
              mapType="satellite"
              style={{
                width: "100%",
                height: 250,
              }}
              region={{
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.006,
                longitudeDelta: 0.006,
              }}
              pitchEnabled={false}
              rotateEnabled={false}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker coordinate={{ latitude: lat, longitude: long }}>
                <Image
                  resizeMode="contain"
                  source={require("../assets/marker.png")}
                  style={{
                    width: 26,
                    height: 28,
                  }}
                />
              </Marker>
            </MapView>
          </View>
        ) : null}

        <View
          style={{
            alignSelf: "center",
            alignItems: "flex-start",
            width: "90%",
            margin: 10,
            padding: 10,
            borderColor: colors.elementBackgroundDark,
            borderRadius: 5,
            borderWidth: 1,
          }}
        >
          <RadioGroup
            radioButtons={radioButtons}
            onPress={onPressRadioButton}
            layout="column"
          />
        </View>
        <MyButton
          type={"Filled"}
          text={"Upload"}
          style={{ width: "90%", marginTop: 5, alignSelf: "center" }}
          onClick={createPost}
          loading={loading}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  imageView: {
    height: undefined,
    width: 120,
    aspectRatio: 4 / 5,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
});

export default UploadScreenDetails;
