import 'package:flutter/material.dart';

class ExtraInformationObject {
  TextField titleField;
  TextEditingController titleController;
  TextField valueField;
  TextEditingController valueController;
  ExtraInformationObject(
    this.titleField,
    this.titleController,
    this.valueField,
    this.valueController,
  );
}
