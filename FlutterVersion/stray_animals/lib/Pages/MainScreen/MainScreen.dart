import 'package:flutter/material.dart';
import 'package:stray_animals/Objects/Account.dart';
import 'package:stray_animals/Objects/Post.dart';
import 'package:stray_animals/Objects/Shelter.dart';
import 'package:stray_animals/Objects/Veterinarian.dart';
import 'package:stray_animals/Pages/AccountScreen/AccountScreen.dart';
import 'package:stray_animals/Pages/FeedScreen/FeedScreen.dart';
import 'package:stray_animals/Pages/MainScreen/Components/CustomNavigationBar.dart';
import 'package:stray_animals/Pages/MapScreen/MapScreen.dart';
import 'package:stray_animals/Pages/SearchScreen/SearchScreen.dart';
import 'package:stray_animals/Pages/UploadScreen/UploadScreen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({
    Key? key,
    required this.postList,
    required this.myUser,
    required this.veterinarianList,
    required this.shelterList,
  }) : super(key: key);
  final List<Post> postList;
  final Account myUser;
  final List<Veterinarian> veterinarianList;
  final List<Shelter> shelterList;
  @override
  State<MainScreen> createState() =>
      _MainScreenState(postList, myUser, shelterList, veterinarianList);
}

class _MainScreenState extends State<MainScreen> {
  _MainScreenState(
      this.postList, this.myUser, this.shelterList, this.veterinarianList);
  final List<Post> postList;
  final Account myUser;
  final List<Veterinarian> veterinarianList;
  final List<Shelter> shelterList;
  late List<Widget> pages;
  @override
  void initState() {
    super.initState();
    pages = [
      SearchScreen(),
      MapScreen(
        shelterList: shelterList,
        veterinarianList: veterinarianList,
      ),
      FeedScreen(
        postList: postList,
        myUser: myUser,
        changeNavPage: changeNavPage,
      ),
      UploadScreen(user: myUser),
      AccountScreen(
        user: myUser,
        showBackButton: false,
      ),
    ];
  }

  int currentIndex = 2;

  void changeNavPage(int index) {
    setState(() {
      currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        resizeToAvoidBottomInset: false,
        body: Stack(
          children: [
            pages[currentIndex],
            CustomNavigationBar(
              currentIndex: currentIndex,
              changeNavPage: changeNavPage,
            )
          ],
        ));
  }
}
