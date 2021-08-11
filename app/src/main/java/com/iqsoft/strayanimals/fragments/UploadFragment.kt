package com.iqsoft.strayanimals.fragments

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Address
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import androidx.annotation.MenuRes
import androidx.appcompat.widget.PopupMenu
import com.iqsoft.strayanimals.R
import com.iqsoft.strayanimals.activities.MapsActivity
import com.iqsoft.strayanimals.models.Location
import com.iqsoft.strayanimals.utils.Constants
import kotlinx.android.synthetic.main.fragment_upload.*
import kotlinx.android.synthetic.main.fragment_upload.view.*
import android.widget.Toast
import android.location.Geocoder
import android.net.Uri
import android.text.TextUtils
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.bumptech.glide.Glide
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageReference
import com.iqsoft.strayanimals.activities.MainActivity
import com.iqsoft.strayanimals.firebase.FirestoreClass
import com.iqsoft.strayanimals.models.Post
import org.w3c.dom.Text
import java.io.IOException
import java.util.*


class UploadFragment : Fragment() {

    private var mLocation: Location = Location()
    private var mAnimal: String = ""
    private var mImageUrl: String = ""
    private var mImageUri: Uri? = null
    private var mState: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == Constants.SELECT_LOCATION_CODE && resultCode == Activity.RESULT_OK) {

            if (data!!.hasExtra(Constants.INTENT_LOCATION)) {
                mLocation = data.getParcelableExtra(Constants.INTENT_LOCATION)!!
                tv_upload_location.setText(
                    getAddress(mLocation.latitude, mLocation.longitude)
                )
            }
        }
    }

    fun setSelectedImage(data: Uri) {
        mImageUri = data
        try {
            Glide
                .with(this)
                .load(mImageUri)
                .centerCrop()
                .placeholder(R.drawable.ic_account_placeholder)
                .into(iv_upload)
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_upload, container, false)
        view.auto_complete_animal.setOnClickListener { v: View ->
            showMenu(v, R.menu.select_animal_menu)
        }
        view.auto_complete_animal_state.setOnClickListener { v: View ->
            showMenu(v, R.menu.animal_state_menu)
        }
        view.tv_upload_location.setOnClickListener {
            startActivityForResult(
                Intent(activity, MapsActivity::class.java),
                Constants.SELECT_LOCATION_CODE
            )
        }
        view.iv_upload.setOnClickListener {
            if (ContextCompat.checkSelfPermission(
                    requireActivity(),
                    Manifest.permission.READ_EXTERNAL_STORAGE
                ) == PackageManager.PERMISSION_GRANTED
            ) {
                Constants.showImageChooser(requireActivity())
            } else {
                ActivityCompat.requestPermissions(
                    requireActivity(),
                    arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE),
                    Constants.READ_STORAGE_PERMISSION_CODE
                )
            }
        }
        view.btn_upload_upload.setOnClickListener {
            if (validateUpload()) {
                (activity as MainActivity).showProgressDialog()
                val sRef: StorageReference = FirebaseStorage.getInstance().reference.child(
                    "POST_IMAGE_" + System.currentTimeMillis() + "." + Constants.getFileExtension(
                        requireActivity(),
                        mImageUri
                    )
                )

                sRef.putFile(mImageUri!!).addOnSuccessListener { task ->
                    task.metadata!!.reference!!.downloadUrl.addOnSuccessListener { uri ->
                        mImageUrl = uri.toString()
                        val description = et_upload_description.text.toString()
                        val imageArrayList = ArrayList<String>()
                        imageArrayList.add(mImageUrl)
                        var found = 0
                        var lost = 0
                        if (mState == resources.getString(R.string.lost)) {
                            lost = 1
                        } else {
                            found = 1
                        }
                        val mPost = Post(
                            "",
                            FirestoreClass().getCurrentUserId(),
                            description,
                            imageArrayList,
                            mAnimal,
                            System.currentTimeMillis(),
                            ArrayList(),
                            mLocation,
                            lost,
                            found
                        )
                        (activity as MainActivity).uploadPost(mPost)
                    }

                }.addOnFailureListener { exception ->
                    Toast.makeText(requireContext(), exception.message, Toast.LENGTH_LONG)
                        .show()
                }
            }
        }
        return view
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == Constants.READ_STORAGE_PERMISSION_CODE) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Constants.showImageChooser(requireActivity())
            } else {
                (activity as MainActivity).showProgressDialog()
            }
        }
    }


    private fun validateUpload(): Boolean {
        return when {
            TextUtils.isEmpty(mState) -> {
                (activity as MainActivity).showErrorInSnackBar(resources.getString(R.string.select_lost_or_found))
                false
            }
            TextUtils.isEmpty(mImageUri.toString()) -> {
                (activity as MainActivity).showErrorInSnackBar(resources.getString(R.string.select_image))
                false
            }
            TextUtils.isEmpty(mAnimal) -> {
                (activity as MainActivity).showErrorInSnackBar(resources.getString(R.string.select_animal))
                false
            }
            TextUtils.isEmpty(et_upload_description.text.toString()) -> {
                (activity as MainActivity).showErrorInSnackBar(resources.getString(R.string.fill_description))
                false
            }
            TextUtils.isEmpty(tv_upload_location.text.toString()) -> {
                (activity as MainActivity).showErrorInSnackBar(resources.getString(R.string.select_location))
                false
            }
            tv_upload_location.text.toString() == "Invalid Location" -> {
                (activity as MainActivity).showErrorInSnackBar(resources.getString(R.string.select_location))
                false
            }
            else -> true
        }
    }

    private fun showMenu(v: View, @MenuRes menuRes: Int) {
        val popup = PopupMenu(requireActivity(), v)
        popup.menuInflater.inflate(menuRes, popup.menu)

        popup.setOnMenuItemClickListener { menuItem: MenuItem ->
            return@setOnMenuItemClickListener when (menuItem.itemId) {
                R.id.action_select_cat -> {
                    auto_complete_animal.setText(resources.getString(R.string.cat))
                    mAnimal = resources.getString(R.string.cat)
                    true
                }
                R.id.action_select_dog -> {
                    auto_complete_animal.setText(resources.getString(R.string.dog))
                    mAnimal = resources.getString(R.string.dog)
                    true
                }
                R.id.action_animal_found -> {
                    auto_complete_animal_state.setText(resources.getString(R.string.found))
                    mState = resources.getString(R.string.found)
                    true
                }
                R.id.action_animal_lost -> {
                    auto_complete_animal_state.setText(resources.getString(R.string.lost))
                    mState = resources.getString(R.string.lost)
                    true
                }
                else -> {
                    false
                }
            }
        }
        popup.setOnDismissListener {

        }
        popup.show()
    }

    private fun getAddress(lat: Double, lng: Double): String {
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

    companion object {
        @JvmStatic
        fun newInstance() = UploadFragment()
    }
}