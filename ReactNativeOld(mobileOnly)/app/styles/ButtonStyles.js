"use strict";
import { StyleSheet } from "react-native";

import colors from "../config/colors";

module.exports = StyleSheet.create({
  buttonFilled: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
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
