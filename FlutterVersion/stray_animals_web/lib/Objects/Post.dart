import 'package:stray_animals/Objects/Location.dart';

class Post {
  Post(this.userId, this.description, this.id, this.images, this.likes,
      this.location, this.postTime, this.extra);
  String userId;
  String description;
  String id;
  List images;
  List likes;
  Location location;
  int postTime;
  Map<String, dynamic>? extra;
}
