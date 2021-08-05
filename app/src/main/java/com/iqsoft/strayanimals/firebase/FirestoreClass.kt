package com.iqsoft.strayanimals.firebase

import android.app.Activity
import android.widget.Toast
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.iqsoft.strayanimals.activities.SignInActivity
import com.iqsoft.strayanimals.activities.SignUpActivity
import com.iqsoft.strayanimals.activities.SplashScreen
import com.iqsoft.strayanimals.models.User
import com.iqsoft.strayanimals.utils.Constants

class FirestoreClass() {
    private val mFirebase = FirebaseFirestore.getInstance()

    fun createUser(activity: Activity, user: User) {
        mFirebase.collection(Constants.USERS)
            .document(user.id)
            .set(user)
            .addOnSuccessListener {
                if (activity is SignUpActivity) {
                    activity.userCreatedSuccessfully()
                }
            }.addOnFailureListener {
                if (activity is SignUpActivity) {
                    activity.errorInCreatingUser()
                }
            }
    }

    fun getCurrentUserId(): String {
        val currentUser = FirebaseAuth.getInstance().currentUser
        var currentUserId = ""
        if (currentUser != null) {
            currentUserId = currentUser.uid
        }
        return currentUserId
    }

    fun getMyUser(activity: Activity) {
        mFirebase.collection(Constants.USERS)
            .document(getCurrentUserId())
            .get()
            .addOnSuccessListener { document ->
                val user = document.toObject(User::class.java)!!
                if (activity is SplashScreen) {
                    activity.userIsLoaded(user)
                }else if(activity is SignInActivity){
                    activity.userIsLoaded(user)
                }
            }.addOnFailureListener {
                Toast.makeText(activity.baseContext, "there is no internet", Toast.LENGTH_LONG).show()
            }
    }
}