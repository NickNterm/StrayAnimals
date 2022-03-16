import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:stray_animals/Components/Texts/NormalText.dart';
import 'package:stray_animals/Components/Texts/SubtitleText.dart';
import 'package:stray_animals/Objects/Shelter.dart';
import 'package:stray_animals/Pages/ShelterScreen/ShelterScreen.dart';

class ShelterListTile extends StatelessWidget {
  const ShelterListTile({
    Key? key,
    required this.shelter,
  }) : super(key: key);

  final Shelter shelter;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ShelterScreen(shelter: shelter),
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
                imageUrl: shelter.image,
                height: 50,
                width: 50,
                fit: BoxFit.cover,
              ),
            ),
            SizedBox(
              width: 15,
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                NormalText(text: shelter.name),
                SubtitleText(text: shelter.address),
              ],
            )
          ],
        ),
      ),
    );
  }
}
