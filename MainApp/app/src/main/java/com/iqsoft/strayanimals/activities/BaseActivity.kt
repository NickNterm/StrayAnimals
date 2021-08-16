package com.iqsoft.strayanimals.activities

import android.app.Activity
import android.app.Dialog
import android.graphics.Color
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.view.inputmethod.InputMethodManager
import androidx.core.content.ContextCompat
import com.google.android.material.snackbar.Snackbar
import com.iqsoft.strayanimals.R
import kotlinx.android.synthetic.main.dialog_loading.*
import android.widget.TextView


open class BaseActivity : AppCompatActivity() {
    var mProgressDialog: Dialog? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_base)
    }

    fun hideKeyboard(activity: Activity) {
        val imm: InputMethodManager =
            activity.getSystemService(INPUT_METHOD_SERVICE) as InputMethodManager
        //Find the currently focused view, so we can grab the correct window token from it.
        var view: View? = activity.currentFocus
        //If no view currently has focus, create a new one, just so we can grab a window token from it
        if (view == null) {
            view = View(activity)
        }
        imm.hideSoftInputFromWindow(view.windowToken, 0)
    }

    fun showErrorInSnackBar(error: String) {
        val snackBar =
            Snackbar.make(findViewById(android.R.id.content), error, Snackbar.LENGTH_LONG)
                .setTextColor(resources.getColor(R.color.white))
        val snackBarView = snackBar.view
        snackBarView.setBackgroundColor(ContextCompat.getColor(this, R.color.ErrorMessage))
        snackBar.show()
    }

    fun hideProgressDialog() {
        mProgressDialog?.dismiss()
    }

    fun showProgressDialog() {
        mProgressDialog = Dialog(this)
        mProgressDialog!!.setContentView(R.layout.dialog_loading)
        mProgressDialog!!.show()
    }
}