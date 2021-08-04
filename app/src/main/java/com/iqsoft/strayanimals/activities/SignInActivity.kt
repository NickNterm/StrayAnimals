package com.iqsoft.strayanimals.activities

import android.content.Intent
import android.os.Bundle
import android.text.TextUtils
import com.google.firebase.auth.FirebaseAuth
import com.iqsoft.strayanimals.R
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
                        startActivity(Intent(this, MainActivity::class.java))
                        hideProgressDialog()
                    }.addOnFailureListener { e ->
                        hideKeyboard(this)
                        showErrorInSnackBar(e.message.toString())
                        hideProgressDialog()
                    }
            }
        }
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

        toolbar_sign_in.setNavigationOnClickListener {
            startActivity(Intent(this,IntroActivity::class.java))
            finish()
        }
    }
}