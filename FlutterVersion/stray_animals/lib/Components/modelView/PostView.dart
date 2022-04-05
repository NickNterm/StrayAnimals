import 'package:cached_network_image/cached_network_image.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:stray_animals/Components/Texts/NormalText.dart';
import 'package:stray_animals/Components/Texts/SubtitleText.dart';
import 'package:stray_animals/Constants/colors.dart';
import 'package:stray_animals/Objects/Account.dart';
import 'package:stray_animals/Objects/Post.dart';
import 'package:stray_animals/Pages/PostScreen/PostScreen.dart';

class PostListTile extends StatefulWidget {
  const PostListTile({Key? key, required this.post, required this.user})
      : super(key: key);

  final Post post;
  final Account user;
  @override
  State<PostListTile> createState() => _PostListTileState();
}

class _PostListTileState extends State<PostListTile> {
  FirebaseFirestore firestore = FirebaseFirestore.instance;
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => PostScreen(post: widget.post, user: widget.user),
          ),
        );
      },
      child: Container(
        height: 70,
        margin: EdgeInsets.symmetric(
          horizontal: 20,
          vertical: 10,
        ),
        padding: EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              offset: Offset(0, 5),
              blurRadius: 5,
              color: Colors.grey,
            )
          ],
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(15),
              child: CachedNetworkImage(
                imageUrl: widget.post.images[0],
                height: 50,
                width: 50,
                fit: BoxFit.cover,
              ),
            ),
            SizedBox(
              width: 15,
            ),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  NormalText(text: widget.user.name),
                  SizedBox(
                    width: MediaQuery.of(context).size.width - 150,
                    child: Text(
                      widget.post.description,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.ubuntu(
                        textStyle: TextStyle(
                          fontSize: 16,
                          fontStyle: FontStyle.italic,
                          color: kSecondaryTextColor,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
