import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:stray_animals/Constants/colors.dart';
import 'package:stray_animals/Objects/Account.dart';
import 'package:stray_animals/Objects/Post.dart';
import 'package:stray_animals/Objects/Shelter.dart';
import 'package:stray_animals/Objects/Veterinarian.dart';
import 'package:stray_animals/Pages/MainScreen/MainScreen.dart';
import 'package:stray_animals/Pages/WelcomeScreen/WelcomeScreen.dart';
import '../../Objects/Location.dart';

class LoadingScreen extends StatefulWidget {
  const LoadingScreen({Key? key}) : super(key: key);

  @override
  State<LoadingScreen> createState() => _LoadingScreenState();
}

class _LoadingScreenState extends State<LoadingScreen> {
  FirebaseFirestore firestore = FirebaseFirestore.instance;
  FirebaseAuth firebaseAuth = FirebaseAuth.instance;
  List<Post> postList = [];
  List<Veterinarian> veterinarianList = [];
  List<Shelter> shelterList = [];
  late Account myUser;

  void getPostsDone() {
    firestore.collection("Veterinarian").get().then(
          (querySnapshot) => {
            print("this is the length " + querySnapshot.docs.length.toString()),
            for (var doc in querySnapshot.docs)
              {
                veterinarianList.add(
                  Veterinarian(
                    doc.data()["name"],
                    [
                      double.parse(doc.data()["location"][0].toString()),
                      double.parse(doc.data()["location"][1].toString()),
                    ],
                    doc.data()["address"],
                    doc.data()["phone"].toString(),
                    doc.data()["image"],
                  ),
                )
              },
            firestore.collection("Shelter").get().then(
                  (querySnapshot) => {
                    print("this is the length " +
                        querySnapshot.docs.length.toString()),
                    for (var doc in querySnapshot.docs)
                      {
                        shelterList.add(
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
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (context) => MainScreen(
                          postList: postList,
                          myUser: myUser,
                          shelterList: shelterList,
                          veterinarianList: veterinarianList,
                        ),
                      ),
                    )
                  },
                )
          },
        );
  }

  void getPosts() {
    firestore
        .collection('Posts')
        .orderBy("postedTime", descending: true)
        .limit(5)
        .get()
        .then((querySnapshot) => {
              querySnapshot.docs
                  .map((doc) => {
                        print(doc.data()),
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
                        )
                      })
                  .toList(),
              getPostsDone()
            });
  }

  @override
  void initState() {
    super.initState();
    if (firebaseAuth.currentUser != null) {
      firestore
          .collection("Users")
          .doc(firebaseAuth.currentUser!.uid)
          .get()
          .then((doc) {
        myUser = Account(
            firebaseAuth.currentUser!.uid,
            doc.data()!["name"],
            doc.data()!["photo"],
            doc.data()!["email"],
            doc.data()!["phone"].toString(),
            doc.data()!["showPhone"]);
        print(doc.data());
        getPosts();
      });
    } else {
      Future.delayed(Duration.zero, () async {
        Navigator.pushReplacement(
            context, MaterialPageRoute(builder: (context) => WelcomeScreen()));
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Column(
            children: [
              Expanded(
                flex: 1,
                child: Image.asset(
                  "assets/icons/adaptive-icon.png",
                  width: size.width * 0.4,
                ),
              ),
              Expanded(
                flex: 1,
                child: Column(
                  children: const [
                    Text(
                      "Stray Animals",
                      style:
                          TextStyle(fontSize: 38, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    Text(
                      "Let's transform our society\nin a place where animals will\nbe treated with care",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 18,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ],
                ),
              ),
              const Expanded(
                flex: 1,
                child: SpinKitWave(
                  color: kPrimaryColor,
                  size: 50.0,
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
