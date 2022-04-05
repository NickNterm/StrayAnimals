import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:file_picker/file_picker.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'package:stray_animals/Components/Buttons/FilledButton.dart';
import 'package:stray_animals/Components/GeneralComponents/ShowMarkerOnMap.dart';
import 'package:stray_animals/Components/SnackBar/SnackBar.dart';
import 'package:stray_animals/Components/Texts/BoldText.dart';
import 'package:stray_animals/Components/Texts/SubtitleText.dart';
import 'package:stray_animals/Constants/colors.dart';
import 'package:stray_animals/Objects/Account.dart';
import 'package:stray_animals/Objects/Location.dart';
import 'package:stray_animals/Pages/SelectLocationScreen/SelectLocationScreen.dart';
import 'package:stray_animals/Pages/UploadScreen/Object/ExtraInformation.dart';
import 'package:heic_to_jpg/heic_to_jpg.dart';

class UploadScreen extends StatefulWidget {
  const UploadScreen({Key? key, required this.user}) : super(key: key);
  final Account user;
  @override
  State<UploadScreen> createState() => _UploadScreenState();
}

class _UploadScreenState extends State<UploadScreen> {
  List<PlatformFile> imageList = [];
  Location? location;
  TextEditingController descriptionController = TextEditingController();
  TextEditingController breedController = TextEditingController();
  TextEditingController sizeController = TextEditingController();
  TextEditingController colorController = TextEditingController();
  TextEditingController genderController = TextEditingController();
  TextEditingController microchipController = TextEditingController();
  List<ExtraInformationObject> extraFields = [];
  bool loading = false;
  void pickImages() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      withData: true,
      allowMultiple: true,
      type: FileType.custom,
      allowedExtensions: ['jpg', 'png', 'jpeg'],
    );
    List<PlatformFile> fileList = [];
    if (result != null) {
      for (var file in result.files) {
        if (file.extension == 'heic') {
          //print(file.bytes);
          var myfile =
              PlatformFile(name: file.name, size: file.size, bytes: file.bytes);
          print(myfile.path);
          // String? jpegPath = await HeicToJpg.convert(file.path!);
          // file = PlatformFile(path: jpegPath, name: file.name, size: file.size);
          //print(file.bytes);
          fileList.add(file);
        } else {
          fileList.add(file);
        }
      }
    }
    setState(() {
      imageList.addAll(fileList);
    });
  }

  void uploadPost() {
    setState(() {
      loading = true;
    });
    if (imageList.isNotEmpty) {
      if (descriptionController.text != "") {
        if (location != null) {
          List<String> imagesURL = [];
          for (var image in imageList) {
            FirebaseStorage.instance
                .ref()
                .child("POST_IMAGE_${DateTime.now().millisecondsSinceEpoch}")
                .putData(image.bytes!)
                .then(
                  (p0) => p0.ref.getDownloadURL().then(
                    (downloadURL) {
                      imagesURL.add(downloadURL);
                      if (imagesURL.length == imageList.length) {
                        Map<String, String> extras = {};
                        for (var extra in extraFields) {
                          extras.addAll({
                            extra.titleController.text:
                                extra.valueController.text
                          });
                        }
                        if (breedController.text.isNotEmpty) {
                          extras.addAll({"Breed": breedController.text});
                        } else {
                          extras.addAll({"Breed": "Unknown"});
                        }
                        if (sizeController.text.isNotEmpty) {
                          extras.addAll({"Size (in kg)": sizeController.text});
                        } else {
                          extras.addAll({"Size (in kg)": "Unknown"});
                        }
                        if (colorController.text.isNotEmpty) {
                          extras.addAll({"Color": colorController.text});
                        } else {
                          extras.addAll({"Color": "Unknown"});
                        }
                        if (genderController.text.isNotEmpty) {
                          extras.addAll({"Gender": genderController.text});
                        } else {
                          extras.addAll({"Gender": "Unknown"});
                        }
                        if (microchipController.text.isNotEmpty) {
                          extras
                              .addAll({"Microchip": microchipController.text});
                        } else {
                          extras.addAll({"Microchip": "Unknown"});
                        }
                        FirebaseFirestore.instance
                            .collection("Posts")
                            .doc()
                            .set({
                          "animal": "dog",
                          "createdBy": widget.user.id,
                          "description": descriptionController.text,
                          "extra": extras,
                          "found": 1,
                          "id": "",
                          "image": imagesURL,
                          "likeIdList": [],
                          "location": {
                            "latitude": location!.lat,
                            "longitude": location!.long
                          },
                          "lost": 0,
                          "postedTime": DateTime.now().millisecondsSinceEpoch,
                          "rated": 0,
                        }).then((value) {
                          FirebaseMessaging messaging =
                              FirebaseMessaging.instance;
                          messaging.sendMessage(
                            data: {"title": "test title", "body": "Test Body"},
                          );
                          setState(() {
                            loading = false;
                          });
                          showErrorOnSnackbar(context, "Done");
                        });
                      }
                    },
                  ),
                )
                .catchError((error, stackTrace) {
              showErrorOnSnackbar(context, error?.message);
              setState(() {
                loading = false;
              });
            });
          }
        } else {
          setState(() {
            loading = false;
          });
          showErrorOnSnackbar(context, "Please Select Loction");
        }
      } else {
        setState(() {
          loading = false;
        });
        showErrorOnSnackbar(context, "Please Enter Description");
      }
    } else {
      setState(() {
        loading = false;
      });
      showErrorOnSnackbar(context, "Pick At Least One Image");
    }
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Padding(
              padding: EdgeInsets.only(top: 10, left: 10),
              child: BoldText(
                text: "Images",
                size: 25,
              ),
            ),
            SizedBox(
              height: 300,
              child: ListView.builder(
                itemCount: 1 + imageList.length,
                scrollDirection: Axis.horizontal,
                itemBuilder: ((context, index) {
                  if (index == imageList.length) {
                    return GestureDetector(
                      onTap: () {
                        pickImages();
                      },
                      child: Container(
                        margin: const EdgeInsets.all(10),
                        width: 300,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(20),
                          color: Colors.grey[300],
                        ),
                        child: Icon(
                          Icons.add_rounded,
                          size: 80,
                          color: Colors.grey[400],
                        ),
                      ),
                    );
                  } else {
                    return Container(
                      margin: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            offset: const Offset(0, 5),
                            blurRadius: 5,
                            color: Colors.grey.withOpacity(0.5),
                          )
                        ],
                      ),
                      width: size.width * 0.6,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: Image.memory(
                          imageList[index].bytes!,
                          fit: BoxFit.cover,
                        ),
                      ),
                    );
                  }
                }),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextFormField(
                    controller: descriptionController,
                    keyboardType: TextInputType.multiline,
                    maxLines: null,
                    decoration: const InputDecoration(
                      border: UnderlineInputBorder(),
                      labelText: 'Description',
                    ),
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  location != null
                      ? Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const BoldText(
                              text: "Location",
                              size: 25,
                            ),
                            Padding(
                              padding: const EdgeInsets.all(10),
                              child: ShowMarkerOnMap(
                                location: location!,
                              ),
                            ),
                          ],
                        )
                      : Container(),

                  FilledButton(
                    onPress: () async {
                      final result = await Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const SelectLocationScreen(),
                        ),
                      );
                      if (result != null) {
                        setState(() {
                          location = result;
                        });
                      }
                    },
                    text: 'Select Location',
                    width: size.width,
                  ),
                  // SizedBox(
                  //   height: 20,
                  // ),
                  // BoldText(
                  //   text: "Breed",
                  //   size: 20,
                  // ),
                  // Autocomplete<String>(
                  //   initialValue: TextEditingValue(text: "Unknown"),
                  //   optionsBuilder: (TextEditingValue textEditingValue) {
                  //     if (textEditingValue.text == '') {
                  //       return const Iterable<String>.empty();
                  //     }
                  //     return dogBreeds.where((String option) {
                  //       return option
                  //           .contains(textEditingValue.text.toLowerCase());
                  //     });
                  //   },
                  // ),
                  const SizedBox(
                    height: 30,
                  ),
                  Row(
                    children: const [
                      BoldText(
                        text: "Details",
                        size: 25,
                      ),
                      SizedBox(
                        width: 10,
                      ),
                      SubtitleText(
                        text: "(Don't fill the unknown details)",
                        size: 15,
                      ),
                    ],
                  ),
                  TextFormField(
                    controller: breedController,
                    keyboardType: TextInputType.text,
                    maxLines: null,
                    decoration: const InputDecoration(
                      border: UnderlineInputBorder(),
                      labelText: 'Breed',
                    ),
                  ),
                  const SizedBox(
                    height: 10,
                  ),
                  TextFormField(
                    controller: sizeController,
                    keyboardType: TextInputType.text,
                    maxLines: null,
                    decoration: const InputDecoration(
                      border: UnderlineInputBorder(),
                      labelText: 'Size (in kg)',
                    ),
                  ),
                  const SizedBox(
                    height: 10,
                  ),
                  TextFormField(
                    controller: colorController,
                    keyboardType: TextInputType.text,
                    maxLines: null,
                    decoration: const InputDecoration(
                      border: UnderlineInputBorder(),
                      labelText: 'Color',
                    ),
                  ),
                  const SizedBox(
                    height: 10,
                  ),
                  TextFormField(
                    controller: genderController,
                    keyboardType: TextInputType.text,
                    maxLines: null,
                    decoration: const InputDecoration(
                      border: UnderlineInputBorder(),
                      labelText: 'Gender',
                    ),
                  ),
                  const SizedBox(
                    height: 10,
                  ),
                  TextFormField(
                    controller: microchipController,
                    keyboardType: TextInputType.text,
                    maxLines: null,
                    decoration: const InputDecoration(
                      border: UnderlineInputBorder(),
                      labelText: 'Microchip',
                    ),
                  ),
                  const SizedBox(
                    height: 10,
                  ),
                  extraFields.isNotEmpty
                      ? Column(
                          children: extraFields.map((element) {
                            return Container(
                              margin: const EdgeInsets.all(8),
                              padding:
                                  const EdgeInsets.fromLTRB(20, 10, 20, 20),
                              decoration: BoxDecoration(
                                  border:
                                      Border.all(width: 1, color: kTextColor),
                                  borderRadius: BorderRadius.circular(10)),
                              child: Column(
                                children: [
                                  element.titleField,
                                  element.valueField
                                ],
                              ),
                            );
                          }).toList(),
                        )
                      : Container(),
                  TextButton(
                    onPressed: () {
                      var titleController = TextEditingController();
                      var titleField = TextField(
                        controller: titleController,
                        decoration: const InputDecoration(
                          border: UnderlineInputBorder(),
                          labelText: 'Property Name',
                        ),
                      );
                      var valueController = TextEditingController();
                      var valueField = TextField(
                        controller: valueController,
                        decoration: const InputDecoration(
                          border: UnderlineInputBorder(),
                          labelText: 'Property Value',
                        ),
                      );
                      ExtraInformationObject informationObject =
                          ExtraInformationObject(
                        titleField,
                        titleController,
                        valueField,
                        valueController,
                      );
                      setState(() {
                        extraFields.add(informationObject);
                      });
                    },
                    child: const Text("Add more infomation"),
                  ),
                  FilledButton(
                    onPress: () {
                      uploadPost();
                    },
                    text: 'Upload',
                    width: size.width,
                    loading: loading,
                  ),
                  const SizedBox(
                    height: 100,
                  ),
                ],
              ),
            )
          ]),
        ),
      ),
    );
  }
}
