package com.iqsoft.strayanimals.firebase

import android.app.Activity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.iqsoft.strayanimals.activities.SignUpActivity
import com.iqsoft.strayanimals.models.User
import com.iqsoft.strayanimals.utils.Constants

class FirestoreClass() {
    private val mFirebase = FirebaseFirestore.getInstance()

    fun createUser(activity: Activity, user: User){
        mFirebase.collection(Constants.USERS)
            .document(user.id)
            .set(user)
            .addOnSuccessListener {
                if(activity is SignUpActivity){
                    activity.userCreatedSuccessfully()
                }
            }.addOnFailureListener {
                if(activity is SignUpActivity){
                    activity.errorInCreatingUser()
                }
            }
    }

    fun getCurrentUserId(): String{
        val currentUser = FirebaseAuth.getInstance().currentUser
        var currentUserId = ""
        if (currentUser != null) {
            currentUserId = currentUser.uid
        }
        return currentUserId
    }
}