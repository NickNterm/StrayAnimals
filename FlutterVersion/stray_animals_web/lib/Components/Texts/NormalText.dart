import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:stray_animals/Constants/colors.dart';

class NormalText extends StatelessWidget {
  const NormalText({
    Key? key,
    required this.text,
    this.size = 16,
    this.color = kTextColor,
  }) : super(key: key);
  final String text;
  final double size;
  final Color color;
  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      textAlign: TextAlign.center,
      style: GoogleFonts.ubuntu(
          textStyle: TextStyle(fontSize: size, color: color)),
    );
  }
}
