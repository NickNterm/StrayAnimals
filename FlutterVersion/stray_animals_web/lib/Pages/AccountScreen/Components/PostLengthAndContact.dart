import 'package:flutter/material.dart';
import 'package:stray_animals/Components/Texts/NormalText.dart';
import 'package:stray_animals/Objects/Account.dart';
import 'package:stray_animals/Objects/Post.dart';
import 'package:url_launcher/url_launcher.dart';

class PostLengthAndContact extends StatelessWidget {
  const PostLengthAndContact({
    Key? key,
    required this.postList,
    required this.user,
  }) : super(key: key);

  final List<Post> postList;
  final Account user;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Container(
            margin: EdgeInsets.all(10),
            padding: EdgeInsets.all(10),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                    offset: Offset(0, 5),
                    color: Colors.grey.withOpacity(0.5),
                    blurRadius: 5)
              ],
            ),
            child: NormalText(text: "Posts: ${postList.length.toString()}"),
          ),
        ),
        Expanded(
          child: Container(
            margin: EdgeInsets.all(10),
            padding: EdgeInsets.all(10),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                    offset: Offset(0, 5),
                    color: Colors.grey.withOpacity(0.5),
                    blurRadius: 5)
              ],
            ),
            child: PopupMenuButton(
              itemBuilder: (context) => [
                PopupMenuItem(
                  child: Text("Call"),
                  onTap: () {
                    launch("tel://${user.phone}");
                  },
                  value: 1,
                ),
                PopupMenuItem(
                  child: Text("Email"),
                  onTap: () {
                    launch("mailto:${user.email}");
                  },
                  value: 2,
                )
              ],
              child: NormalText(text: "Contact"),
            ),
          ),
        ),
      ],
    );
  }
}
