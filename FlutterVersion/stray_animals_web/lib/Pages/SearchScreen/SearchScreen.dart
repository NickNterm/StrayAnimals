import 'package:cached_network_image/cached_network_image.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:stray_animals/Components/Texts/NormalText.dart';
import 'package:stray_animals/Components/Texts/SubtitleText.dart';
import 'package:stray_animals/Components/modelView/AccountView.dart';
import 'package:stray_animals/Components/modelView/ShelterView.dart';
import 'package:stray_animals/Components/modelView/VeterinarianView.dart';
import 'package:stray_animals/Constants/colors.dart';
import 'package:stray_animals/Objects/Account.dart';
import 'package:stray_animals/Objects/Shelter.dart';
import 'package:stray_animals/Objects/Veterinarian.dart';
import 'package:stray_animals/Pages/AccountScreen/AccountScreen.dart';
import 'package:stray_animals/Pages/SearchScreen/Components/SearchBox.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({Key? key}) : super(key: key);

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  TextEditingController searchController = TextEditingController();
  FirebaseFirestore firebase = FirebaseFirestore.instance;
  List showList = [];
  String textToShow = "Search for a User, a Shelter, a Vet";
  String capitalize(String v) {
    return "${v[0].toUpperCase()}${v.substring(1)}";
  }

  void filterSearchResults(String query) {
    List searchList = [];
    if (query.isNotEmpty) {
      firebase
          .collection("Users")
          .orderBy('name')
          .startAt([capitalize(query)])
          .endAt([capitalize(query) + '\uf8ff'])
          .get()
          .then(
            (value) => {
              for (var doc in value.docs)
                {
                  searchList.add(
                    Account(
                      doc.id,
                      doc.data()["name"],
                      doc.data()["photo"],
                      doc.data()["email"],
                      doc.data()["phone"].toString(),
                      doc.data()["showPhone"],
                    ),
                  )
                },
              firebase
                  .collection("Shelter")
                  .orderBy('name')
                  .startAt([capitalize(query)])
                  .endAt([capitalize(query) + '\uf8ff'])
                  .get()
                  .then(
                    (value) => {
                      for (var doc in value.docs)
                        {
                          searchList.add(
                            Shelter(
                              doc.data()["name"],
                              [
                                double.parse(
                                    doc.data()["location"][0].toString()),
                                double.parse(
                                    doc.data()["location"][1].toString()),
                              ],
                              doc.data()["address"],
                              doc.data()["phone"].toString(),
                              doc.data()["image"],
                            ),
                          )
                        },
                      firebase
                          .collection("Veterinarian")
                          .orderBy("name")
                          .startAt([capitalize(query)])
                          .endAt([capitalize(query) + '\uf8ff'])
                          .get()
                          .then(
                            (value) => {
                              print(capitalize(query)),
                              for (var doc in value.docs)
                                {
                                  searchList.add(
                                    Veterinarian(
                                      doc.data()["name"],
                                      [
                                        double.parse(doc
                                            .data()["location"][0]
                                            .toString()),
                                        double.parse(doc
                                            .data()["location"][1]
                                            .toString()),
                                      ],
                                      doc.data()["address"],
                                      doc.data()["phone"].toString(),
                                      doc.data()["image"],
                                    ),
                                  )
                                },
                              setState(() {
                                showList.clear();
                                showList.addAll(searchList);
                              })
                            },
                          ),
                    },
                  ),
            },
          );

      return;
    } else {
      setState(() {
        showList.clear();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        children: [
          SearchBar(
            searchController: searchController,
            filterSearchResults: filterSearchResults,
          ),
          showList.isEmpty
              ? NormalText(
                  text: textToShow,
                  size: 20,
                )
              : ListView.builder(
                  shrinkWrap: true,
                  itemCount: showList.length,
                  itemBuilder: (context, index) {
                    if (showList[index].runtimeType.toString() == "Account") {
                      return AccountListTile(user: showList[index]);
                    } else if (showList[index].runtimeType.toString() ==
                        "Shelter") {
                      return ShelterListTile(shelter: showList[index]);
                    } else if (showList[index].runtimeType.toString() ==
                        "Veterinarian") {
                      return VeterinarianListTile(
                          veterinarian: showList[index]);
                    }
                    return Container();
                  })
        ],
      ),
    );
  }
}
