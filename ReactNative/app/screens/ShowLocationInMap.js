import React from "react";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
function ShowLocationInMap({ route }) {
  const lat = route.params?.lat;
  const long = route.params?.long;

  return (
    <View style={styles.container}>
      <MapView
        mapType="hybrid"
        style={styles.map}
        initialRegion={{
          latitude: lat,
          longitude: long,
          latitudeDelta: 0.006,
          longitudeDelta: 0.006,
        }}
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
    width: "100%",
    height: Dimensions.get("window").height,
  },
});
export default ShowLocationInMap;
