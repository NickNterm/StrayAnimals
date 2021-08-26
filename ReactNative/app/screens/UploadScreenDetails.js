import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import RadioGroup from "react-native-radio-buttons-group";

import colors from "../config/colors";
import MapView, { Marker } from "react-native-maps";

import firebase from "../database/Firebase.js";

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

const Item = ({ source }) => (
  <View>
    <Image
      style={styles.imageView}
      source={{
        uri: source,
      }}
    />
  </View>
);

function UploadScreenDetails({ route, navigation }) {
  const [animal, onChangeAnimal] = React.useState("Dog");
  const [description, onChangeDescription] = React.useState("");
  const [imageList, setImageList] = React.useState(route.params?.imageList);
  const [loading, setIsLoading] = React.useState(false);
  const [locationError, setLocationError] = React.useState(false);
  const lat = route.params?.lat;
  const long = route.params?.long;
  const latD = route.params?.latD;
  const longD = route.params?.longD;
  const locationString = typeof lat == "undefined" ? "" : lat + ", " + long;
  const [locationText, onChangeLocationText] = React.useState(locationString);

  const data = new Array();
  for (let i = 0; i < imageList.length; i++) {
    var obj = { source: imageList[i], id: i };
    data.push(obj);
  }
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
    navigation.navigate("SelectLocationMap");
  }

  function createPost() {
    if (typeof lat != "undefined" && !loading) {
      setIsLoading(true);
      var db = firebase.firestore();
      var URLimages = new Array();
      var upload = async (uri) => {
        var fileName = uri.split(".");
        const response = await fetch(uri);
        const blob = await response.blob();
        firebase
          .storage()
          .ref()
          .child(
            "POST_IMAGE_" + Date.now() + "." + fileName[fileName.length - 1]
          )
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
          .catch((error) => console.log(error));
      };

      for (let i = 0; i < imageList.length; i++) {
        upload(imageList[i]);
      }
    } else if (typeof lat == "undefined") {
      setLocationError(true);
    }
  }

  const renderItem = ({ item }) => <Item source={item.source} />;

  return (
    <View style={{ alignItems: "center" }}>
      <FlatList
        horizontal={true}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TextInput
        style={inputStyle.input}
        onChangeText={onChangeDescription}
        placeholder={"Description"}
        multiline={true}
        value={description}
      />
      <TextInput
        style={[
          inputStyle.input,
          locationError ? { backgroundColor: colors.errorRed } : null,
        ]}
        value={locationText}
        onChangeText={onChangeLocationText}
        placeholder={"Location"}
        onFocus={openSelectMap}
      />
      {typeof lat != "undefined" ? (
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
      <TouchableHighlight
        style={[
          { width: "90%", marginTop: 5, alignSelf: "center" },
          buttonStyle.buttonFilled,
        ]}
        underlayColor={colors.primaryHighlight}
        onPress={createPost}
      >
        <View>
          {loading ? (
            <ActivityIndicator size={22} color="#fff" />
          ) : (
            <Text style={buttonStyle.buttonFilledText}>Upload</Text>
          )}
        </View>
      </TouchableHighlight>
    </View>
  );
}
const buttonStyle = require("../styles/ButtonStyles");
const inputStyle = require("../styles/InputStyles");
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
