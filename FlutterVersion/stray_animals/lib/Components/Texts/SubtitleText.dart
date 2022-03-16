import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:stray_animals/Constants/colors.dart';

class SubtitleText extends StatelessWidget {
  const SubtitleText({
    Key? key,
    required this.text,
    this.size = 16,
    this.color = kSecondaryTextColor,
  }) : super(key: key);
  final String text;
  final double size;
  final Color color;
  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      textAlign: TextAlign.center,
      overflow: TextOverflow.ellipsis,
      style: GoogleFonts.ubuntu(
        textStyle: TextStyle(
          fontSize: size,
          fontStyle: FontStyle.italic,
          color: color,
        ),
      ),
    );
  }
}
