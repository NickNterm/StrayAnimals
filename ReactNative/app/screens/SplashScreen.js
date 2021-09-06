import React from "react";
import { Image, View, StyleSheet, Text, StatusBar } from "react-native";

import colors from "../config/colors";

import firebase from "../database/Firebase.js";

function SplashScreen({ navigation }) {
  var db = firebase.firestore();
  var postList = Array();
  setTimeout(function () {
    var removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.isAnonymous) {
          db.collection("Posts")
            .limit(100)
            .orderBy("postedTime")
            .get()
            .then((querySnapshot) => {
              querySnapshot
                .docChanges()
                .reverse()
                .forEach((doc) => {
                  var post = doc.doc.data();
                  post.id = doc.doc.id;
                  postList.push(post);
                });
              navigation.replace("MainScreen", {
                postList: postList,
                user: null,
              });
              removeListener();
            })
            .catch((error) => {
              console.log("Error getting documents: ", error);
            });
        } else {
          db.collection("Posts")
            .limit(100)
            .orderBy("postedTime")
            .get()
            .then((querySnapshot) => {
              querySnapshot
                .docChanges()
                .reverse()
                .forEach((doc) => {
                  var post = doc.doc.data();
                  post.id = doc.doc.id;
                  postList.push(post);
                });
              db.collection("Users")
                .doc(user.uid)
                .get()
                .then((mUser) => {
                  navigation.replace("MainScreen", {
                    postList: postList,
                    user: mUser.data(),
                  });
                  removeListener();
                });
            })
            .catch((error) => {
              console.log("Error getting documents: ", error);
            });
        }
      } else {
        navigation.replace("IntroScreen");
        removeListener();
      }
    });
  }, 1000);

  return (
    <View style={styles.mainView}>
      <Image
        resizeMode="contain"
        style={styles.image}
        source={require("../assets/dog_outline.png")}
      />
      <Text style={styles.title}>StrayAnimals</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  image: {
    height: 180,
    position: "absolute",
    top: StatusBar.currentHeight + 50,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.primary,
    top: 180 + 50 + StatusBar.currentHeight + 10,
  },
});

export default SplashScreen;
