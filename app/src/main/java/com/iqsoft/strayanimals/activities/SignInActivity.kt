package com.iqsoft.strayanimals.activities

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.text.TextUtils
import android.widget.Toast
import com.google.firebase.auth.FirebaseAuth
import com.iqsoft.strayanimals.R
import com.iqsoft.strayanimals.firebase.FirestoreClass
import com.iqsoft.strayanimals.models.User
import com.iqsoft.strayanimals.utils.Constants
import kotlinx.android.synthetic.main.activity_sign_in.*

class SignInActivity : BaseActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sign_in)
        setupActionBar()
        btn_sign_in_sign_in.setOnClickListener {
            val email = et_sign_in_email.text.toString()
            val password = et_sign_in_password.text.toString()
            if (validateForm(email, password)) {
                showProgressDialog()
                FirebaseAuth.getInstance().signInWithEmailAndPassword(email, password)
                    .addOnSuccessListener {
                        FirestoreClass().getMyUser(this)
                        hideProgressDialog()
                    }.addOnFailureListener { e ->
                        hideKeyboard(this)
                        showErrorInSnackBar(e.message.toString())
                        hideProgressDialog()
                    }
            }
        }
    }

    override fun onBackPressed() {
        startActivity(Intent(this, IntroActivity::class.java))
        finish()
    }

    private fun validateForm(email: String, password: String): Boolean {
        return when {
            TextUtils.isEmpty(email) -> {
                hideKeyboard(this)
                showErrorInSnackBar(resources.getString(R.string.email_cant_be_empty))
                false
            }
            TextUtils.isEmpty(password) -> {
                hideKeyboard(this)
                showErrorInSnackBar(resources.getString(R.string.password_cant_be_empty))
                false
            }
            else -> true
        }
    }

    private fun setupActionBar() {
        setSupportActionBar(toolbar_sign_in)

        val actionBar = supportActionBar!!
        actionBar.setDisplayHomeAsUpEnabled(true)
        actionBar.setHomeAsUpIndicator(R.drawable.ic_baseline_arrow_back_ios_24)

        toolbar_sign_in.setNavigationOnClickListener { onBackPressed() }
    }


    fun userIsLoaded(user: User) {
        if (user.block == 0) {
            val intent = Intent(this, MainActivity::class.java)

            intent.putExtra(Constants.INTENT_USER, user)

            startActivity(intent)
            finish()
        } else {
            Toast.makeText(this, R.string.you_have_been_blocked, Toast.LENGTH_LONG).show()
            FirebaseAuth.getInstance().signOut()
        }
    }
}