package com.iqsoft.strayanimals.activities

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import com.iqsoft.strayanimals.R
import com.iqsoft.strayanimals.fragments.AccountFragment
import com.iqsoft.strayanimals.fragments.UploadFragment
import com.iqsoft.strayanimals.models.User
import com.iqsoft.strayanimals.utils.Constants
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {
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

    private fun getIntents() {
        mUser = intent.getParcelableExtra(Constants.INTENT_USER)!!
        Log.e("testt", mUser.toString())
    }
}