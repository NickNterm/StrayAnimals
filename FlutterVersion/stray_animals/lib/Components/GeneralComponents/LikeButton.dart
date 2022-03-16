import 'package:flutter/widgets.dart';
import 'package:stray_animals/Constants/colors.dart';

class LikeButton extends StatelessWidget {
  const LikeButton({
    Key? key,
    required AnimationController controller,
    required int currIndex,
    required this.changeState,
  })  : _controller = controller,
        _currIndex = currIndex,
        super(key: key);

  final AnimationController _controller;
  final int _currIndex;
  final Function changeState;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        changeState();
      },
      child: AnimatedSwitcher(
        duration: const Duration(milliseconds: 200),
        transitionBuilder: (child, anim) => ScaleTransition(
          scale: child.key == const ValueKey('icon1')
              ? CurvedAnimation(
                  parent: _controller,
                  curve: Curves.easeIn,
                )
              : CurvedAnimation(
                  reverseCurve: Curves.fastOutSlowIn,
                  parent: _controller,
                  curve: Curves.easeIn,
                ),
          child: FadeTransition(opacity: anim, child: child),
        ),
        child: _currIndex == 0
            ? Image.asset(
                "assets/icons/dog_paw_outline.png",
                width: 25,
                color: kTextColor,
                key: const ValueKey('icon1'),
              )
            : Image.asset(
                "assets/icons/dog_paw_filled.png",
                width: 25,
                key: const ValueKey('icon2'),
              ),
      ),
    );
  }
}
