import 'package:flutter/widgets.dart';
import 'package:flutter_map/plugin_api.dart';
import 'package:stray_animals/Objects/Location.dart';
import 'package:latlong2/latlong.dart' as latLng;

class ShowMarkerOnMap extends StatelessWidget {
  const ShowMarkerOnMap({
    Key? key,
    required this.location,
  }) : super(key: key);

  final Location location;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 300,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: FlutterMap(
          options: MapOptions(
            interactiveFlags: InteractiveFlag.pinchZoom | InteractiveFlag.drag,
            center: latLng.LatLng(location.lat, location.long),
            zoom: 12,
          ),
          layers: [
            TileLayerOptions(
              urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
              subdomains: ['a', 'b', 'c'],
            ),
            MarkerLayerOptions(markers: [
              Marker(
                point: latLng.LatLng(
                  location.lat,
                  location.long,
                ),
                builder: (ctx) =>
                    Container(child: Image.asset("assets/images/marker.png")),
              )
            ]),
          ],
        ),
      ),
    );
  }
}
