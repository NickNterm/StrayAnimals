package com.iqsoft.strayanimals.activities

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import kotlinx.android.synthetic.main.activity_splash_screen.*
import android.graphics.Typeface
import com.iqsoft.strayanimals.R
import com.iqsoft.strayanimals.firebase.FirestoreClass


class SplashScreen : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash_screen)
        val face = Typeface.createFromAsset(
            assets,
            "Sen-Bold.ttf"
        )
        tv_splash_screen_title.typeface = face

        Handler(Looper.getMainLooper()).postDelayed({
            if(FirestoreClass().getCurrentUserId().isEmpty()) {
                startActivity(Intent(this, IntroActivity::class.java))
            }else{
                startActivity(Intent(this, IntroActivity::class.java))
            }
            overridePendingTransition(R.anim.fade_in, R.anim.fade_out)
            Handler(Looper.getMainLooper()).postDelayed({
                finish()
            }, 500)
        },2000)
    }
}