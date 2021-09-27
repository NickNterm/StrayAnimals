import React from "react";
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  Image,
  AppRegistry,
  TouchableWithoutFeedback,
} from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import colors from "../config/colors";

function UploadScreen({ navigation }) {
  function continueUpload() {
    navigation.navigate("UploadDetails", { imageList: imageList });
  }

  const emptyList = [];
  const [imageList, setImageList] = React.useState(emptyList);
  const [showAddButton, setShowAddButton] = React.useState(true);
  const [showList, setShowList] = React.useState(false);

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
      list.push(result.uri);
      setImageList(list);
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
      {showList ? (
        <TouchableWithoutFeedback>
          <SliderBox
            dotColor={colors.primary}
            resizeMode="cover"
            style={styles.postImage}
            images={imageList}
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
        <TouchableWithoutFeedback onPress={pickImage}>
          <Image
            resizeMode="cover"
            style={styles.postImage}
            source={require("../assets/add_image.png")}
          />
        </TouchableWithoutFeedback>
      )}
      {showAddButton ? (
        <TouchableHighlight
          style={[
            { width: "90%", marginTop: 5, alignSelf: "center" },
            buttonStyle.buttonFilled,
          ]}
          underlayColor={colors.primaryHighlight}
          onPress={pickImage}
        >
          <Text style={buttonStyle.buttonFilledText}>Add Image</Text>
        </TouchableHighlight>
      ) : null}
      {imageList.length > 0 ? (
        <TouchableHighlight
          style={[
            { width: "90%", marginTop: 5, alignSelf: "center" },
            buttonStyle.buttonOutlined,
          ]}
          underlayColor={colors.outlineHighlight}
          onPress={() => {
            setImageList([]);
            setShowList(false);
          }}
        >
          <Text style={buttonStyle.buttonOutlinedText}>Remove Selection</Text>
        </TouchableHighlight>
      ) : null}
    </View>
  );
}
const buttonStyle = require("../styles/ButtonStyles");
const styles = StyleSheet.create({
  postImage: {
    height: undefined,
    width: "100%",
    aspectRatio: 4 / 5,
  },
});

export default UploadScreen;
