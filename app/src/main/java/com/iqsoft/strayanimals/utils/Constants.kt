package com.iqsoft.strayanimals.utils

import android.app.Activity
import android.content.Intent
import android.location.Address
import android.location.Geocoder
import android.net.Uri
import android.provider.MediaStore
import android.webkit.MimeTypeMap
import android.widget.Toast
import java.io.IOException
import java.util.*

object Constants {
    const val USERS = "Users"
    const val USER_ID = "id"
    const val USER_NAME = "name"
    const val USER_EMAIL = "email"
    const val USER_PHONE = "phone"
    const val USER_IMAGE = "photo"


    const val POSTS = "Posts"
    const val POST_TIME = "postedTime"
    const val POST_CREATED_BY = "createdBy"

    const val LOCATIONS = "Locations"

    const val INTENT_USER = "User"
    const val INTENT_POSTS = "Posts"
    const val INTENT_ACCOUNT_POSTS= "accountPosts"
    const val INTENT_LOCATION = "Location"
    const val INTENT_USER_TO_SHOW = "UserToShow"
    const val INTENT_POSTS_OF_USER_TO_SHOW = "PostsOfUserToShow"
    const val INTENT_USER_TO_EDIT = "UserToEdit"


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

    fun getAddress(activity: Activity, lat: Double, lng: Double): String {
        val geocoder = Geocoder(activity, Locale.getDefault())
        try {
            val addresses: List<Address> = geocoder.getFromLocation(lat, lng, 1)
            val obj: Address = addresses[0]
            var countryName = "Location is Invalid"
            if (!obj.countryName?.trimIndent().isNullOrEmpty() && !obj.locality?.trimIndent()
                    .isNullOrEmpty()
            ) {
                countryName = obj.countryName.trimIndent() + ", " + obj.locality.trimIndent()
            }
            return countryName
        } catch (e: IOException) {
            e.printStackTrace()
            Toast.makeText(activity, e.message, Toast.LENGTH_SHORT).show()
        }
        return "NotFound"
    }
}