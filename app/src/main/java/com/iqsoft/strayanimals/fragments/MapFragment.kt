package com.iqsoft.strayanimals.fragments

import android.Manifest
import android.annotation.SuppressLint
import android.app.AlertDialog
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.location.LocationManager
import android.net.Uri
import androidx.fragment.app.Fragment

import android.os.Bundle
import android.os.Looper
import android.provider.Settings
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.core.content.ContextCompat.getSystemService
import com.google.android.gms.location.*

import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import com.iqsoft.strayanimals.R
import com.iqsoft.strayanimals.models.Location
import com.iqsoft.strayanimals.models.Post
import com.iqsoft.strayanimals.utils.Constants
import com.karumi.dexter.Dexter
import com.karumi.dexter.MultiplePermissionsReport
import com.karumi.dexter.PermissionToken
import com.karumi.dexter.listener.multi.MultiplePermissionsListener
import kotlinx.android.synthetic.main.fragment_map.view.*

private const val ARG_PARAM1 = "postList"

class MapFragment : Fragment() {
    private var mPostList: ArrayList<Post> = ArrayList()
    private lateinit var mFusedLocationClient: FusedLocationProviderClient
    private var mMyLocation: Location? = null
    private lateinit var mMap: GoogleMap

    private val callback = OnMapReadyCallback { googleMap ->
        mMap = googleMap
        for (i in mPostList) {
            val latLong = LatLng(i.location.latitude, i.location.longitude)
            val marker = MarkerOptions().position(latLong)
            if (i.animal == resources.getString(R.string.dog)) {
                marker.icon(
                    Constants.bitmapDescriptorFromVector(
                        requireContext(),
                        R.drawable.ic_dog_marker
                    )
                )
            } else if (i.animal == resources.getString(R.string.cat)) {
                marker.icon(
                    Constants.bitmapDescriptorFromVector(
                        requireContext(),
                        R.drawable.ic_cat_marker
                    )
                )
            }
            if (i.found == 1) {
                marker.title(resources.getString(R.string.found))
            }
            if (i.lost == 1) {
                marker.title(resources.getString(R.string.lost))
            }
            mMap.setOnMarkerClickListener { mMarker ->
                val index = mMarker.id.toString().drop(1).toInt()
                mMarker.showInfoWindow()
                Log.e(
                    "test",
                    Constants.getAddress(
                        requireActivity(),
                        mPostList[index].location.latitude,
                        mPostList[index].location.longitude
                    )
                )
                //Log.e("test", mPostList[index].description)
                true
            }
            mMap.addMarker(marker)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            mPostList = it.getParcelableArrayList(ARG_PARAM1)!!
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_map, container, false)
        view.btn_map_fragment_floating_button.setOnClickListener {
            if (!isLocationEnabled()) {
                Toast.makeText(requireContext(), "Open Location", Toast.LENGTH_SHORT).show()
                val intent = Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
                startActivity(intent)
            } else {
                Dexter.withActivity(requireActivity()).withPermissions(
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
                ).withListener(object : MultiplePermissionsListener {
                    override fun onPermissionsChecked(report: MultiplePermissionsReport?) {
                        if (report!!.areAllPermissionsGranted()) {
                            if (mMyLocation == null) {
                                requestNewLocationData()
                            } else {
                                val zoomLevel = 16f
                                val pos = LatLng(mMyLocation!!.latitude, mMyLocation!!.longitude)
                                mMap.animateCamera(
                                    CameraUpdateFactory.newLatLngZoom(
                                        pos,
                                        zoomLevel
                                    )
                                )
                            }
                        }
                    }

                    override fun onPermissionRationaleShouldBeShown(
                        p0: MutableList<com.karumi.dexter.listener.PermissionRequest>?,
                        p1: PermissionToken?
                    ) {
                        showRationDialogForPermissions()
                    }

                }).onSameThread().check()
            }
        }
        return view
    }

    private fun showRationDialogForPermissions() {
        AlertDialog.Builder(requireContext())
            .setMessage("It looks like you have turned off the permission required for this feature. It can be enabled under the Application settings")
            .setPositiveButton("GO TO SETTINGS") { _, _ ->
                try {
                    val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                    val uri = Uri.fromParts("package", requireActivity().packageName, null)
                    intent.data = uri
                    startActivity(intent)
                } catch (e: ActivityNotFoundException) {
                    e.printStackTrace()
                }
            }.setNegativeButton("Cancel") { dialog, _ ->
                dialog.dismiss()
            }.show()
    }

    @SuppressLint("MissingPermission")
    private fun requestNewLocationData() {
        val locationRequest = LocationRequest.create()
        locationRequest.priority = LocationRequest.PRIORITY_BALANCED_POWER_ACCURACY
        locationRequest.interval = 1000
        locationRequest.numUpdates = 1
        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(requireContext())
        mFusedLocationClient.requestLocationUpdates(
            locationRequest,
            mLocationCallBack,
            Looper.myLooper()!!
        )
    }

    private var mLocationCallBack = object : LocationCallback() {
        override fun onLocationResult(location: LocationResult) {
            val mLastLocation: android.location.Location = location.lastLocation
            mMyLocation = Location(mLastLocation.latitude, mLastLocation.longitude)
            val zoomLevel = 16f
            val pos = LatLng(mMyLocation!!.latitude, mMyLocation!!.longitude)
            mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(pos, zoomLevel))
        }
    }


    private fun isLocationEnabled(): Boolean {
        val locationManager =
            requireActivity().getSystemService(Context.LOCATION_SERVICE) as LocationManager
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) || locationManager.isProviderEnabled(
            LocationManager.NETWORK_PROVIDER
        )
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val mapFragment = childFragmentManager.findFragmentById(R.id.map) as SupportMapFragment?
        mapFragment?.getMapAsync(callback)
    }

    companion object {
        @JvmStatic
        fun newInstance(list: ArrayList<Post>) =
            MapFragment().apply {
                arguments = Bundle().apply {
                    putParcelableArrayList(ARG_PARAM1, list)
                }
            }
    }
}