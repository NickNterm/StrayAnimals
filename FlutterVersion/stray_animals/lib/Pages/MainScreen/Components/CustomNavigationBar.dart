import 'package:flutter/material.dart';
import 'package:stray_animals/Constants/colors.dart';

class CustomNavigationBar extends StatelessWidget {
  const CustomNavigationBar({
    Key? key,
    required this.currentIndex,
    required this.changeNavPage,
  }) : super(key: key);
  final Function changeNavPage;
  final int currentIndex;

  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: 0,
      left: 0,
      child: SizedBox(
        width: MediaQuery.of(context).size.width,
        height: 80,
        child: Stack(children: [
          CustomPaint(
            size: Size(MediaQuery.of(context).size.width, 80),
            painter: NavigationPainter(),
          ),
          Center(
            heightFactor: 0.6,
            child: FloatingActionButton(
              onPressed: () {
                changeNavPage(2);
              },
              backgroundColor: kPrimaryColor,
              child: Icon(Icons.home_rounded),
            ),
          ),
          Container(
            width: MediaQuery.of(context).size.width,
            height: 80,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                IconButton(
                  onPressed: () {
                    changeNavPage(0);
                  },
                  splashRadius: 0.1,
                  icon: const Icon(Icons.search_rounded),
                  color: currentIndex == 0 ? kPrimaryColor : Colors.grey,
                ),
                IconButton(
                  onPressed: () {
                    changeNavPage(1);
                  },
                  splashRadius: 0.1,
                  icon: const Icon(Icons.map_rounded),
                  color: currentIndex == 1 ? kPrimaryColor : Colors.grey,
                ),
                SizedBox(
                  width: MediaQuery.of(context).size.width * 0.2,
                ),
                IconButton(
                  onPressed: () {
                    changeNavPage(3);
                  },
                  splashRadius: 0.1,
                  icon: const Icon(Icons.upload_rounded),
                  color: currentIndex == 3 ? kPrimaryColor : Colors.grey,
                ),
                IconButton(
                  onPressed: () {
                    changeNavPage(4);
                  },
                  splashRadius: 0.1,
                  icon: const Icon(Icons.account_circle_rounded),
                  color: currentIndex == 4 ? kPrimaryColor : Colors.grey,
                ),
              ],
            ),
          )
        ]),
      ),
    );
  }
}

class NavigationPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    Paint paint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;
    Path path = Path();
    path.moveTo(0, 20);
    path.quadraticBezierTo(size.width * 0.2, 0, size.width * 0.35, 0);
    path.quadraticBezierTo(size.width * 0.4, 0, size.width * 0.4, 20);
    path.arcToPoint(Offset(size.width * 0.6, 20),
        radius: const Radius.circular(10), clockwise: false);
    path.quadraticBezierTo(size.width * 0.6, 0, size.width * 0.65, 0);
    path.quadraticBezierTo(size.width * 0.8, 0, size.width, 20);
    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    canvas.drawShadow(path, Colors.grey, 10, false);
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}
