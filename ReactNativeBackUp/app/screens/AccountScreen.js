import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  RefreshControl,
  TouchableHighlight,
  Alert,
} from "react-native";

import { Feather } from "@expo/vector-icons";

import colors from "../config/colors";

import firebase from "../database/Firebase.js";
import PostItem from "../components/PostItem";

function AccountScreen({ navigation, route }) {
  const [mUser, setUser] = React.useState(route.params?.user);
  const [userPostList, setUserPostList] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  var db = firebase.firestore();
  function updatePostList() {
    db.collection("Posts")
      .where("createdBy", "==", mUser.id)
      .get()
      .then((querySnapshot) => {
        var mPostList = new Array();
        querySnapshot
          .docChanges()
          .reverse()
          .forEach((doc) => {
            var post = doc.doc.data();
            post.id = doc.doc.id;
            mPostList.push(post);
          });
        setUserPostList(mPostList);
      });
  }
  React.useEffect(() => {
    updatePostList();
    if (firebase.auth().currentUser != null) {
      if (mUser.id == firebase.auth().currentUser.uid) {
        navigation.setOptions({
          headerRight: (props) => (
            <Feather
              name="settings"
              size={24}
              color="black"
              style={{ marginEnd: 15 }}
              onPress={() => {
                navigation.navigate("Settings", { mUser: mUser });
              }}
            />
          ),
        });
      }
    }
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    db.collection("Posts")
      .where("createdBy", "==", mUser.id)
      .get()
      .then((querySnapshot) => {
        var mPostList = new Array();
        querySnapshot
          .docChanges()
          .reverse()
          .forEach((doc) => {
            var post = doc.doc.data();
            post.id = doc.doc.id;
            mPostList.push(post);
          });
        setUserPostList(mPostList);
        db.collection("Users")
          .doc(mUser.id)
          .get()
          .then((doc) => setUser(doc.data()));
        setRefreshing(false);
      });
  });
  return (
    <View style={{ height: "100%", backgroundColor: "#fff" }}>
      <View style={{ padding: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            marginBottom: 10,
          }}
        >
          <Image
            source={
              mUser == null || mUser.photo == ""
                ? require("../assets/accountPlaceholder.png")
                : { uri: mUser.photo }
            }
            style={styles.accountImage}
          />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Posts: {userPostList.length}
            </Text>
          </View>
        </View>
        <Text>Name: {mUser.name}</Text>
        <Text>Email: {mUser.email}</Text>
        {mUser.showPhone ? <Text>Phone: {mUser.phone}</Text> : null}
      </View>
      {userPostList.length != 0 ? (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={{ flex: 1 }}
          data={userPostList}
          extraData={userPostList}
          renderItem={({ item, index }) => (
            <PostItem
              key={index}
              item={item}
              currentUser={
                firebase.auth().currentUser == null
                  ? null
                  : firebase.auth().currentUser.uid
              }
              navigation={navigation}
            />
          )}
        />
      ) : (
        <View
          style={{
            alignItems: "center",
            flex: 1,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              alignContent: "center",
              width: "100%",
              fontWeight: "bold",
              fontSize: 30,
            }}
          >
            No post found
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  accountImage: {
    marginEnd: 10,
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
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

export default AccountScreen;
