import 'package:cached_network_image/cached_network_image.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/plugin_api.dart';
import 'package:stray_animals/Components/GeneralComponents/LikeButton.dart';
import 'package:stray_animals/Components/GeneralComponents/ShowMarkerOnMap.dart';
import 'package:stray_animals/Components/Texts/BoldText.dart';
import 'package:stray_animals/Components/Texts/NormalText.dart';
import 'package:stray_animals/Components/Texts/SubtitleText.dart';
import 'package:stray_animals/Constants/colors.dart';
import 'package:stray_animals/Constants/size.dart';
import 'package:stray_animals/Objects/Account.dart';
import 'package:stray_animals/Objects/Location.dart';
import 'package:stray_animals/Objects/Post.dart';
import 'package:intl/intl.dart';
import 'package:latlong2/latlong.dart' as latLng;
import 'package:stray_animals/Pages/PostScreen/Components/ShowExtraDetailsInGrid.dart';

class PostScreen extends StatefulWidget {
  const PostScreen({required this.post, Key? key, required this.user})
      : super(key: key);
  final Post post;
  final Account user;

  @override
  State<PostScreen> createState() => _PostScreenState(post);
}

class _PostScreenState extends State<PostScreen> with TickerProviderStateMixin {
  FirebaseFirestore firestore = FirebaseFirestore.instance;
  FirebaseAuth firebaseAuth = FirebaseAuth.instance;
  _PostScreenState(this.post);
  Post post;
  int _currIndex = 0;

  @override
  void initState() {
    super.initState();
    _currIndex = post.likes.contains(firebaseAuth.currentUser!.uid) ? 1 : 0;
    if (post.extra != null) {
      for (var key in post.extra!.keys) {}
    }
  }

  late final AnimationController _controller = AnimationController(
    duration: const Duration(milliseconds: 400),
    value: 1,
    vsync: this,
  );
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

  String parseTimeStamp(int value) {
    var date = DateTime.fromMillisecondsSinceEpoch(value);
    var d12 = DateFormat('MM-dd-yyyy, hh:mm a').format(date);
    return d12;
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    PageController controller =
        PageController(initialPage: 0, viewportFraction: 0.8);
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.user.name),
      ),
      body: Container(
        width: size.width,
        alignment: Alignment.topCenter,
        child: Container(
          constraints: BoxConstraints(
            maxWidth: maxWidth,
          ),
          child: SingleChildScrollView(
            scrollDirection: Axis.vertical,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  height: 300,
                  child: PageView.builder(
                    controller: controller,
                    scrollDirection: Axis.horizontal,
                    itemCount: widget.post.images.length,
                    itemBuilder: (context, index) => Container(
                      margin: const EdgeInsets.fromLTRB(10, 20, 10, 30),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            offset: const Offset(0, 5),
                            blurRadius: 8,
                            color: Colors.grey.withOpacity(1),
                          )
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: CachedNetworkImage(
                          height: 300,
                          width: size.width,
                          imageUrl: widget.post.images[index],
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  ),
                ),
                const Divider(),
                Padding(
                  padding: const EdgeInsets.all(10),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      LikeButton(
                          controller: _controller,
                          currIndex: _currIndex,
                          changeState: changeLike),
                      const SizedBox(
                        width: 10,
                      ),
                      Text(widget.post.likes.length.toString()),
                      const Spacer(),
                      SubtitleText(text: parseTimeStamp(post.postTime))
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(10),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const BoldText(
                        text: "Description",
                        size: 22,
                      ),
                      const SizedBox(
                        height: 5,
                      ),
                      NormalText(
                        text: post.description,
                        size: 17,
                      ),
                      const SizedBox(
                        height: 15,
                      ),
                      post.extra != null
                          ? ShowExtraDetailsInGrid(post: post)
                          : Container(),
                      const SizedBox(
                        height: 15,
                      ),
                      const BoldText(
                        text: "Location",
                        size: 22,
                      ),
                      const SizedBox(
                        height: 5,
                      ),
                      ShowMarkerOnMap(location: post.location),
                      const SizedBox(
                        height: 50,
                      )
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
