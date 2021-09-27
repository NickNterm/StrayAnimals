package com.iqsoft.strayanimals.activities

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import kotlinx.android.synthetic.main.activity_splash_screen.*
import android.graphics.Typeface
import android.util.Log
import android.widget.Toast
import com.google.firebase.auth.FirebaseAuth
import com.google.firestore.v1.FirestoreGrpc
import com.iqsoft.strayanimals.R
import com.iqsoft.strayanimals.firebase.FirestoreClass
import com.iqsoft.strayanimals.models.Post
import com.iqsoft.strayanimals.models.User
import com.iqsoft.strayanimals.utils.Constants


class SplashScreen : AppCompatActivity() {
    private lateinit var mUser: User
    private lateinit var mPosts: ArrayList<Post>
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash_screen)
        val face = Typeface.createFromAsset(
            assets,
            "Sen-Bold.ttf"
        )
        tv_splash_screen_title.typeface = face
        if(FirestoreClass().getCurrentUserId().isEmpty()) {
            Handler(Looper.getMainLooper()).postDelayed({
                startActivity(Intent(this, IntroActivity::class.java))
                overridePendingTransition(R.anim.fade_in, R.anim.fade_out)
                Handler(Looper.getMainLooper()).postDelayed({
                    finish()
                }, 500)
            },2000)

        }else{
            FirestoreClass().getMyUser(this)
        }
    }

    fun userIsLoaded(user: User) {
        if (user.block == 0) {
            FirestoreClass().readPosts(this, )
            mUser = user

        }else{
            Toast.makeText(this, R.string.you_have_been_blocked, Toast.LENGTH_LONG).show()
            FirebaseAuth.getInstance().signOut()
        }
    }

    fun postsLoaded(posts: ArrayList<Post>){
        mPosts = posts
        FirestoreClass().readAccountPosts(this, FirestoreClass().getCurrentUserId())

    }

    fun allPostsLoaded(accountPosts: ArrayList<Post>){
        val intent = Intent(this, MainActivity::class.java)

        intent.putExtra(Constants.INTENT_USER, mUser)
        intent.putExtra(Constants.INTENT_POSTS, mPosts)
        intent.putExtra(Constants.INTENT_ACCOUNT_POSTS, accountPosts)

        startActivity(intent)
        overridePendingTransition(R.anim.fade_in, R.anim.fade_out)
        Handler(Looper.getMainLooper()).postDelayed({
            finish()
        }, 500)
    }
}