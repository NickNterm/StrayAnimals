import 'package:flutter/material.dart';
import 'package:stray_animals/Components/Texts/NormalText.dart';
import 'package:stray_animals/Constants/colors.dart';

class StrokeButton extends StatelessWidget {
  const StrokeButton({
    Key? key,
    required this.width,
    required this.onPress,
    required this.text,
    this.color = kPrimaryColor,
    this.textColor = kPrimaryColor,
    this.stroke = 1.5,
  }) : super(key: key);

  final double width;
  final Function onPress;
  final String text;
  final double stroke;
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
          border: Border.all(color: color, width: stroke),
          borderRadius: BorderRadius.circular(10),
        ),
        child: NormalText(
          text: text.toUpperCase(),
          size: 17,
          color: kPrimaryColor,
        ),
      ),
    );
  }
}
