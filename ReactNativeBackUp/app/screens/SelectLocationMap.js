import React from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import MapView from "react-native-maps";
import MyButton from "../components/MyButton";
import colors from "../config/colors";
function SelectLocationMap({ navigation }) {
  var mMap = null;
  function selectLocation() {
    try {
      navigation.navigate("UploadDetails", {
        lat: mMap.__lastRegion.latitude,
        long: mMap.__lastRegion.longitude,
        latD: mMap.__lastRegion.latitudeDelta,
        longD: mMap.__lastRegion.longitudeDelta,
      });
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <View style={styles.container}>
      <MapView
        mapType="hybrid"
        style={styles.map}
        ref={(map) => {
          mMap = map;
        }}
      />
      <Image
        resizeMode="contain"
        source={require("../assets/marker.png")}
        style={{
          flex: 1,
          width: 30,
          position: "absolute",
        }}
      />
      <MyButton
        type={"Filled"}
        text={"Select"}
        style={{
          width: "90%",
          marginTop: 5,
          alignSelf: "center",
          position: "absolute",
          bottom: 10,
        }}
        onClick={selectLocation}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
});
export default SelectLocationMap;
