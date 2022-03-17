import 'dart:convert';
import 'dart:math';
import 'package:flutter_map_marker_cluster/flutter_map_marker_cluster.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart' as latLng;
import 'package:stray_animals/Components/modelView/PostView.dart';
import 'package:stray_animals/Components/modelView/ShelterView.dart';
import 'package:stray_animals/Components/modelView/VeterinarianView.dart';
import 'package:stray_animals/Constants/colors.dart';
import 'package:stray_animals/Objects/Account.dart';
import 'package:stray_animals/Objects/Location.dart';
import 'package:stray_animals/Objects/Post.dart';
import 'package:stray_animals/Objects/Shelter.dart';
import 'package:stray_animals/Objects/Veterinarian.dart';

class MapScreen extends StatefulWidget {
  const MapScreen(
      {Key? key, required this.veterinarianList, required this.shelterList})
      : super(key: key);
  final List<Veterinarian> veterinarianList;
  final List<Shelter> shelterList;

  @override
  State<MapScreen> createState() =>
      _MapScreenState(shelterList, veterinarianList);
}

class _MapScreenState extends State<MapScreen> {
  List<Marker> markerList = [];
  dynamic elementToShow;
  Account user = Account("", "", "", "", "", true);
  FirebaseFirestore firestore = FirebaseFirestore.instance;
  List<Veterinarian> veterinarianList;
  List<Shelter> shelterList;
  _MapScreenState(this.shelterList, this.veterinarianList);
  List<Post> postList = [];
  void updateMarkers() {
    postList = [];
    markerList = [];
    List<Marker> newMarkerList = [];
    firestore.collection("Posts").get().then(
          (snapshot) => {
            for (var doc in snapshot.docs)
              {
                postList.add(
                  Post(
                    doc.data()["createdBy"],
                    doc.data()["description"],
                    doc.id,
                    doc.data()["image"],
                    doc.data()["likeIdList"],
                    Location(
                      doc.data()["location"]["latitude"],
                      doc.data()["location"]["longitude"],
                    ),
                    doc.data()["postedTime"],
                    doc.data()["extra"],
                  ),
                ),
                newMarkerList.add(Marker(
                  width: 40,
                  height: 40,
                  anchorPos: AnchorPos.exactly(Anchor(20, 0)),
                  point: latLng.LatLng(doc.data()["location"]["latitude"],
                      doc.data()["location"]["longitude"]),
                  builder: (ctx) => Container(
                    child: Image.asset("assets/images/dog_marker.png"),
                  ),
                ))
              },
            for (var shelter in shelterList)
              {
                newMarkerList.add(
                  Marker(
                    width: 40,
                    height: 40,
                    anchorPos: AnchorPos.exactly(Anchor(20, 0)),
                    point: latLng.LatLng(
                      shelter.location[0],
                      shelter.location[1],
                    ),
                    builder: (ctx) => Container(
                      child: Image.asset("assets/images/marker.png"),
                    ),
                  ),
                ),
              },
            for (var veterinarian in veterinarianList)
              {
                newMarkerList.add(
                  Marker(
                    width: 40,
                    height: 40,
                    anchorPos: AnchorPos.exactly(Anchor(20, 0)),
                    point: latLng.LatLng(
                      veterinarian.location[0],
                      veterinarian.location[1],
                    ),
                    builder: (ctx) => Container(
                      child: Image.asset("assets/images/marker.png"),
                    ),
                  ),
                ),
              },
            setState(() {
              markerList = newMarkerList;
            }),
          },
        );
  }

  @override
  void initState() {
    super.initState();
    updateMarkers();
  }

  Widget selectedElement() {
    if (elementToShow == null) {
      return Container();
    } else if (elementToShow.runtimeType.toString() == "Shelter\$" ||
        elementToShow.runtimeType.toString() == "minified:Jx") {
      return Positioned(
        bottom: 90,
        left: 0,
        right: 0,
        child: ShelterListTile(shelter: elementToShow),
      );
    } else if (elementToShow.runtimeType.toString() == "Veterinarian\$" ||
        elementToShow.runtimeType.toString() == "minified:KN") {
      return Positioned(
        bottom: 90,
        left: 0,
        right: 0,
        child: VeterinarianListTile(veterinarian: elementToShow),
      );
    } else if (elementToShow.runtimeType.toString() == "Post\$" ||
        elementToShow.runtimeType.toString() == "minified:uY") {
      return Positioned(
        bottom: 90,
        left: 0,
        right: 0,
        child: PostListTile(
          post: elementToShow,
          user: user,
        ),
      );
    }
    return Container();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(children: [
        FlutterMap(
          options: MapOptions(
            center: latLng.LatLng(38.95, 23.5),
            plugins: [
              MarkerClusterPlugin(),
            ],
            zoom: 6.3,
          ),
          layers: [
            TileLayerOptions(
              urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
              subdomains: ['a', 'b', 'c'],
            ),
            MarkerClusterLayerOptions(
              onMarkerTap: (Marker marker) {
                setState(() {
                  if (markerList.indexOf(marker) < postList.length) {
                    elementToShow = postList[markerList.indexOf(marker)];
                  } else if (markerList.indexOf(marker) <
                      postList.length + shelterList.length) {
                    elementToShow = shelterList[
                        markerList.indexOf(marker) - postList.length];
                  } else {
                    elementToShow = veterinarianList[
                        markerList.indexOf(marker) -
                            postList.length -
                            shelterList.length];
                  }
                });
                if (elementToShow.runtimeType.toString() == "Post") {
                  firestore
                      .collection("Users")
                      .doc(elementToShow.userId)
                      .get()
                      .then((doc) {
                    setState(() {
                      user = Account(
                        elementToShow.userId,
                        doc.data()!["name"],
                        doc.data()!["photo"],
                        doc.data()!["email"],
                        doc.data()!["phone"].toString(),
                        doc.data()!["showPhone"],
                      );
                    });
                  });
                }
                print(elementToShow.runtimeType);
              },
              maxClusterRadius: 10,
              size: const Size(40, 40),
              fitBoundsOptions: const FitBoundsOptions(
                padding: EdgeInsets.all(50),
              ),
              centerMarkerOnClick: true,
              markers: markerList,
              polygonOptions: const PolygonOptions(
                  borderColor: kPrimaryColor,
                  color: Colors.black12,
                  borderStrokeWidth: 3),
              builder: (context, markers) {
                return FloatingActionButton(
                  heroTag: Random(),
                  child: Text(markers.length.toString()),
                  onPressed: null,
                );
              },
            ),
          ],
        ),
        selectedElement()
      ]),
    );
  }
}
