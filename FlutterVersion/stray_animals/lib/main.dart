import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:stray_animals/Constants/colors.dart';
import 'package:stray_animals/Pages/LoadingScreen/LoadingScreen.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  //await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  print("Handling a background message: ${message.messageId}");
  var androiInit = AndroidInitializationSettings('@mipmap/ic_launcher');
  var iosInit = IOSInitializationSettings();
  var initSetting = InitializationSettings(android: androiInit, iOS: iosInit);
  var fltNotification = FlutterLocalNotificationsPlugin();
  fltNotification.initialize(initSetting);
  var androidDetails = AndroidNotificationDetails('1', 'channelName');
  var iosDetails = IOSNotificationDetails();
  var generalNotificationDetails =
      NotificationDetails(android: androidDetails, iOS: iosDetails);
  RemoteNotification? notification = message.notification;
  AndroidNotification? android = message.notification?.android;
  if (notification != null && android != null) {
    fltNotification.show(notification.hashCode, notification.title,
        notification.body, generalNotificationDetails);
  }
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (kIsWeb) {
    await Firebase.initializeApp();
  } else {
    await Firebase.initializeApp(
        options: DefaultFirebaseOptions.currentPlatform);
  }
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  String? token = await FirebaseMessaging.instance.getToken();
  print("DEV TOKEN FIREBASE CLOUD MESSAGING -> $token");

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
        scaffoldBackgroundColor: Colors.white,
      ),
      home: LoadingScreen(),
    );
  }
}
