package com.iqsoft.strayanimals.activities

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.telephony.PhoneNumberUtils
import android.text.TextUtils
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.bumptech.glide.Glide
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageReference
import com.iqsoft.strayanimals.R
import com.iqsoft.strayanimals.firebase.FirestoreClass
import com.iqsoft.strayanimals.models.Post
import com.iqsoft.strayanimals.models.User
import com.iqsoft.strayanimals.utils.Constants
import kotlinx.android.synthetic.main.activity_edit_profile.*
import kotlinx.android.synthetic.main.fragment_upload.*
import java.io.IOException
import java.util.ArrayList

class EditProfileActivity : BaseActivity() {
    private var mImageUri: Uri? = null
    private var mImageUrl: String = ""
    private lateinit var mUser: User

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edit_profile)
        mUser = intent.getParcelableExtra(Constants.INTENT_USER_TO_EDIT)!!
        et_edit_account_email.setText(mUser.email)
        if(mUser.phone != 0L) {
            et_edit_account_phone.setText(mUser.phone.toString())
        }
        if(mUser.photo.isNotEmpty()){
            Glide.with(this)
                .load(mUser.photo)
                .centerCrop()
                .placeholder(R.drawable.ic_account_placeholder)
                .into(iv_edit_account_profile)
        }
        et_edit_account_name.setText(mUser.name)
        iv_edit_account_profile.setOnClickListener {
            if (ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.READ_EXTERNAL_STORAGE
                ) == PackageManager.PERMISSION_GRANTED
            ) {
                Constants.showImageChooser(this)
            } else {
                ActivityCompat.requestPermissions(
                    this,
                    arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE),
                    Constants.READ_STORAGE_PERMISSION_CODE
                )
            }
        }

        btn_save_view_account.setOnClickListener {
            hideKeyboard(this)
            if (validateForm()) {
                showProgressDialog()
                if (mImageUri != null) {
                    val sRef: StorageReference = FirebaseStorage.getInstance().reference.child(
                        "PROFILE_IMAGE_" + System.currentTimeMillis() + "." + Constants.getFileExtension(
                            this,
                            mImageUri
                        )
                    )

                    sRef.putFile(mImageUri!!).addOnSuccessListener { task ->
                        task.metadata!!.reference!!.downloadUrl.addOnSuccessListener { uri ->
                            mImageUrl = uri.toString()
                            val name = et_edit_account_name.text.toString()
                            val phone = et_edit_account_phone.text.toString().toLong()

                            val hashMap = HashMap<String, Any>()
                            hashMap[Constants.USER_NAME] = name
                            hashMap[Constants.USER_PHONE] = phone
                            hashMap[Constants.USER_IMAGE] = mImageUrl
                            FirestoreClass().updateUserProfileData(this, hashMap)
                        }

                    }.addOnFailureListener { exception ->
                        Toast.makeText(this, exception.message, Toast.LENGTH_LONG)
                            .show()
                    }
                } else {
                    val name = et_edit_account_name.text.toString()
                    val phone = et_edit_account_phone.text.toString().toLong()
                    val hashMap = HashMap<String, Any>()
                    hashMap[Constants.USER_NAME] = name
                    hashMap[Constants.USER_PHONE] = phone
                    FirestoreClass().updateUserProfileData(this, hashMap)
                }
            }
        }
    }

    fun userUpdated(){
        finish()
    }

    private fun validateForm(): Boolean {
        return when {
            TextUtils.isEmpty(et_edit_account_name.text.toString()) -> {
                showErrorInSnackBar(resources.getString(R.string.name_cant_be_empty))
                false
            }
            TextUtils.isEmpty(et_edit_account_phone.text.toString()) -> {
                showErrorInSnackBar(resources.getString(R.string.phone_cant_be_empty))
                false
            }
            et_edit_account_phone.text.toString().length != 10-> {
                showErrorInSnackBar(resources.getString(R.string.phone_is_not_valid))
                false
            }
            else -> true
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (resultCode == Activity.RESULT_OK && requestCode == Constants.PICK_IMAGE_CODE && data!!.data != null) {
            mImageUri = data.data!!
            try {
                Glide
                    .with(this)
                    .load(mImageUri)
                    .centerCrop()
                    .placeholder(R.drawable.ic_account_placeholder)
                    .into(iv_edit_account_profile)
            } catch (e: IOException) {
                e.printStackTrace()
            }
        }
    }
}