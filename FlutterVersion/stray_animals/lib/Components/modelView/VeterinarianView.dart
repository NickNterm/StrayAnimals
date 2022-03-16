import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:stray_animals/Components/Texts/NormalText.dart';
import 'package:stray_animals/Components/Texts/SubtitleText.dart';
import 'package:stray_animals/Objects/Veterinarian.dart';
import 'package:stray_animals/Pages/VeterinarianScreen/VeterinarianScreen.dart';

class VeterinarianListTile extends StatelessWidget {
  const VeterinarianListTile({
    Key? key,
    required this.veterinarian,
  }) : super(key: key);

  final Veterinarian veterinarian;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => VeterinarianScreen(veterinarian: veterinarian),
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
                imageUrl: veterinarian.image,
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
                NormalText(text: veterinarian.name),
                SubtitleText(text: veterinarian.address),
              ],
            )
          ],
        ),
      ),
    );
  }
}
