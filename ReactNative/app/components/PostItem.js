import React, { useRef } from "react";

import {
  Image,
  Text,
  View,
  TouchableWithoutFeedback,
  Animated,
  Share,
  StyleSheet,
} from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import { EvilIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { Clipboard } from "react-native";
import Swiper from "react-native-web-swiper";
var SliderBox;

import colors from "../config/colors";

import firebase from "../database/Firebase.js";
import { Platform } from "react-native";
import { Dimensions } from "react-native";
if (Platform.OS !== "web") {
  SliderBox = require("react-native-image-slider-box").SliderBox;
}
function PostItem(props) {
  const { item, currentUser, navigation, bottomSheet } = props;
  const [showAlert, setAlert] = React.useState(false);
  const [like, setLiked] = React.useState(
    item.likeIdList.includes(currentUser)
  );
  const [user, setUser] = React.useState(null);
  var db = firebase.firestore();
  if (user == null) {
    db.collection("Users")
      .doc(item.createdBy)
      .get()
      .then((doc) => {
        setUser(doc.data());
      });
  }
  if (currentUser == null) {
  }

  const animationValue = useRef(new Animated.Value(1)).current;
  const scaleAnimation = () => {
    if (currentUser != null) {
      Animated.timing(animationValue, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        console.log("likelist " + item.likeIdList.includes(currentUser));
        console.log("like " + like);
        if (!like && !item.likeIdList.includes(currentUser)) {
          item.likeIdList.push(currentUser);
          db.collection("Posts")
            .doc(item.id)
            .update({ likeIdList: item.likeIdList });
        } else if (like && item.likeIdList.includes(currentUser)) {
          item.likeIdList.splice(item.likeIdList.indexOf(currentUser), 1);
          db.collection("Posts")
            .doc(item.id)
            .update({ likeIdList: item.likeIdList });
        } else {
          console.log("ELSE");
        }
        setLiked(!like);
        Animated.timing(animationValue, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(animationValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        });
      });
    }
  };

  function showLocation() {
    if (Platform.OS !== "web") {
      if (bottomSheet != null) {
        bottomSheet.close();
      }
      navigation.navigate("ShowLocation", {
        lat: item.location.latitude,
        long: item.location.longitude,
      });
    } else {
      window.open(
        "http://maps.google.com/maps?z=12&t=m&q=loc:" +
          item.location.latitude +
          "+" +
          item.location.longitude,
        "_blank"
      );
    }
  }

  var backCount = 0;
  var backTimer = null;
  function clearTimeout(timer) {
    timer = null;
  }

  function showAccount() {
    if (bottomSheet != null) {
      bottomSheet.close();
    }
    navigation.navigate("ShowAccount", { user: user });
  }
  function postTimeInText(millisec) {
    var dif = Date.now() - millisec;
    var result = "";
    if (dif < 1000 * 60) {
      var val = parseInt(dif / 1000);
      if (val == 1) {
        result = parseInt(dif / 1000) + " second ago";
      } else {
        result = parseInt(dif / 1000) + " seconds ago";
      }
    } else if (dif < 1000 * 60 * 60) {
      var val = parseInt(dif / (1000 * 60));
      if (val == 1) {
        result = parseInt(dif / (1000 * 60)) + " minute ago";
      } else {
        result = parseInt(dif / (1000 * 60)) + " minutes ago";
      }
    } else if (dif < 1000 * 60 * 60 * 24) {
      var val = parseInt(dif / (1000 * 60 * 60));
      if (val == 1) {
        result = parseInt(dif / (1000 * 60 * 60)) + " hour ago";
      } else {
        result = parseInt(dif / (1000 * 60 * 60)) + " hours ago";
      }
    } else if (dif < 1000 * 60 * 60 * 24 * 6) {
      var val = parseInt(dif / (1000 * 60 * 60 * 24));
      if (val == 1) {
        result = parseInt(dif / (1000 * 60 * 60 * 24)) + " day ago";
      } else {
        result = parseInt(dif / (1000 * 60 * 60 * 24)) + " days ago";
      }
    } else {
      var formattedDate = format(new Date(millisec), "MMMM d, yyyy");
      result = formattedDate;
    }
    return result;
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "strayanimalsapp.web.app/post/" + item.id,
      });
    } catch (error) {}
  };
  return (
    <View>
      <TouchableWithoutFeedback onPress={showAccount}>
        <View style={styles.postHeader}>
          <Image
            style={styles.profileImage}
            source={
              user == null || user.photo == ""
                ? require("../assets/accountPlaceholder.png")
                : { uri: user.photo }
            }
          />
          <Text style={styles.profileName}>
            {user == null ? "Name" : user.name}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      {Platform.OS !== "web" ? (
        <TouchableWithoutFeedback
          onPress={() => {
            backCount++;
            if (backCount == 2) {
              clearTimeout(backTimer);
              scaleAnimation();
            } else {
              backTimer = setTimeout(() => {
                backCount = 0;
              }, 300);
            }
          }}
        >
          <SliderBox
            resizeMode="cover"
            cache="force-cache"
            dotColor={colors.primary}
            imageLoadingColor={colors.primary}
            style={styles.postImage}
            images={item.image}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 3,
              marginHorizontal: 0,
              padding: 0,
              margin: 0,
            }}
          />
        </TouchableWithoutFeedback>
      ) : (
        <View style={{ aspectRatio: 4 / 5 }}>
          <Swiper
            minDistanceForAction={0.1}
            controlsProps={{
              dotsTouchable: true,
              nextTitleStyle: {
                position: "absolute",
                top: Dimensions.get("window").height,
                bottom: -Dimensions.get("window").height,
              },
              dotActiveStyle: { backgroundColor: colors.primary },
              prevTitleStyle: {
                position: "absolute",
                top: Dimensions.get("window").height,
                bottom: -Dimensions.get("window").height,
              },
            }}
            controlsEnabled={item.image.length > 1}
          >
            {item.image.map((image) => (
              <Image
                resizeMode="cover"
                style={styles.postImage}
                source={{ uri: image, cache: "force-cache" }}
              />
            ))}
          </Swiper>
        </View>
        /*  <Image
            resizeMode="cover"
            style={styles.postImage}
            source={{ uri: item.image[0], cache: "force-cache" }}
          />*/
      )}

      <View style={styles.underPhotoView}>
        {currentUser != null ? (
          <TouchableWithoutFeedback onPress={scaleAnimation}>
            <Animated.View
              style={{
                transform: [{ scale: animationValue }],
                marginStart: 10,
              }}
            >
              <Image
                resizeMode="contain"
                style={styles.like}
                source={
                  like
                    ? require("../assets/dog_paw_filled.png")
                    : require("../assets/dog_paw_outline.png")
                }
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        ) : null}
        {Platform.OS !== "web" ? (
          <TouchableWithoutFeedback onPress={onShare}>
            <EvilIcons
              name="share-google"
              color={"#000"}
              size={36}
              style={{ marginStart: 5 }}
            />
          </TouchableWithoutFeedback>
        ) : (
          <TouchableWithoutFeedback
            onPress={() => {
              Clipboard.setString("strayanimalsapp.web.app/?post=" + item.id);
              setAlert(true);
            }}
          >
            <EvilIcons
              name="share-google"
              color={"#000"}
              size={36}
              style={{ marginStart: 5 }}
            />
          </TouchableWithoutFeedback>
        )}
        <View style={styles.bottomButtons}>
          <TouchableWithoutFeedback onPress={showLocation}>
            <EvilIcons name="location" color={"#000"} size={36} />
          </TouchableWithoutFeedback>
        </View>
      </View>
      <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
        Likes: {item.likeIdList.length}
      </Text>
      {item.description != "" ? (
        <View style={styles.descriptionFooter}>
          <Text>{item.description}</Text>
        </View>
      ) : null}

      <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
        <Text style={{ fontSize: 12, color: colors.textGray }}>
          {postTimeInText(item.postedTime)}
        </Text>
      </View>
      <AwesomeAlert
        show={showAlert}
        title="Copied to ClipBoard"
        message={"strayanimalsapp.web.app/?post=" + item.id}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showConfirmButton={true}
        confirmText="Thanks!"
        confirmButtonColor={colors.primary}
        onCancelPressed={() => {
          setAlert(false);
        }}
        onConfirmPressed={() => {
          setAlert(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    justifyContent: "flex-start",
    flexDirection: "row",
    marginTop: 5,
  },
});

export default PostItem;
