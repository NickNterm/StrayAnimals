import 'package:cached_network_image/cached_network_image.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:stray_animals/Components/GeneralComponents/LikeButton.dart';
import 'package:stray_animals/Constants/colors.dart';
import 'package:stray_animals/Objects/Account.dart';
import 'package:stray_animals/Objects/Post.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:stray_animals/Pages/AccountScreen/AccountScreen.dart';
import 'package:stray_animals/Pages/PostScreen/PostScreen.dart';
import 'package:url_launcher/url_launcher.dart' as UrlLauncher;

class PostWidget extends StatefulWidget {
  const PostWidget({
    Key? key,
    required this.post,
  }) : super(key: key);

  final Post post;

  @override
  State<PostWidget> createState() => _PostWidgetState(post);
}

class _PostWidgetState extends State<PostWidget> with TickerProviderStateMixin {
  FirebaseFirestore firestore = FirebaseFirestore.instance;
  FirebaseAuth firebaseAuth = FirebaseAuth.instance;
  _PostWidgetState(this.post);
  Post post;
  int _currIndex = 0;
  Account user = Account("", "", "", "", "", false);
  @override
  void initState() {
    super.initState();
    _currIndex = post.likes.contains(firebaseAuth.currentUser!.uid) ? 1 : 0;
    firestore.collection("Users").doc(post.userId).get().then((doc) {
      setState(() {
        print(doc.data()!["photo"]);
        user = Account(
          post.userId,
          doc.data()!["name"],
          doc.data()!["photo"],
          doc.data()!["email"],
          doc.data()!["phone"].toString(),
          doc.data()!["showPhone"],
        );
      });
    });
  }

  late final AnimationController _controller = AnimationController(
    duration: const Duration(milliseconds: 400),
    value: 1,
    vsync: this,
  );

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void changeLike() {
    Map<String, Object> docData = new Map();
    if (post.likes.contains(firebaseAuth.currentUser!.uid)) {
      post.likes.remove(firebaseAuth.currentUser!.uid);
    } else {
      post.likes.add(firebaseAuth.currentUser!.uid);
    }
    docData["likeIdList"] = post.likes;
    firestore.collection("Posts").doc(post.id).update(docData);
    _controller.animateTo(0.8).then((value) => _controller.animateTo(1));
    setState(() {
      _currIndex = _currIndex == 0 ? 1 : 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      height: 500,
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          color: kBackgroundColor,
          boxShadow: [
            BoxShadow(
                offset: Offset(0, 5),
                color: Colors.grey.withOpacity(0.5),
                blurRadius: 10)
          ]),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          PostTopRow(
            user: user,
            post: post,
          ),
          const SizedBox(
            height: 10,
          ),
          Expanded(
            child: GestureDetector(
              onDoubleTap: () {
                changeLike();
              },
              child: ClipRRect(
                child: CachedNetworkImage(
                  imageUrl: post.images[0],
                  fit: BoxFit.cover,
                  // loadingBuilder: (BuildContext context, Widget child,
                  //     ImageChunkEvent? loadingProgress) {
                  //   if (loadingProgress == null) return child;
                  //   return Center(
                  //     child: CircularProgressIndicator(
                  //       value: loadingProgress.expectedTotalBytes != null
                  //           ? loadingProgress.cumulativeBytesLoaded /
                  //               loadingProgress.expectedTotalBytes!
                  //           : null,
                  //     ),
                  //   );
                  //},
                ),
                borderRadius: BorderRadius.circular(20),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 10),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                LikeButton(
                  controller: _controller,
                  currIndex: _currIndex,
                  changeState: changeLike,
                ),
                const SizedBox(
                  width: 10,
                ),
                Text(widget.post.likes.length.toString()),
                const Spacer(),
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => PostScreen(
                          post: post,
                          user: user,
                        ),
                      ),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                        color: kPrimaryColor,
                        borderRadius: BorderRadius.circular(10)),
                    child: const Text(
                      "MORE",
                      style: TextStyle(color: Colors.white, fontSize: 12),
                    ),
                  ),
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}

class PostTopRow extends StatelessWidget {
  const PostTopRow({
    Key? key,
    required this.user,
    required this.post,
  }) : super(key: key);

  final Account user;
  final Post post;
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => AccountScreen(
              user: user,
            ),
          ),
        );
      },
      child: Row(
        children: [
          user.profileImage != ""
              ? CircleAvatar(
                  radius: 20,
                  backgroundColor: Colors.transparent,
                  backgroundImage: NetworkImage(user.profileImage),
                )
              : Container(
                  height: 40,
                ),
          const SizedBox(
            width: 10,
          ),
          Text(
            user.name,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const Spacer(),
          GestureDetector(
              child: const Icon(Icons.more_vert),
              onTap: () {
                showModalBottomSheet(
                    context: context,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20.0),
                    ),
                    backgroundColor: kBackgroundColor,
                    builder: (context) {
                      return Padding(
                        padding: const EdgeInsets.only(top: 20),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: <Widget>[
                            ListTile(
                              leading: const Icon(Icons.email),
                              title: const Text('Email User'),
                              onTap: () {
                                UrlLauncher.launch("mailto:${user.email}");
                              },
                            ),
                            ListTile(
                              leading: const Icon(Icons.phone),
                              title: const Text('Call User'),
                              onTap: () {
                                UrlLauncher.launch("tel://${user.phone}");
                              },
                            ),
                            ListTile(
                              leading: const Icon(Icons.more_horiz),
                              title: const Text('More info'),
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => PostScreen(
                                      post: post,
                                      user: user,
                                    ),
                                  ),
                                );
                              },
                            ),
                            SizedBox(
                              height: 20,
                            )
                          ],
                        ),
                      );
                    });
              })
        ],
      ),
    );
  }
}
