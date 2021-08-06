package com.iqsoft.strayanimals.utils

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.provider.MediaStore
import android.webkit.MimeTypeMap

object Constants {
    const val USERS = "Users"
    const val USER_ID = "id"
    const val USER_NAME = "name"
    const val USER_EMAIL = "email"

    const val POSTS = "Posts"

    const val LOCATIONS = "Locations"

    const val INTENT_USER = "User"
    const val INTENT_LOCATION = "Location"

    const val SELECT_LOCATION_CODE = 2
    const val READ_STORAGE_PERMISSION_CODE = 3
    const val PICK_IMAGE_CODE = 4

    fun showImageChooser(activity: Activity) {
        val galleryIntent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
        activity.startActivityForResult(galleryIntent, PICK_IMAGE_CODE)
    }

    fun getFileExtension(activity: Activity, uri: Uri?): String? {
        return MimeTypeMap.getSingleton()
            .getExtensionFromMimeType(activity.contentResolver.getType(uri!!))
    }
}