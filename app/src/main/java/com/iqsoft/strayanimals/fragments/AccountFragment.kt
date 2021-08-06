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
import com.bumptech.glide.Glide
import com.iqsoft.strayanimals.R
import com.iqsoft.strayanimals.activities.MainActivity
import com.iqsoft.strayanimals.activities.MapsActivity
import com.iqsoft.strayanimals.models.User
import kotlinx.android.synthetic.main.fragment_account.*
import kotlinx.android.synthetic.main.fragment_account.view.*

// TODO: Rename parameter arguments, choose names that match
// the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
private const val ARG_PARAM1 = "User"

class AccountFragment : Fragment() {
    private var mUser: User? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            mUser = it.getParcelable(ARG_PARAM1)
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
        view.tv_account_phone.text = "${resources.getText(R.string.account_phone)}${mUser!!.phone}"
        view.tv_account_posts.text = "${resources.getText(R.string.account_posts)}12"
        Glide.with(requireActivity())
            .load(mUser!!.photo)
            .placeholder(R.drawable.ic_account_placeholder)
            .into(view.im_account_profile)
        view.account_refresh.setProgressBackgroundColorSchemeColor(resources.getColor(R.color.primaryColor))
        view.account_refresh.setColorSchemeColors(resources.getColor(R.color.white))
        view.account_refresh.setOnRefreshListener {
            Log.e("testt", "refresh")
            (activity as MainActivity).refreshAccount()
        }
        view.btn_account_edit.setOnClickListener {

        }
        return view
    }

    companion object {
        @JvmStatic
        fun newInstance(user: User) =
            AccountFragment().apply {
                arguments = Bundle().apply {
                    putParcelable(ARG_PARAM1, user)
                }
            }
    }

    fun updateUser(user: User) {
        mUser = user
        Log.e("testt", "read")
        account_refresh.isRefreshing = false
        updateUI()
    }

    @SuppressLint("SetTextI18n")
    private fun updateUI(){
        tv_account_email.text = "${resources.getText(R.string.account_email)}${mUser!!.email}"
        tv_account_name.text = "${resources.getText(R.string.account_name)}${mUser!!.name}"
        tv_account_phone.text = "${resources.getText(R.string.account_phone)}${mUser!!.phone}"
        tv_account_posts.text = "${resources.getText(R.string.account_posts)}12"
        Glide.with(requireActivity())
            .load(mUser!!.photo)
            .placeholder(R.drawable.ic_account_placeholder)
            .into(im_account_profile)
    }
}