import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:stray_animals/Components/GeneralComponents/ShowMarkerOnMap.dart';
import 'package:stray_animals/Components/Texts/BoldText.dart';
import 'package:stray_animals/Components/Texts/NormalText.dart';
import 'package:stray_animals/Objects/Location.dart';
import 'package:stray_animals/Objects/Shelter.dart';
import 'package:url_launcher/url_launcher.dart';

class ShelterScreen extends StatelessWidget {
  const ShelterScreen({Key? key, required this.shelter}) : super(key: key);
  final Shelter shelter;
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: AppBar(title: Text(shelter.name)),
      body: SingleChildScrollView(
        scrollDirection: Axis.vertical,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CachedNetworkImage(
              imageUrl: shelter.image,
              width: size.width,
              height: 300,
              fit: BoxFit.cover,
            ),
            const SizedBox(
              height: 10,
            ),
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                children: [
                  BoldText(
                    text: shelter.name,
                    size: 25,
                  ),
                  const SizedBox(
                    height: 15,
                  ),
                  const BoldText(
                    text: "Address",
                    size: 20,
                  ),
                  NormalText(
                    text: shelter.address,
                    size: 18,
                  ),
                  const SizedBox(
                    height: 15,
                  ),
                  const BoldText(
                    text: "Phone: ",
                    size: 20,
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      NormalText(
                        text: shelter.phone,
                        size: 18,
                      ),
                      TextButton(
                        onPressed: () {
                          launch("tel://${shelter.phone}");
                        },
                        child: const Text("Call"),
                      ),
                    ],
                  ),
                  const SizedBox(
                    height: 5,
                  ),
                  const BoldText(
                    text: "Location",
                    size: 22,
                  ),
                  const SizedBox(
                    height: 5,
                  ),
                  ShowMarkerOnMap(
                    location: Location(
                      shelter.location[0],
                      shelter.location[1],
                    ),
                  )
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
