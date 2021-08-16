package com.iqsoft.strayanimals.firebase

import android.app.Activity
import android.util.Log
import android.widget.Toast
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.iqsoft.strayanimals.activities.*
import com.iqsoft.strayanimals.fragments.UploadFragment
import com.iqsoft.strayanimals.models.Post
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
                } else if (activity is SignInActivity) {
                    activity.userIsLoaded(user)
                } else if (activity is MainActivity) {
                    activity.userIsLoaded(user)
                }
            }.addOnFailureListener {
                Toast.makeText(activity.baseContext, "there is no internet", Toast.LENGTH_LONG)
                    .show()
            }
    }

    fun readAccountPosts(activity: Activity, id: String) {
        mFirebase.collection(Constants.POSTS)
            .orderBy(Constants.POST_TIME)
            .whereEqualTo(Constants.POST_CREATED_BY, id)
            .get()
            .addOnSuccessListener { document ->
                val postList: ArrayList<Post> = ArrayList()

                for (i in document.documents) {
                    val post = i.toObject(Post::class.java)!!
                    post.id = i.id
                    postList.add(post)
                }
                postList.reverse()
                if (activity is SplashScreen) {
                    activity.allPostsLoaded(postList)
                } else if (activity is MainActivity) {
                    activity.allPostsLoaded(postList)
                } else if (activity is ViewProfileActivity){
                    activity.allPostsLoaded(postList)
                }
            }.addOnFailureListener {
                Log.e("test", it.toString())

            }
    }

    fun updateUserProfileData(activity: Activity, userHashMap: HashMap<String, Any>) {
        mFirebase.collection(Constants.USERS)
            .document(getCurrentUserId())
            .update(userHashMap)
            .addOnSuccessListener {
                when (activity) {
                    is EditProfileActivity -> {
                        activity.userUpdated()
                    }
                }

            }.addOnFailureListener { e ->
                Log.e("testt", e.toString())
                Toast.makeText(activity, "Error when Updating!!", Toast.LENGTH_LONG).show()
                when (activity) {
                    is EditProfileActivity -> {
                        activity.hideProgressDialog()
                    }
                }
            }
    }


    fun readPosts(activity: Activity, limit: Long = 50) {
        mFirebase.collection(Constants.POSTS)
            .orderBy(Constants.POST_TIME)
            .limitToLast(limit)
            .get()
            .addOnSuccessListener { document ->
                val postList: ArrayList<Post> = ArrayList()
                for (i in document.documents) {
                    val post = i.toObject(Post::class.java)!!
                    post.id = i.id
                    postList.add(post)
                }
                postList.reverse()
                if (activity is SplashScreen) {
                    activity.postsLoaded(postList)
                } else if (activity is MainActivity) {
                    activity.postsLoaded(postList)
                }
            }
    }

    fun uploadPost(activity: Activity, post: Post) {
        mFirebase.collection(Constants.POSTS)
            .document()
            .set(post)
            .addOnSuccessListener {
                if (activity is MainActivity) {
                    activity.postUploaded()
                }
            }.addOnFailureListener {
                if (activity is MainActivity) {
                    activity.hideProgressDialog()
                }
            }
    }
}