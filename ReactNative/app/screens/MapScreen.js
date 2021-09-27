import React from "react";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import MapView from "react-native-maps";
import RBSheet from "react-native-raw-bottom-sheet";
import firebase from "../database/Firebase.js";
import PostItem from "../components/PostItem.js";
function MapScreen({ navigation, route }) {
  const [postList, setPostList] = React.useState(route.params?.postList);
  const [mMap, setMap] = React.useState(null);
  const [post, setPostToShow] = React.useState(postList[0]);
  var curUser = firebase.auth().currentUser;
  var myUserId = curUser == null ? null : curUser.uid;
  var [bottomSheet, setBottomeSheet] = React.useState(null);
  var markerList = [];
  React.useEffect(() => {
    markerList = new Array();
    for (let i = 0; i < postList.length; i++) {
      markerList.push("mk" + i);
    }
  }, [mMap]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={(map) => {
          setMap(map);
        }}
        onMapReady={() => {
          mMap.fitToSuppliedMarkers(markerList, {
            edgePadding: { top: 200, right: 50, bottom: 50, left: 50 },
          });
        }}
      >
        {postList.map((marker, index) => (
          <MapView.Marker
            coordinate={{
              latitude: marker.location.latitude,
              longitude: marker.location.longitude,
            }}
            key={index}
            identifier={"mk" + index}
            onPress={() => {
              setPostToShow(postList[index]);
              bottomSheet.open();
            }}
          >
            <Image
              resizeMode={"contain"}
              source={
                marker.animal == "Dog"
                  ? require("../assets/dog_marker.png")
                  : require("../assets/cat_marker.png")
              }
              style={{
                height: 40,
              }}
            />
          </MapView.Marker>
        ))}
      </MapView>
      <RBSheet
        ref={(ref) => {
          setBottomeSheet(ref);
        }}
        height={700}
        openDuration={250}
        closeOnDragDown={true}
        customStyles={{
          container: {
            borderRadius: 10,
          },
        }}
      >
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <PostItem
            key={0}
            item={post}
            currentUser={myUserId}
            navigation={navigation}
            bottomSheet={bottomSheet}
          />
        </View>
      </RBSheet>
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
    height: Dimensions.get("window").height,
  },
  bottomButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  descriptionFooter: {
    marginHorizontal: 10,
  },
  like: {
    height: 30,
    width: 30,
  },
  postHeader: {
    marginStart: 10,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  postImage: {
    height: undefined,
    aspectRatio: 4 / 5,
  },
  profileImage: {
    marginEnd: 10,
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
  },
  profileName: { fontWeight: "bold" },
  underPhotoView: {
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",
    marginTop: 5,
    marginStart: 10,
  },
});
export default MapScreen;
