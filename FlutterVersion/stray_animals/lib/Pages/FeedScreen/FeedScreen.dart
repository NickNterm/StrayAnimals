import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:stray_animals/Components/modelView/PostCard.dart';
import 'package:stray_animals/Components/Texts/NormalText.dart';
import 'package:stray_animals/Constants/colors.dart';
import 'package:stray_animals/Objects/Account.dart';
import 'package:stray_animals/Objects/Location.dart';
import 'package:stray_animals/Objects/Post.dart';
import 'package:stray_animals/Pages/SettingsScreen/SettingsScreen.dart';

class FeedScreen extends StatefulWidget {
  FeedScreen(
      {Key? key,
      required this.postList,
      required this.myUser,
      required this.changeNavPage})
      : super(key: key);
  final List<Post> postList;
  final Account myUser;
  final Function changeNavPage;

  @override
  State<FeedScreen> createState() => _FeedScreenState(postList);
}

class _FeedScreenState extends State<FeedScreen> {
  _FeedScreenState(this.postList);
  List<Post> postList;
  FirebaseFirestore firestore = FirebaseFirestore.instance;
  bool loadMore = true;
  @override
  void initState() {
    super.initState();
  }

  void getPosts(int lastPostTime) {
    firestore
        .collection('Posts')
        .orderBy("postedTime", descending: true)
        .startAt([lastPostTime])
        .limit(5)
        .get()
        .then((querySnapshot) => {
              querySnapshot.docs
                  .map((doc) => {
                        if (doc.data()["postedTime"] != lastPostTime)
                          {
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
                          }
                      })
                  .toList(),
              setState(() {
                if (querySnapshot.docs.length < 5) {
                  loadMore = false;
                }
              })
            });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackgroundColor,
      appBar: AppBar(
        centerTitle: true,
        actions: <Widget>[
          IconButton(
            icon: const Icon(
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
        ],
        leading: GestureDetector(
          onTap: () {
            widget.changeNavPage(4);
          },
          child: Padding(
            padding: EdgeInsets.all(8),
            child: CircleAvatar(
              radius: 5,
              backgroundImage: NetworkImage(widget.myUser.profileImage),
            ),
          ),
        ),
        title: const Text(
          "StrayAnimals",
          textAlign: TextAlign.center,
          style: TextStyle(
            color: kTextColor,
            fontStyle: FontStyle.italic,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: kBackgroundColor,
        elevation: 0,
      ),
      body: ListView.builder(
        itemCount: widget.postList.length + 1,
        shrinkWrap: true,
        padding: const EdgeInsets.all(10),
        scrollDirection: Axis.vertical,
        itemBuilder: (buildContext, index) {
          if (index < widget.postList.length) {
            return PostWidget(post: widget.postList[index]);
          } else {
            return Padding(
              padding: const EdgeInsets.only(top: 20, bottom: 100),
              child: Column(
                children: [
                  NormalText(
                    text: loadMore
                        ? "Press refresh to load More Posts"
                        : "There aren't any other Posts\nCome in a few hours to check for new Posts",
                  ),
                  Visibility(
                    visible: loadMore,
                    child: IconButton(
                      onPressed: () {
                        getPosts(postList[postList.length - 1].postTime);
                      },
                      icon: Icon(Icons.refresh),
                    ),
                  ),
                ],
              ),
            );
          }
        },
      ),
    );
  }
}
