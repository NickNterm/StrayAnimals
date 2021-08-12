package com.iqsoft.strayanimals.activities

import android.annotation.SuppressLint
import android.content.ActivityNotFoundException
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import androidx.recyclerview.widget.LinearLayoutManager
import com.bumptech.glide.Glide
import com.iqsoft.strayanimals.R
import com.iqsoft.strayanimals.adapters.PostListAdapter
import com.iqsoft.strayanimals.firebase.FirestoreClass
import com.iqsoft.strayanimals.models.Post
import com.iqsoft.strayanimals.models.User
import com.iqsoft.strayanimals.utils.Constants
import kotlinx.android.synthetic.main.activity_view_profile.*
import kotlinx.android.synthetic.main.fragment_account.view.*
import android.widget.Toast

import android.content.Intent
import android.net.Uri


class ViewProfileActivity : AppCompatActivity() {
    private lateinit var mUserToShow: User
    private var mUserProfilePosts: ArrayList<Post> = ArrayList()
    private lateinit var mAdapter: PostListAdapter
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_view_profile)
        getIntents()
        setupActionBar()
        Glide.with(this)
            .load(mUserToShow.photo)
            .centerCrop()
            .placeholder(R.drawable.ic_account_placeholder)
            .into(iv_view_account_profile)
        updateUI()
        rv_view_account_posts.layoutManager = LinearLayoutManager(this)
        mAdapter = PostListAdapter(this, mUserProfilePosts)
        rv_view_account_posts.adapter = mAdapter
        view_account_refresh.setProgressBackgroundColorSchemeColor(resources.getColor(R.color.black))
        view_account_refresh.setColorSchemeColors(resources.getColor(R.color.primaryColor))
        view_account_refresh.setOnRefreshListener {
            FirestoreClass().readAccountPosts(this, mUserToShow.id)
        }
        btn_view_account_email.setOnClickListener {
            val intent = Intent(Intent.ACTION_SENDTO) // it's not ACTION_SEND

            intent.putExtra(Intent.EXTRA_SUBJECT, "")
            intent.putExtra(Intent.EXTRA_TEXT, "")
            intent.data = Uri.parse("mailto:${mUserToShow.email}") // or just "mailto:" for blank

            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK) // this will make such that when user returns to your app, your app is displayed, instead of the email app.

            startActivity(intent)
        }
        btn_view_account_call.setOnClickListener {
            val intent = Intent(
                Intent.ACTION_DIAL, Uri.fromParts(
                    "tel",
                    mUserToShow.phone.toString(), null
                )
            )
            startActivity(intent)
        }
    }

    fun allPostsLoaded(posts: ArrayList<Post>) {
        val dif = posts.size - mUserProfilePosts.size

        if (dif != 0) {
            for (i in 0 until dif) {
                mUserProfilePosts.add(i, posts[i])
                mAdapter.notifyItemInserted(i)
            }
        }
        rv_view_account_posts.scrollToPosition(0)
        updateUI()
        view_account_refresh.isRefreshing = false
    }

    @SuppressLint("SetTextI18n")
    private fun updateUI() {
        tv_view_account_email.text =
            "${resources.getText(R.string.account_email)}${mUserToShow.email}"
        tv_view_account_name.text = "${resources.getText(R.string.account_name)}${mUserToShow.name}"
        if (mUserToShow.phone != 0L) {
            tv_view_account_phone.text =
                "${resources.getText(R.string.account_phone)}${mUserToShow.phone}"
        }else{
            tv_view_account_phone.visibility = View.GONE
            btn_view_account_call.visibility = View.GONE
        }
        tv_view_account_posts.text =
            "${resources.getText(R.string.account_posts)}${mUserProfilePosts.size}"
        if (mUserProfilePosts.size > 0) {
            rv_view_account_posts.visibility = View.VISIBLE
            tv_view_account_no_posts_found.visibility = View.GONE
        }
    }

    private fun getIntents() {
        mUserToShow = intent.getParcelableExtra(Constants.INTENT_USER_TO_SHOW)!!
        FirestoreClass().readAccountPosts(this, mUserToShow.id)
    }

    private fun setupActionBar() {
        setSupportActionBar(toolbar_view_profile)

        val actionBar = supportActionBar!!
        actionBar.setDisplayHomeAsUpEnabled(true)
        actionBar.setHomeAsUpIndicator(R.drawable.ic_baseline_arrow_back_ios_24)
        actionBar.title = mUserToShow.name

        toolbar_view_profile.setNavigationOnClickListener { onBackPressed() }
    }
}