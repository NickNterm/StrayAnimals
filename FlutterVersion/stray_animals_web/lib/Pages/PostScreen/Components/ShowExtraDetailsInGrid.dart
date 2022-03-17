import 'package:flutter/material.dart';
import 'package:stray_animals/Components/Texts/BoldText.dart';
import 'package:stray_animals/Components/Texts/SubtitleText.dart';
import 'package:stray_animals/Objects/Post.dart';

class ShowExtraDetailsInGrid extends StatelessWidget {
  const ShowExtraDetailsInGrid({
    Key? key,
    required this.post,
  }) : super(key: key);

  final Post post;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const BoldText(
          text: "More Info",
          size: 22,
        ),
        post.extra!.keys.length % 2 == 0
            ? GridView.builder(
                physics: const NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                itemCount: post.extra!.keys.length,
                itemBuilder: (context, index) => Container(
                  margin:
                      const EdgeInsets.symmetric(horizontal: 5, vertical: 10),
                  decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      color: Colors.white,
                      boxShadow: [
                        BoxShadow(
                            offset: const Offset(0, 5),
                            blurRadius: 5,
                            color: Colors.grey.withOpacity(0.5))
                      ]),
                  child: Center(
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          BoldText(
                            text: post.extra!.keys.toList()[index],
                          ),
                          SubtitleText(
                            text: post.extra![post.extra!.keys.toList()[index]],
                          )
                        ]),
                  ),
                ),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  childAspectRatio: 2 / 1,
                  crossAxisCount: 2,
                ),
              )
            : Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  GridView.builder(
                    physics: const NeverScrollableScrollPhysics(),
                    shrinkWrap: true,
                    itemCount: post.extra!.keys.length - 1,
                    itemBuilder: (context, index) => Container(
                      margin: const EdgeInsets.symmetric(
                          horizontal: 5, vertical: 10),
                      decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(10),
                          color: Colors.white,
                          boxShadow: [
                            BoxShadow(
                                offset: const Offset(0, 5),
                                blurRadius: 5,
                                color: Colors.grey.withOpacity(0.5))
                          ]),
                      child: Center(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            BoldText(
                              text: post.extra!.keys.toList()[index],
                            ),
                            SubtitleText(
                              text:
                                  post.extra![post.extra!.keys.toList()[index]],
                            )
                          ],
                        ),
                      ),
                    ),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      childAspectRatio: 2 / 1,
                      crossAxisCount: 2,
                    ),
                  ),
                  Container(
                    height: MediaQuery.of(context).size.width / 4 - 20,
                    width: MediaQuery.of(context).size.width / 2 - 20,
                    margin:
                        const EdgeInsets.symmetric(horizontal: 5, vertical: 10),
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        color: Colors.white,
                        boxShadow: [
                          BoxShadow(
                              offset: const Offset(0, 5),
                              blurRadius: 5,
                              color: Colors.grey.withOpacity(0.5))
                        ]),
                    child: Center(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          BoldText(
                            text: post.extra!.keys
                                .toList()[post.extra!.keys.length - 1],
                          ),
                          SubtitleText(
                            text: post.extra![post.extra!.keys
                                .toList()[post.extra!.keys.length - 1]],
                          )
                        ],
                      ),
                    ),
                  ),
                ],
              )
      ],
    );
  }
}
