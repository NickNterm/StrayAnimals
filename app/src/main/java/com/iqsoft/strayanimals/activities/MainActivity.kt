package com.iqsoft.strayanimals.activities

import android.app.Activity
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import com.bumptech.glide.Glide
import com.iqsoft.strayanimals.R
import com.iqsoft.strayanimals.firebase.FirestoreClass
import com.iqsoft.strayanimals.fragments.AccountFragment
import com.iqsoft.strayanimals.fragments.UploadFragment
import com.iqsoft.strayanimals.models.Post
import com.iqsoft.strayanimals.models.User
import com.iqsoft.strayanimals.utils.Constants
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.fragment_upload.*
import java.io.IOException

class MainActivity : BaseActivity() {
    private lateinit var accountFragment: AccountFragment
    private lateinit var uploadFragment: UploadFragment
    private lateinit var mainFragment: AccountFragment
    private lateinit var activeFragment: Fragment
    private lateinit var mUser: User

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        getIntents()
        accountFragment = AccountFragment.newInstance(mUser)
        uploadFragment = UploadFragment.newInstance()
        mainFragment = AccountFragment.newInstance(mUser)
        supportFragmentManager.beginTransaction()
            .add(R.id.main_activity_fragment, accountFragment, "3").hide(accountFragment).commit()
        supportFragmentManager.beginTransaction()
            .add(R.id.main_activity_fragment, uploadFragment, "2").hide(uploadFragment).commit()
        supportFragmentManager.beginTransaction()
            .add(R.id.main_activity_fragment, mainFragment, "1").commit()
        activeFragment = mainFragment
        bottom_navigation_main_activity.setOnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.home_page -> {
                    showFragment(mainFragment)
                    true
                }
                R.id.upload_page -> {
                    showFragment(uploadFragment)
                    true
                }
                R.id.account_page -> {
                    showFragment(accountFragment)
                    true
                }
                else -> false
            }
        }
    }

    private fun showFragment(MyFragment: Fragment) {
        supportFragmentManager.beginTransaction().hide(activeFragment).show(MyFragment).commit()
        activeFragment = MyFragment
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (resultCode == Activity.RESULT_OK && requestCode == Constants.PICK_IMAGE_CODE && data!!.data != null) {
            uploadFragment.setSelectedImage(data.data!!)
        }
    }

    private fun getIntents() {
        mUser = intent.getParcelableExtra(Constants.INTENT_USER)!!
        Log.e("testt", mUser.toString())
    }

    fun refreshAccount() {
        FirestoreClass().getMyUser(this)
    }

    fun userIsLoaded(user: User) {
        mUser = user
        accountFragment.updateUser(mUser)
    }

    fun uploadPost(post: Post) {
        FirestoreClass().uploadPost(this, post)
    }

    fun postUploaded() {
        hideProgressDialog()
        showFragment(accountFragment)
    }
}