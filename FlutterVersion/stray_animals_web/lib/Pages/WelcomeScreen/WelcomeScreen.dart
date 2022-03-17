import 'package:flutter/material.dart';
import 'package:stray_animals/Components/Buttons/FilledButton.dart';
import 'package:stray_animals/Components/Buttons/StrokeButton.dart';
import 'package:stray_animals/Components/Texts/BoldText.dart';
import 'package:stray_animals/Components/Texts/SubtitleText.dart';
import 'package:stray_animals/Constants/size.dart';
import 'package:stray_animals/Pages/SignInScreen/SignInScreen.dart';
import 'package:stray_animals/Pages/SignUpScreen/SignUpScreen.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Container(
            constraints: BoxConstraints(
              maxWidth: maxWidth,
            ),
            child: Padding(
              padding: const EdgeInsets.all(30),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Image.asset(
                    "assets/images/animal-shelter.png",
                  ),
                  const SizedBox(
                    height: 30,
                  ),
                  Expanded(
                    child: Column(
                      children: const [
                        BoldText(
                            text:
                                "This app is all about\nhelping stray animals",
                            size: 25),
                        SizedBox(
                          height: 10,
                        ),
                        SubtitleText(
                            text:
                                "Let's transform our society\nin a place where animals will\nbe treated with care"),
                      ],
                    ),
                  ),
                  FilledButton(
                    text: "Sign In",
                    width: size.width,
                    onPress: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const SignInScreen(),
                        ),
                      );
                    },
                  ),
                  const SizedBox(
                    height: 10,
                  ),
                  StrokeButton(
                    text: "Sign Up",
                    width: size.width,
                    onPress: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const SignUpScreen(),
                        ),
                      );
                    },
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
