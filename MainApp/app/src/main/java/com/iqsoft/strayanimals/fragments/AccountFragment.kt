package com.iqsoft.strayanimals.fragments

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.LinearLayoutManager
import com.bumptech.glide.Glide
import com.google.firebase.auth.FirebaseAuth
import com.iqsoft.strayanimals.R
import com.iqsoft.strayanimals.activities.EditProfileActivity
import com.iqsoft.strayanimals.activities.MainActivity
import com.iqsoft.strayanimals.activities.MapsActivity
import com.iqsoft.strayanimals.activities.SplashScreen
import com.iqsoft.strayanimals.adapters.PostListAdapter
import com.iqsoft.strayanimals.firebase.FirestoreClass
import com.iqsoft.strayanimals.models.Post
import com.iqsoft.strayanimals.models.User
import com.iqsoft.strayanimals.utils.Constants
import kotlinx.android.synthetic.main.activity_view_profile.*
import kotlinx.android.synthetic.main.fragment_account.*
import kotlinx.android.synthetic.main.fragment_account.view.*
import kotlinx.android.synthetic.main.fragment_main.*
import kotlinx.android.synthetic.main.fragment_main.view.*

private const val ARG_PARAM1 = "User"
private const val ARG_PARAM2 = "AccountPosts"

class AccountFragment : Fragment() {
    private var mUser: User? = null
    private var mAdapter: PostListAdapter? = null
    private var mAccountPostList: ArrayList<Post> = ArrayList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            mUser = it.getParcelable(ARG_PARAM1)
            mAccountPostList = it.getParcelableArrayList(ARG_PARAM2)!!
        }
    }

    @SuppressLint("SetTextI18n")
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_account, container, false)
        view.tv_account_email.text = "${resources.getText(R.string.account_email)}${mUser!!.email}"
        view.tv_account_name.text = "${resources.getText(R.string.account_name)}${mUser!!.name}"
        if (mUser!!.phone != 0L) {
            view.tv_account_phone.text =
                "${resources.getText(R.string.account_phone)}${mUser!!.phone}"
        } else {
            view.tv_account_phone.visibility = View.GONE
        }
        view.tv_account_posts.text =
            "${resources.getText(R.string.account_posts)}${mAccountPostList.size}"
        Glide.with(requireActivity())
            .load(mUser!!.photo)
            .placeholder(R.drawable.ic_account_placeholder)
            .into(view.im_account_profile)
        view.account_refresh.setProgressBackgroundColorSchemeColor(resources.getColor(R.color.black))
        view.account_refresh.setColorSchemeColors(resources.getColor(R.color.primaryColor))
        mAdapter = PostListAdapter(requireContext(), mAccountPostList)
        view.rv_account_posts.layoutManager = LinearLayoutManager(requireContext())
        view.rv_account_posts.adapter = mAdapter
        if (mAccountPostList.size > 0) {
            view.rv_account_posts.visibility = View.VISIBLE
            view.tv_account_no_posts_found.visibility = View.GONE
        }
        view.btn_account_logout.setOnClickListener{
            FirebaseAuth.getInstance().signOut()
            requireActivity().startActivity(Intent(requireActivity(), SplashScreen::class.java))
            requireActivity().finish()
        }
        view.account_refresh.setOnRefreshListener {
            Log.e("testt", "refresh")
            (activity as MainActivity).refreshAccount()
        }
        view.btn_account_edit.setOnClickListener {
            val intent = Intent(requireContext(), EditProfileActivity::class.java)
            intent.putExtra(Constants.INTENT_USER_TO_EDIT, mUser)
            startActivity(intent)
        }
        return view
    }

    companion object {
        @JvmStatic
        fun newInstance(user: User, accountPostList: ArrayList<Post>) =
            AccountFragment().apply {
                arguments = Bundle().apply {
                    putParcelable(ARG_PARAM1, user)
                    putParcelableArrayList(ARG_PARAM2, accountPostList)
                }
            }
    }

    fun updatePosts(posts: ArrayList<Post>) {
        val dif = posts.size - mAccountPostList.size
        if (dif != 0) {
            for (i in 0 until dif) {
                mAccountPostList.add(i, posts[i])
                mAdapter!!.notifyItemInserted(i)
            }
        }
        rv_account_posts.scrollToPosition(0)
        updateUI()
        account_refresh.isRefreshing = false
    }

    fun updateUser(user: User) {
        mUser = user
        (activity as MainActivity).refreshAccountPosts()
    }

    @SuppressLint("SetTextI18n")
    private fun updateUI() {
        if (mUser!!.phone != 0L) {
            tv_account_phone.text =
                "${resources.getText(R.string.account_phone)}${mUser!!.phone}"
        } else {
            tv_account_phone.visibility = View.GONE
        }
        tv_account_email.text = "${resources.getText(R.string.account_email)}${mUser!!.email}"
        tv_account_name.text = "${resources.getText(R.string.account_name)}${mUser!!.name}"
        tv_account_posts.text =
            "${resources.getText(R.string.account_posts)}${mAccountPostList.size}"
        Glide.with(requireActivity())
            .load(mUser!!.photo)
            .placeholder(R.drawable.ic_account_placeholder)
            .into(im_account_profile)
    }
}