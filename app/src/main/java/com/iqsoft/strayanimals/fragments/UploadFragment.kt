package com.iqsoft.strayanimals.fragments

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.iqsoft.strayanimals.R
import com.iqsoft.strayanimals.activities.MapsActivity
import com.iqsoft.strayanimals.models.Location
import com.iqsoft.strayanimals.utils.Constants
import kotlinx.android.synthetic.main.fragment_upload.*
import kotlinx.android.synthetic.main.fragment_upload.view.*

class UploadFragment : Fragment() {

    private lateinit var mLocation: Location

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == Constants.SELECT_LOCATION_CODE && resultCode == Activity.RESULT_OK) {
            if (data!!.hasExtra(Constants.INTENT_LOCATION)) {
                mLocation = data.getParcelableExtra(Constants.INTENT_LOCATION)!!
                tv_location.text = mLocation.toString()
                //TODO update tv_location
            }
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_upload, container, false)
        view.tv_location.setOnClickListener {
            startActivityForResult(
                Intent(activity, MapsActivity::class.java),
                Constants.SELECT_LOCATION_CODE
            )
        }
        return view
    }

    companion object {
        @JvmStatic
        fun newInstance() = UploadFragment()
    }
}