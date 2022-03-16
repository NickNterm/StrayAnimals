import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:stray_animals/Components/modelView/PostCard.dart';
import 'package:stray_animals/Components/Texts/BoldText.dart';
import 'package:stray_animals/Components/Texts/NormalText.dart';
import 'package:stray_animals/Constants/colors.dart';
import 'package:stray_animals/Objects/Account.dart';
import 'package:stray_animals/Objects/Location.dart';
import 'package:stray_animals/Objects/Post.dart';
import 'package:stray_animals/Pages/AccountScreen/Components/PostLengthAndContact.dart';
import 'package:stray_animals/Pages/AccountScreen/Components/PostListScroll.dart';
import 'package:stray_animals/Pages/SettingsScreen/SettingsScreen.dart';
import 'package:url_launcher/url_launcher.dart' as UrlLauncher;

class AccountScreen extends StatefulWidget {
  const AccountScreen(
      {Key? key, required this.user, this.showBackButton = true})
      : super(key: key);
  final Account user;
  final bool showBackButton;
  @override
  State<AccountScreen> createState() =>
      _AccountScreenState(user, showBackButton);
}

class _AccountScreenState extends State<AccountScreen> {
  _AccountScreenState(this.user, this.showBackButton);
  Account user;
  bool showBackButton;
  FirebaseFirestore firestore = FirebaseFirestore.instance;
  List<Post> postList = [];
  @override
  void initState() {
    super.initState();
    firestore
        .collection('Posts')
        .where("createdBy", isEqualTo: user.id)
        .get()
        .then((querySnapshot) => {
              querySnapshot.docs
                  .map((doc) => {
                        print(doc.data()),
                        postList.add(
                          Post(
                            doc.data()["createdBy"],
                            doc.data()["description"],
                            doc.id,
                            doc.data()["image"],
                            doc.data()["likeIdList"],
                            Location(
                              doc.data()["location"]["latitude"],
                              doc.data()["location"]["longitude"],
                            ),
                            doc.data()["postedTime"],
                            doc.data()["extra"],
                          ),
                        )
                      })
                  .toList(),
              setState(() {})
            });
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: AppBar(
        title: BoldText(text: user.name),
        backgroundColor: kBackgroundColor,
        elevation: 0,
        leading: showBackButton
            ? IconButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                icon: Icon(
                  Icons.arrow_back_rounded,
                  color: kTextColor,
                ),
              )
            : null,
        actions: <Widget>[
          !showBackButton
              ? IconButton(
                  icon: Icon(
                    Icons.settings_rounded,
                    color: kTextColor,
                  ),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => SettingsScreen(),
                      ),
                    );
                  },
                )
              : Container(),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              Center(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      CircleAvatar(
                        radius: 60,
                        backgroundImage: NetworkImage(widget.user.profileImage),
                      ),
                      SizedBox(
                        height: 10,
                      ),
                      BoldText(
                        text: widget.user.name,
                        size: 24,
                      )
                    ],
                  ),
                ),
              ),
              PostLengthAndContact(postList: postList, user: user),
              const SizedBox(
                height: 10,
              ),
              const BoldText(
                text: "Posts",
                size: 20,
              ),
              PostListScroll(postList: postList),
            ],
          ),
        ),
      ),
    );
  }
}
