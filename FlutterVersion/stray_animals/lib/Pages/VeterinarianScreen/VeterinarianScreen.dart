import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/plugin_api.dart';
import 'package:stray_animals/Components/GeneralComponents/ShowMarkerOnMap.dart';
import 'package:stray_animals/Components/Texts/BoldText.dart';
import 'package:stray_animals/Components/Texts/NormalText.dart';
import 'package:stray_animals/Objects/Location.dart';
import 'package:stray_animals/Objects/Shelter.dart';
import 'package:stray_animals/Objects/Veterinarian.dart';
import 'package:url_launcher/url_launcher.dart' as UrlLauncher;
import 'package:latlong2/latlong.dart' as latLng;

class VeterinarianScreen extends StatelessWidget {
  const VeterinarianScreen({Key? key, required this.veterinarian})
      : super(key: key);
  final Veterinarian veterinarian;
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: AppBar(title: Text(veterinarian.name)),
      body: SingleChildScrollView(
        scrollDirection: Axis.vertical,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CachedNetworkImage(
              imageUrl: veterinarian.image,
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
                    text: veterinarian.name,
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
                    text: veterinarian.address,
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
                        text: veterinarian.phone,
                        size: 18,
                      ),
                      TextButton(
                        onPressed: () {
                          UrlLauncher.launch("tel://${veterinarian.phone}");
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
                      veterinarian.location[0],
                      veterinarian.location[1],
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
