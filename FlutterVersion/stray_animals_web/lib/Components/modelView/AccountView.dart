import 'package:flutter/material.dart';
import 'package:stray_animals/Components/Texts/NormalText.dart';
import 'package:stray_animals/Objects/Account.dart';
import 'package:stray_animals/Pages/AccountScreen/AccountScreen.dart';

class AccountListTile extends StatelessWidget {
  const AccountListTile({
    Key? key,
    required this.user,
  }) : super(key: key);

  final Account user;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => AccountScreen(user: user),
          ),
        );
      },
      child: Container(
        height: 70,
        margin: const EdgeInsets.symmetric(
          horizontal: 20,
          vertical: 10,
        ),
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: const [
            BoxShadow(
              offset: Offset(0, 5),
              blurRadius: 5,
              color: Colors.grey,
            )
          ],
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          children: [
            CircleAvatar(
              radius: 25,
              backgroundColor: Colors.transparent,
              backgroundImage: NetworkImage(user.profileImage),
            ),
            const SizedBox(
              width: 15,
            ),
            NormalText(text: user.name)
          ],
        ),
      ),
    );
  }
}
