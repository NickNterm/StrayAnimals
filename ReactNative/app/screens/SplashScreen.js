import React, { useEffect } from "react";
import { Image, View, StyleSheet, Text, StatusBar } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../config/colors";
import firebase from "../database/Firebase.js";

function SplashScreen({ navigation }) {
  var db = firebase.firestore();
  var postList = Array();

  useEffect(() => {
    async function start() {
      try {
        const value = await AsyncStorage.getItem("ShowIntro");
        if (value !== null) {
          var removeListener = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
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
                  navigation.replace("MainScreen", {
                    postList: postList,
                    user: null,
                  });
                  removeListener();
                })
                .catch((error) => {
                  console.log("Error getting documents: ", error);
                });
            }
          });
        } else {
          navigation.replace("IntroScreen");
        }
      } catch (e) {
        console.log(e);
      }
    }
    start();
  }, []);

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
    width: 200,
    marginTop: 100,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.primary,
  },
});

export default SplashScreen;
