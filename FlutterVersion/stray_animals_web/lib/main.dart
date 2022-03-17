import 'package:flutter/material.dart';
import 'package:stray_animals/Constants/colors.dart';
import 'package:stray_animals/Pages/LoadingScreen/LoadingScreen.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Stray Animals',
      theme: ThemeData(
        fontFamily: "Ubuntu",
        primarySwatch: kPrimaryMaterialColor,
        backgroundColor: kBackgroundColor,
        scaffoldBackgroundColor: kBackgroundColor,
      ),
      home: LoadingScreen(),
    );
  }
}
