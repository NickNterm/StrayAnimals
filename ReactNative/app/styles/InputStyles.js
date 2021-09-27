"use strict";
import { StyleSheet } from "react-native";

import colors from "../config/colors";
var inputStyles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    width: "80%",
    marginBottom: 0,
    backgroundColor: colors.inputBackgoundGray,
    marginTop: 5,
    padding: 10,
    borderColor: 0,
    borderRadius: 5,
  },
});
export default inputStyles;
