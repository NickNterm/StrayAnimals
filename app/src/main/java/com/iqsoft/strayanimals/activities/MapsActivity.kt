package com.iqsoft.strayanimals.activities

import android.app.Activity
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle

import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import com.iqsoft.strayanimals.R
import com.iqsoft.strayanimals.databinding.ActivityMapsBinding
import com.google.android.gms.maps.model.CameraPosition

import com.google.android.gms.maps.GoogleMap.OnCameraChangeListener
import com.google.android.gms.maps.GoogleMap.OnCameraMoveListener
import com.google.android.gms.maps.model.Marker
import com.iqsoft.strayanimals.models.Location
import com.iqsoft.strayanimals.utils.Constants
import kotlinx.android.synthetic.main.activity_maps.*
import kotlinx.android.synthetic.main.activity_sign_in.*


class MapsActivity : AppCompatActivity(), OnMapReadyCallback {

    private lateinit var mMap: GoogleMap
    private lateinit var binding: ActivityMapsBinding

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