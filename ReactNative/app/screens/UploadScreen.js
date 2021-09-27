import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import colors from "../config/colors";
import MyButton from "../components/MyButton";
import { Dimensions } from "react-native";
import { Platform } from "react-native";

function UploadScreen({ navigation }) {
  function continueUpload() {
    navigation.navigate("UploadDetails", { imageList: imageList });
  }
  const [imageList, setImageList] = React.useState([]);
  const [showAddButton, setShowAddButton] = React.useState(true);
  const [showList, setShowList] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.cancelled) {
      const list = imageList;
      console.log(result.uri);
      list.push({ source: result.uri, id: imageList.length });
      setImageList(list);
      setRefresh(true);
      setRefresh(false);
      if (imageList.length > 0) {
        setShowList(true);
        navigation.setOptions({
          headerRight: (props) => (
            <Ionicons
              style={{ marginEnd: 10 }}
              name="arrow-forward"
              size={24}
              color={colors.linkBlue}
              onPress={continueUpload}
            />
          ),
        });
      }
      if (imageList.length > 9) {
        setShowAddButton(false);
      }
    }
  };

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <View>
        {showList ? (
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={imageList}
            extraData={refresh}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View>
                <Image
                  style={styles.imageView}
                  source={{
                    uri: item.source,
                  }}
                />
              </View>
            )}
          />
        ) : (
          <TouchableWithoutFeedback onPress={pickImage}>
            <Image
              resizeMode="cover"
              style={styles.postImage}
              source={require("../assets/add_image.png")}
            />
          </TouchableWithoutFeedback>
        )}
        {showAddButton ? (
          <MyButton
            type={"Filled"}
            text={"Add Image"}
            style={{ width: "90%", marginTop: 5, alignSelf: "center" }}
            onClick={pickImage}
          />
        ) : null}
        {imageList.length > 0 ? (
          <MyButton
            type={"Outlined"}
            text={"Remove Selection"}
            style={{ width: "90%", marginTop: 5, alignSelf: "center" }}
            onClick={() => {
              setImageList([]);
              setShowList(false);
            }}
          />
        ) : null}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  postImage: {
    height: undefined,
    width: "100%",
    aspectRatio: 4 / 5,
  },
  imageView: {
    height: undefined,
    width: 200,
    aspectRatio: 4 / 5,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
  },
});

export default UploadScreen;
