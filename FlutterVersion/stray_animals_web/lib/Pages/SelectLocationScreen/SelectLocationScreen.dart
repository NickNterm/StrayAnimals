import 'package:flutter/material.dart';
import 'package:flutter_map/plugin_api.dart';
import 'package:latlong2/latlong.dart' as latLng;
import 'package:stray_animals/Components/Buttons/FilledButton.dart';
import 'package:stray_animals/Constants/size.dart';
import 'package:stray_animals/Objects/Location.dart';

class SelectLocationScreen extends StatefulWidget {
  const SelectLocationScreen({Key? key}) : super(key: key);

  @override
  State<SelectLocationScreen> createState() => _SelectLocationScreenState();
}

class _SelectLocationScreenState extends State<SelectLocationScreen> {
  late MapController controller;
  @override
  void initState() {
    super.initState();
    controller = MapController();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Select Location")),
      body: Container(
        constraints: BoxConstraints(
          maxWidth: maxWidth,
        ),
        child: Stack(children: [
          FlutterMap(
            mapController: controller,
            options: MapOptions(
              center: latLng.LatLng(38.95, 23.5),
              zoom: 6.3,
            ),
            layers: [
              TileLayerOptions(
                urlTemplate:
                    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                subdomains: ['a', 'b', 'c'],
              ),
            ],
          ),
          Positioned(
            bottom: MediaQuery.of(context).size.height / 2 - 143 * 0.3 / 2,
            left: MediaQuery.of(context).size.width / 2 - 100 * 0.3 / 2,
            child: Image.asset(
              "assets/images/marker.png",
              width: 100 * 0.3,
              height: 143 * 0.3,
            ),
          ),
          Positioned(
            bottom: 20,
            right: 20,
            left: 20,
            child: FilledButton(
              width: MediaQuery.of(context).size.width,
              onPress: () {
                Navigator.pop(
                  context,
                  Location(
                    controller.center.latitude,
                    controller.center.longitude,
                  ),
                );
              },
              text: "Select",
            ),
          )
        ]),
      ),
    );
  }
}
