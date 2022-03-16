import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:stray_animals/Pages/LoadingScreen/LoadingScreen.dart';
import 'package:stray_animals/Pages/PolicyScreen/PolicyScreen.dart';
import 'package:stray_animals/Pages/TermsScreen/TermsScreen.dart';
import 'package:url_launcher/url_launcher.dart' as UrlLauncher;

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text("Settings"),
        ),
        body: Padding(
          padding: const EdgeInsets.all(10),
          child: ListView(
            children: [
              ListTile(
                onTap: () {},
                leading: const Icon(Icons.account_circle_rounded),
                title: const Text("Edit Account"),
                trailing: const Icon(Icons.navigate_next_rounded),
              ),
              const Divider(),
              ListTile(
                onTap: () {
                  UrlLauncher.launch("mailto:strayanimalsdeveloper@gmail.com");
                },
                leading: const Icon(Icons.mail_rounded),
                title: const Text("Contact Developers"),
                subtitle: const Text(
                    "We are happy to hear your thought for our apps"),
                trailing: const Icon(Icons.navigate_next_rounded),
              ),
              const Divider(),
              ListTile(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const TermsScreen(),
                    ),
                  );
                },
                leading: const Icon(Icons.security_rounded),
                title: const Text("Terms & Conditions"),
                trailing: const Icon(Icons.navigate_next_rounded),
              ),
              const Divider(),
              ListTile(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const PolicyScreen(),
                    ),
                  );
                },
                leading: const Icon(Icons.policy_rounded),
                title: const Text("Privacy Policy"),
                trailing: const Icon(Icons.navigate_next_rounded),
              ),
              const Divider(),
              ListTile(
                onTap: () {
                  FirebaseAuth.instance.signOut();
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const LoadingScreen(),
                    ),
                  );
                },
                leading: const Icon(Icons.logout),
                title: const Text("Log Out"),
                trailing: const Icon(Icons.navigate_next_rounded),
              ),
              const Divider(),
            ],
          ),
        ));
  }
}
