import React, { useRef } from "react";

import {
  Image,
  Text,
  View,
  TouchableWithoutFeedback,
  Animated,
  Share,
  TouchableNativeFeedback,
  StyleSheet,
} from "react-native";

import { EvilIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { SliderBox } from "react-native-image-slider-box";

import colors from "../config/colors";

import firebase from "../database/Firebase.js";

function PostItem(props) {
  const { item, currentUser, navigation, bottomSheet } = props;
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
    if (bottomSheet != null) {
      bottomSheet.close();
    }
    navigation.navigate("ShowLocation", {
      lat: item.location.latitude,
      long: item.location.longitude,
    });
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
          dotColor={colors.primary}
          resizeMode="cover"
          style={styles.postImage}
          images={item.image}
          autoplay
          circleLoop
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

        <TouchableNativeFeedback onPress={onShare}>
          <EvilIcons
            name="share-google"
            color={"#000"}
            size={36}
            style={{ marginStart: 5 }}
          />
        </TouchableNativeFeedback>
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
    justifyContent: "flex-start",
    flexDirection: "row",
    marginTop: 5,
  },
});

export default PostItem;
