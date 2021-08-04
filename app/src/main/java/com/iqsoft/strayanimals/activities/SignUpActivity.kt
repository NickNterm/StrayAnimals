package com.iqsoft.strayanimals.activities

import android.content.Intent
import android.os.Bundle
import android.text.TextUtils
import com.google.firebase.auth.FirebaseAuth
import com.iqsoft.strayanimals.R
import com.iqsoft.strayanimals.firebase.FirestoreClass
import com.iqsoft.strayanimals.models.User
import kotlinx.android.synthetic.main.activity_sign_up.*

class SignUpActivity : BaseActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sign_up)
        setupActionBar()
        btn_sign_up_sign_up.setOnClickListener {
            val name = et_sign_up_name.text.toString().trim()
            val email = et_sign_up_email.text.toString().trim()
            val password1 = et_sign_up_password.text.toString().trim()
            val password2 = et_sign_up_repeat.text.toString().trim()
            if (validateForm(name, email, password1, password2)) {
                showProgressDialog()
                FirebaseAuth.getInstance().createUserWithEmailAndPassword(email, password1)
                    .addOnSuccessListener {
                        val user = User(FirestoreClass().getCurrentUserId(), name, email)
                        FirestoreClass().createUser(this, user)
                    }.addOnFailureListener { e ->
                        hideProgressDialog()
                        showErrorInSnackBar(e.message.toString())
                    }
            }
        }
    }
    fun errorInCreatingUser(){
        hideProgressDialog()
        showErrorInSnackBar(resources.getString(R.string.error_while_creating_user))
    }

    fun userCreatedSuccessfully() {
        hideProgressDialog()
        startActivity(Intent(this, SignInActivity::class.java))
        finish()
    }

    private fun validateForm(
        name: String,
        email: String,
        password1: String,
        password2: String
    ): Boolean {
        return when {
            TextUtils.isEmpty(name) -> {
                hideKeyboard(this)
                showErrorInSnackBar(resources.getString(R.string.name_cant_be_empty))
                false
            }
            TextUtils.isEmpty(email) -> {
                hideKeyboard(this)
                showErrorInSnackBar(resources.getString(R.string.email_cant_be_empty))
                false
            }
            TextUtils.isEmpty(password1) -> {
                hideKeyboard(this)
                showErrorInSnackBar(resources.getString(R.string.password_cant_be_empty))
                false
            }
            TextUtils.isEmpty(password2) -> {
                hideKeyboard(this)
                showErrorInSnackBar(resources.getString(R.string.password_cant_be_empty))
                false
            }
            !TextUtils.equals(password1, password2) -> {
                hideKeyboard(this)
                et_sign_up_password.setText("")
                et_sign_up_repeat.setText("")
                showErrorInSnackBar(resources.getString(R.string.passwords_dont_match))
                false
            }
            else -> true
        }
    }

    private fun setupActionBar() {
        setSupportActionBar(toolbar_sign_up)

        val actionBar = supportActionBar!!
        actionBar.setDisplayHomeAsUpEnabled(true)
        actionBar.setHomeAsUpIndicator(R.drawable.ic_baseline_arrow_back_ios_24)

        toolbar_sign_up.setNavigationOnClickListener {
            startActivity(Intent(this,IntroActivity::class.java))
            finish()
        }
    }
}