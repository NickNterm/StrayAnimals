package com.iqsoft.strayanimals.activities

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.core.graphics.createBitmap

import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import com.iqsoft.strayanimals.databinding.ActivityShowLocationBinding
import com.iqsoft.strayanimals.models.Location
import com.iqsoft.strayanimals.utils.Constants
import kotlinx.android.synthetic.main.activity_show_location.*
import android.graphics.Bitmap

import androidx.core.content.ContextCompat

import android.graphics.drawable.Drawable

import com.iqsoft.strayanimals.R
import android.content.Context
import android.graphics.Canvas

import androidx.annotation.DrawableRes
import androidx.core.graphics.scale

import com.google.android.gms.maps.model.BitmapDescriptor




class ShowLocationActivity : AppCompatActivity(), OnMapReadyCallback {

    private lateinit var mMap: GoogleMap
    private lateinit var binding: ActivityShowLocationBinding
    private lateinit var mLocation: Location

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        mLocation = intent.getParcelableExtra(Constants.INTENT_LOCATION)!!
        binding = ActivityShowLocationBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(toolbar_show_location)

        val actionBar = supportActionBar!!
        actionBar.setDisplayHomeAsUpEnabled(true)
        actionBar.setHomeAsUpIndicator(R.drawable.ic_baseline_arrow_back_ios_24)
        actionBar.title = Constants.getAddress(this, mLocation.latitude, mLocation.longitude)

        toolbar_show_location.setNavigationOnClickListener { onBackPressed() }

        val mapFragment = supportFragmentManager
            .findFragmentById(R.id.map) as SupportMapFragment
        mapFragment.getMapAsync(this)

    }

    override fun onMapReady(googleMap: GoogleMap) {
        mMap = googleMap

        val zoomLevel = 13.0f
        val pos = LatLng(mLocation.latitude, mLocation.longitude)
        val marker = MarkerOptions().position(pos).icon(Constants.bitmapDescriptorFromVector(this, R.drawable.ic_marker))
        mMap.addMarker(marker)
        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(pos, zoomLevel))
    }

}