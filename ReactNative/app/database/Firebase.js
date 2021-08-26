import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  /*
  apiKey: "AIzaSyCAi5GzWHSoY6AzXJZYy-xoJCo3D8KTMSY",
  authDomain: "reactnativefirebase-1769a.firebaseapp.com",
  projectId: "reactnativefirebase-1769a",
  storageBucket: "reactnativefirebase-1769a.appspot.com",
  messagingSenderId: "350901028267",
  appId: "1:350901028267:web:a3335a5daf9b3111fabeee",
  measurementId: "G-K5H3G8SEKR",
  */
  apiKey: "AIzaSyBIjKRttnKNMgPk5s8kvfeOo_DkR_PiPxM",
  authDomain: "strayanimalsapp.firebaseapp.com",
  projectId: "strayanimalsapp",
  storageBucket: "strayanimalsapp.appspot.com",
  messagingSenderId: "783963393864",
  appId: "1:783963393864:web:c5b09e1d60a6ae0530ed7d",
  measurementId: "G-QJ4C7L9L7K",
};
// Initialize Firebase
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
export default firebase;
