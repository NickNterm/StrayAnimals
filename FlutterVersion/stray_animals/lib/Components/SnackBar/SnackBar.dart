import 'package:flutter/material.dart';

void showErrorOnSnackbar(BuildContext context, String text) {
  var snackBar = SnackBar(
      content: Text(
    text,
    style: TextStyle(fontFamily: "Ubuntu"),
  ));
  ScaffoldMessenger.of(context).showSnackBar(snackBar);
}
