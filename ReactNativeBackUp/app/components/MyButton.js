import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  Text,
} from "react-native";

import colors from "../config/colors";

function MyButton(props) {
  var loading;
  if (props.loading == null) {
    loading = false;
  } else {
    loading = props.loading;
  }
  return props.type == "Filled" ? (
    <TouchableHighlight
      style={[props.style, style.buttonFilled]}
      underlayColor={colors.primaryHighlight}
      onPress={props.onClick}
    >
      {loading == true ? (
        <ActivityIndicator size={22} color="#fff" />
      ) : (
        <Text style={style.buttonFilledText}>{props.text}</Text>
      )}
    </TouchableHighlight>
  ) : (
    <TouchableHighlight
      style={[props.style, style.buttonOutlined]}
      underlayColor={colors.inputBackgoundGray}
      onPress={props.onClick}
    >
      {loading ? (
        <ActivityIndicator size={22} color="#fff" />
      ) : (
        <Text style={style.buttonOutlinedText}>{props.text}</Text>
      )}
    </TouchableHighlight>
  );
}
const style = StyleSheet.create({
  buttonFilled: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
    borderColor: 0,
  },
  buttonFilledText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  buttonOutlined: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonOutlinedText: {
    color: colors.primary,
    fontSize: 16,
    textAlign: "center",
  },
});

export default MyButton;
