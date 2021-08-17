package com.iqsoft.strayanimalsadminapp

import android.annotation.SuppressLint
import java.text.SimpleDateFormat
import java.util.*

object Constants {
    const val USERS = "Users"

    const val POSTS = "Posts"
    const val POST_TIME = "postedTime"
    const val POST_RATED = "rated"

    @SuppressLint("SimpleDateFormat")
    fun getDate(milliSeconds: Long, dateFormat: String?): String? {
        // Create a DateFormatter object for displaying date in specified format.
        val formatter = SimpleDateFormat(dateFormat)

        // Create a calendar object that will convert the date and time value in milliseconds to date.
        val calendar = Calendar.getInstance()
        calendar.timeInMillis = milliSeconds
        return formatter.format(calendar.time)
    }
}