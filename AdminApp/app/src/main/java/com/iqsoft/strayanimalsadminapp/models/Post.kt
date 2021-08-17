package com.iqsoft.strayanimalsadminapp.models

import android.os.Parcel
import android.os.Parcelable

data class Post(
    var id: String = "",
    val createdBy: String = "",
    val description: String = "",
    val image: ArrayList<String> = ArrayList(),
    val animal: String = "",
    val postedTime: Long = 0,
    val likeIdList: ArrayList<String> = ArrayList(),
    val location: Location = Location(),
    val lost: Int = 0,
    val found: Int = 0,
    val rated: Int = 0
):Parcelable {
    constructor(parcel: Parcel) : this(
        parcel.readString()!!,
        parcel.readString()!!,
        parcel.readString()!!,
        parcel.createStringArrayList()!!,
        parcel.readString()!!,
        parcel.readLong(),
        parcel.createStringArrayList()!!,
        parcel.readParcelable(Location.javaClass.classLoader)!!,
        parcel.readInt(),
        parcel.readInt(),
        parcel.readInt()
    ) {
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeString(id)
        parcel.writeString(createdBy)
        parcel.writeString(description)
        parcel.writeStringList(image)
        parcel.writeString(animal)
        parcel.writeLong(postedTime)
        parcel.writeStringList(likeIdList)
        parcel.writeParcelable(location,0)
        parcel.writeInt(lost)
        parcel.writeInt(found)
        parcel.writeInt(rated)
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<Post> {
        override fun createFromParcel(parcel: Parcel): Post {
            return Post(parcel)
        }

        override fun newArray(size: Int): Array<Post?> {
            return arrayOfNulls(size)
        }
    }
}