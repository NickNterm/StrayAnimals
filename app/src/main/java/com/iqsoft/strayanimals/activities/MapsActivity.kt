package com.iqsoft.strayanimals.activities

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.app.AlertDialog
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.location.LocationManager
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Looper
import android.provider.Settings
import android.widget.Toast
import com.google.android.gms.location.*
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.iqsoft.strayanimals.R
import com.iqsoft.strayanimals.databinding.ActivityMapsBinding
import com.iqsoft.strayanimals.models.Location
import com.iqsoft.strayanimals.utils.Constants
import com.karumi.dexter.Dexter
import com.karumi.dexter.MultiplePermissionsReport
import com.karumi.dexter.PermissionToken
import com.karumi.dexter.listener.multi.MultiplePermissionsListener
import kotlinx.android.synthetic.main.activity_maps.*


class MapsActivity : AppCompatActivity(), OnMapReadyCallback {

    private lateinit var mMap: GoogleMap
    private lateinit var binding: ActivityMapsBinding
    private lateinit var mFusedLocationClient: FusedLocationProviderClient
    private var mMyLocation: Location? = null


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMapsBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setupActionBar()
        val mapFragment = supportFragmentManager
            .findFragmentById(R.id.map) as SupportMapFragment
        mapFragment.getMapAsync(this)

        btn_maps_select.setOnClickListener {
            val location =
                Location(mMap.cameraPosition.target.latitude, mMap.cameraPosition.target.longitude)
            val intent = Intent()
            intent.putExtra(Constants.INTENT_LOCATION, location)
            setResult(Activity.RESULT_OK, intent)
            finish()
        }
        ib_maps_my_location.setOnClickListener {
            if (!isLocationEnabled()) {
                Toast.makeText(this, "Open Location", Toast.LENGTH_SHORT).show()
                val intent = Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
                startActivity(intent)
            } else {
                Dexter.withActivity(this).withPermissions(
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
                ).withListener(object : MultiplePermissionsListener {
                    override fun onPermissionsChecked(report: MultiplePermissionsReport?) {
                        if (report!!.areAllPermissionsGranted()) {
                            if(mMyLocation==null){
                                requestNewLocationData()
                            }else{
                                val zoomLevel = 13.0f
                                val pos = LatLng(mMyLocation!!.latitude, mMyLocation!!.longitude)
                                mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(pos, zoomLevel))
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
    }

    private fun showRationDialogForPermissions() {
        AlertDialog.Builder(this)
            .setMessage("It looks like you have turned off the permission required for this feature. It can be enabled under the Application settings")
            .setPositiveButton("GO TO SETTINGS") { _, _ ->
                try {
                    val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                    val uri = Uri.fromParts("package", packageName, null)
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
        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
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
            val zoomLevel = 13.0f
            val pos = LatLng(mMyLocation!!.latitude, mMyLocation!!.longitude)
            mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(pos, zoomLevel))
        }
    }


    private fun isLocationEnabled(): Boolean {
        val locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) || locationManager.isProviderEnabled(
            LocationManager.NETWORK_PROVIDER
        )
    }

    override fun onMapReady(googleMap: GoogleMap) {
        mMap = googleMap
    }

    private fun setupActionBar() {
        setSupportActionBar(toolbar_maps)

        val actionBar = supportActionBar!!
        actionBar.setDisplayHomeAsUpEnabled(true)
        actionBar.setHomeAsUpIndicator(R.drawable.ic_baseline_arrow_back_ios_24)

        toolbar_maps.setNavigationOnClickListener { onBackPressed() }
    }
}