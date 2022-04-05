import "package:flutter/material.dart";
import 'package:flutter_spinkit/flutter_spinkit.dart';
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
    this.loading = false,
  }) : super(key: key);

  final double width;
  final Function onPress;
  final String text;
  final Color color;
  final Color textColor;
  final bool loading;
  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(10),
      child: Material(
        child: Ink(
          color: color,
          width: width,
          child: InkWell(
            onTap: () {
              if (!loading) {
                onPress();
              }
            },
            child: Padding(
              padding: const EdgeInsets.only(top: 10, bottom: 10),
              child: loading
                  ? SpinKitRing(
                      color: Colors.white,
                      lineWidth: 3,
                      size: 21,
                    )
                  : NormalText(
                      text: text.toUpperCase(),
                      size: 17,
                      color: Colors.white,
                    ),
            ),
          ),
        ),
      ),
    );
  }
}
