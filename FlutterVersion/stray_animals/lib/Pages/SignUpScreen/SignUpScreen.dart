import 'dart:math';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:stray_animals/Components/Buttons/FilledButton.dart';
import 'package:stray_animals/Components/Buttons/StrokeButton.dart';
import 'package:stray_animals/Components/Texts/BoldText.dart';
import 'package:stray_animals/Components/Texts/NormalText.dart';
import 'package:stray_animals/Constants/colors.dart';
import 'package:stray_animals/Constants/profileImages.dart';
import 'package:stray_animals/Pages/LoadingScreen/LoadingScreen.dart';
import 'package:stray_animals/Pages/SignInScreen/SignInScreen.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({Key? key}) : super(key: key);

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final usernameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmController = TextEditingController();
  final phoneController = TextEditingController();
  @override
  Widget build(BuildContext context) {
    void signUp() {
      if (usernameController.text.isEmpty) {
        const snackBar = SnackBar(
            content: Text(
          'Please Enter Username',
          style: TextStyle(fontFamily: "Ubuntu"),
        ));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
      } else if (emailController.text.isEmpty) {
        const snackBar = SnackBar(
            content: Text(
          'Please Enter Email',
          style: TextStyle(fontFamily: "Ubuntu"),
        ));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
      } else if (phoneController.text.isEmpty) {
        const snackBar = SnackBar(
            content: Text(
          'Please Enter Phone',
          style: TextStyle(fontFamily: "Ubuntu"),
        ));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
      } else if (confirmController.text.isEmpty ||
          passwordController.text.isEmpty) {
        const snackBar = SnackBar(
            content: Text(
          "Please Enter Password",
          style: TextStyle(fontFamily: "Ubuntu"),
        ));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
      } else if (confirmController.text != passwordController.text) {
        const snackBar = SnackBar(
            content: Text(
          "Passwords don't match",
          style: TextStyle(fontFamily: "Ubuntu"),
        ));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
      } else {
        FirebaseAuth.instance
            .createUserWithEmailAndPassword(
                email: emailController.text, password: passwordController.text)
            .then((userCredential) {
          FirebaseFirestore.instance
              .collection("Users")
              .doc(userCredential.user!.uid)
              .set({
            "block": 0,
            "email": emailController.text,
            "id": userCredential.user!.uid,
            "name": usernameController.text,
            "phone": phoneController.text,
            "photo":
                profileImageList[Random().nextInt(profileImageList.length)],
            "showPhone": true
          }).then(
            (value) => Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (_) => const LoadingScreen(),
              ),
            ),
          );
        }).catchError((error, stackTrace) {
          SnackBar snackBar = SnackBar(
              content: Text(
            error?.message,
            style: TextStyle(fontFamily: "Ubuntu"),
          ));
          ScaffoldMessenger.of(context).showSnackBar(snackBar);
        });
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
              ),
            ),
            child: SafeArea(
              child: Stack(children: [
                IconButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  icon: const Icon(
                    Icons.arrow_back,
                    color: Colors.white,
                    size: 25,
                  ),
                ),
                Positioned(
                  top: size.height * 0.1,
                  left: 20,
                  child: const BoldText(
                    text: "Create Account",
                    color: Colors.white,
                    size: 40,
                  ),
                )
              ]),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                TextFormField(
                  controller: usernameController,
                  keyboardType: TextInputType.text,
                  decoration: const InputDecoration(
                    prefixIcon: Icon(Icons.account_box_rounded),
                    border: UnderlineInputBorder(),
                    labelText: 'Username',
                  ),
                ),
                TextFormField(
                  controller: emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    prefixIcon: Icon(Icons.email_outlined),
                    border: UnderlineInputBorder(),
                    labelText: 'Email',
                  ),
                ),
                TextFormField(
                  controller: phoneController,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(
                    prefixIcon: Icon(Icons.phone),
                    border: UnderlineInputBorder(),
                    labelText: 'Phone',
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
                    labelText: 'Password',
                  ),
                ),
                TextFormField(
                  controller: confirmController,
                  obscureText: true,
                  enableSuggestions: false,
                  autocorrect: false,
                  decoration: const InputDecoration(
                    prefixIcon: Icon(Icons.password),
                    border: UnderlineInputBorder(),
                    labelText: 'Confirm Password',
                  ),
                ),
                const SizedBox(
                  height: 30,
                ),
                FilledButton(
                  width: size.width,
                  onPress: () {
                    signUp();
                  },
                  text: "Sign Up",
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
                            builder: (context) => const SignInScreen()));
                  },
                  text: "Sign In",
                )
              ],
            ),
          )
        ]),
      ),
    );
  }
}
