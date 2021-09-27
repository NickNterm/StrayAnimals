import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableHighlight,
  Text,
} from "react-native";
import MapView from "react-native-maps";
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
      <TouchableHighlight
        style={[
          {
            width: "90%",
            marginTop: 5,
            alignSelf: "center",
            position: "absolute",
            bottom: 10,
          },
          buttonStyle.buttonFilled,
        ]}
        underlayColor={colors.primaryHighlight}
        onPress={selectLocation}
      >
        <Text style={buttonStyle.buttonFilledText}>Select</Text>
      </TouchableHighlight>
    </View>
  );
}
const buttonStyle = require("../styles/ButtonStyles");
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
