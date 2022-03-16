import 'package:flutter/material.dart';
import 'package:stray_animals/Components/modelView/PostCard.dart';
import 'package:stray_animals/Objects/Post.dart';

class PostListScroll extends StatelessWidget {
  const PostListScroll({
    Key? key,
    required this.postList,
  }) : super(key: key);

  final List<Post> postList;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 100),
      child: ListView.builder(
        physics: const NeverScrollableScrollPhysics(),
        shrinkWrap: true,
        itemBuilder: (buildContext, index) {
          return PostWidget(post: postList[index]);
        },
        itemCount: postList.length,
        padding: const EdgeInsets.all(10),
        scrollDirection: Axis.vertical,
      ),
    );
  }
}
