import "package:flutter/material.dart";
import 'package:stray_animals/Components/Texts/NormalText.dart';
import 'package:stray_animals/Constants/colors.dart';

class FilledButton extends StatelessWidget {
  const FilledButton({
    Key? key,
    required this.width,
    required this.onPress,
    required this.text,
    this.color = kPrimaryColor,
    this.textColor = Colors.white,
  }) : super(key: key);

  final double width;
  final Function onPress;
  final String text;
  final Color color;
  final Color textColor;
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        onPress();
      },
      child: Container(
        width: width,
        padding: const EdgeInsets.only(top: 10, bottom: 10),
        decoration: BoxDecoration(
            border: Border.all(color: color, width: 1.5),
            borderRadius: BorderRadius.circular(10),
            color: color),
        child: NormalText(
          text: text.toUpperCase(),
          size: 17,
          color: Colors.white,
        ),
      ),
    );
  }
}
