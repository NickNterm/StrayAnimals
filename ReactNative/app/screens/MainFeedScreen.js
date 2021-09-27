import React from "react";
import { StatusBar } from "react-native";
import { FlatList, View, RefreshControl } from "react-native";

import firebase from "../database/Firebase.js";
import PostItem from "../components/PostItem.js";

function MainFeedScreen({ navigation, route }) {
  const [postList, setPostList] = React.useState(route.params?.postList);
  const [refreshing, setRefreshing] = React.useState(false);

  var db = firebase.firestore();
  var curUser = firebase.auth().currentUser;
  var myUserId = curUser == null ? null : curUser.uid;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    db.collection("Posts")
      .limit(100)
      .orderBy("postedTime")
      .get()
      .then((querySnapshot) => {
        var nPostList = new Array();
        querySnapshot
          .docChanges()
          .reverse()
          .forEach((doc) => {
            var post = doc.doc.data();
            post.id = doc.doc.id;
            post.user = null;
            nPostList.push(post);
          });
        setPostList(nPostList);
        setRefreshing(false);
      })
      .catch((error) => {
        setRefreshing(false);
        console.log("Error getting documents: ", error);
      });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        marginTop: StatusBar.currentHeight,
      }}
    >
      <FlatList
        keyExtractor={(item) => item.id}
        data={postList}
        extraData={postList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item, index }) => (
          <PostItem
            key={index}
            item={item}
            currentUser={myUserId}
            navigation={navigation}
          />
        )}
      />
    </View>
  );
}

export default MainFeedScreen;
