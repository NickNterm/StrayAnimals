import 'dart:math';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:stray_animals/Components/Buttons/FilledButton.dart';
import 'package:stray_animals/Components/Buttons/StrokeButton.dart';
import 'package:stray_animals/Components/Texts/BoldText.dart';
import 'package:stray_animals/Components/Texts/NormalText.dart';
import 'package:stray_animals/Constants/colors.dart';
import 'package:stray_animals/Pages/LoadingScreen/LoadingScreen.dart';
import 'package:stray_animals/Pages/SignUpScreen/SignUpScreen.dart';

class SignInScreen extends StatefulWidget {
  const SignInScreen({Key? key}) : super(key: key);

  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  FirebaseAuth firebaseAuth = FirebaseAuth.instance;
  @override
  Widget build(BuildContext context) {
    Future signIn() async {
      if (emailController.text == "") {
        const snackBar = SnackBar(
            content: Text(
          'Please Enter Email',
          style: TextStyle(fontFamily: "Ubuntu"),
        ));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
        return;
      }
      if (passwordController.text == "") {
        const snackBar = SnackBar(
            content: Text(
          'Please Enter Password',
          style: TextStyle(fontFamily: "Ubuntu"),
        ));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
        return;
      }

      try {
        firebaseAuth
            .signInWithEmailAndPassword(
                email: emailController.text, password: passwordController.text)
            .then((value) {
          Navigator.pushReplacement(context,
              MaterialPageRoute(builder: (context) => const LoadingScreen()));
        }).catchError((e) {
          final snackBar = SnackBar(
              content: Text(
            e.message,
            style: const TextStyle(fontFamily: "Ubuntu"),
          ));
          ScaffoldMessenger.of(context).showSnackBar(snackBar);
        });
      } on FirebaseAuthException catch (e) {
        return e.message;
      }
    }

    Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: SingleChildScrollView(
        scrollDirection: Axis.vertical,
        child: Column(children: [
          Container(
            height: size.height * 0.3,
            width: size.width,
            decoration: const BoxDecoration(
                color: kPrimaryColor,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(40),
                  bottomRight: Radius.circular(40),
                )),
            child: SafeArea(
              child: Stack(children: [
                IconButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  icon: const Icon(Icons.arrow_back,
                      color: Colors.white, size: 25),
                ),
                Positioned(
                    top: size.height * 0.1,
                    left: 20,
                    child: const BoldText(
                      text: "Welcome Back",
                      color: Colors.white,
                      size: 40,
                    ))
              ]),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                TextFormField(
                  controller: emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    hintStyle: TextStyle(),
                    prefixIcon: Icon(Icons.email_outlined),
                    border: UnderlineInputBorder(),
                    labelText: 'Enter your Email',
                  ),
                ),
                TextFormField(
                  controller: passwordController,
                  obscureText: true,
                  enableSuggestions: false,
                  autocorrect: false,
                  decoration: const InputDecoration(
                    prefixIcon: Icon(Icons.password),
                    border: UnderlineInputBorder(),
                    labelText: 'Enter your Password',
                  ),
                ),
                const SizedBox(
                  height: 30,
                ),
                FilledButton(
                  width: size.width,
                  onPress: () {
                    signIn();
                  },
                  text: "Sign In",
                ),
                Row(
                  children: const [
                    Expanded(
                        child: Divider(
                      color: kDividerColor,
                      thickness: 1,
                    )),
                    Padding(
                      padding: EdgeInsets.all(10),
                      child: NormalText(
                        text: "or",
                      ),
                    ),
                    Expanded(
                        child: Divider(
                      color: kDividerColor,
                      thickness: 1,
                    )),
                  ],
                ),
                StrokeButton(
                    width: size.width,
                    onPress: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const SignUpScreen(),
                        ),
                      );
                    },
                    text: "Sign Up")
              ],
            ),
          )
        ]),
      ),
    );
  }
}
