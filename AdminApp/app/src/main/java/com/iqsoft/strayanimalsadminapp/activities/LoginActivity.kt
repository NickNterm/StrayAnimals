package com.iqsoft.strayanimalsadminapp.activities

import android.app.Dialog
import android.content.Intent
import android.graphics.Color
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.core.content.ContextCompat
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.auth.FirebaseAuth
import com.iqsoft.strayanimalsadminapp.R
import kotlinx.android.synthetic.main.activity_login.*

class LoginActivity : AppCompatActivity() {
    var mProgressDialog: Dialog? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        if(getCurrentUserId().isNotEmpty()){
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }
        btn_login_sign_in.setOnClickListener{
            showProgressDialog()
            val email = et_login_email.text.toString()
            val password = et_login_password.text.toString()
            FirebaseAuth.getInstance().signInWithEmailAndPassword(email,password).addOnSuccessListener {
                hideProgressDialog()
                startActivity(Intent(this, MainActivity::class.java))
                finish()
            }.addOnFailureListener {
                hideProgressDialog()
                Log.e("test", it.toString())
                showErrorInSnackBar(it.message.toString())
            }
        }
    }
    private fun getCurrentUserId(): String {
        val currentUser = FirebaseAuth.getInstance().currentUser
        var currentUserId = ""
        if (currentUser != null) {
            currentUserId = currentUser.uid
        }
        return currentUserId
    }

    private fun showErrorInSnackBar(error: String) {
        val snackBar =
            Snackbar.make(findViewById(android.R.id.content), error, Snackbar.LENGTH_LONG)
                .setTextColor(resources.getColor(R.color.white))
        val snackBarView = snackBar.view
        snackBarView.setBackgroundColor(Color.parseColor("#D63E39"))
        snackBar.show()
    }

    private fun hideProgressDialog() {
        mProgressDialog?.dismiss()
    }

    private fun showProgressDialog() {
        mProgressDialog = Dialog(this)
        mProgressDialog!!.setContentView(R.layout.dialog_loading)
        mProgressDialog!!.show()
    }
}