import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import PostItem from "../components/PostItem";
import firebase from "../database/Firebase.js";

function ShowPost({ navigation, route }) {
  const { postID, user } = route.params;
  const [post, setPost] = useState(null);
  const [errorMessage, seterrorMessage] = useState(null);
  var db = firebase.firestore();
  useEffect(() => {
    db.collection("Posts")
      .doc(postID)
      .get()
      .then((doc) => {
        var post = doc.data();
        post.id = doc.id;
        setPost(post);
      })
      .catch((error) => {
        console.log(error);
        seterrorMessage("This post Dont exist ):");
      });
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {post != null ? (
        <PostItem item={post} currentUser={user} navigation={navigation} />
      ) : (
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 30,
          }}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
}

export default ShowPost;
