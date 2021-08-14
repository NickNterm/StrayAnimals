package com.iqsoft.strayanimals.fragments

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.LinearLayoutManager
import com.iqsoft.strayanimals.R
import com.iqsoft.strayanimals.activities.MainActivity
import com.iqsoft.strayanimals.adapters.PostListAdapter
import com.iqsoft.strayanimals.models.Post
import kotlinx.android.synthetic.main.fragment_main.*
import kotlinx.android.synthetic.main.fragment_main.view.*

private const val ARG_PARAM1 = "postList"

class MainFragment : Fragment() {
    private var mAdapter: PostListAdapter? = null
    private var mPostList: ArrayList<Post> = ArrayList()
    private var mFilterArray: Array<Int> = arrayOf(1, 1, 1, 1)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            mPostList = it.getParcelableArrayList(ARG_PARAM1)!!
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_main, container, false)
        view.rv_feed.layoutManager = LinearLayoutManager(activity)
        view.feed_refresh.setProgressBackgroundColorSchemeColor(resources.getColor(R.color.black))
        view.feed_refresh.setColorSchemeColors(resources.getColor(R.color.primaryColor))
        view.feed_refresh.setOnRefreshListener {
            (activity as MainActivity).refreshPosts()
        }
        mAdapter = PostListAdapter(requireContext(), mPostList)
        view.rv_feed.adapter = mAdapter
        view.filter_found.setOnCheckedChangeListener { _, _ ->
            if (view.filter_found.isCheckable) {
                mFilterArray[0] = 1
            } else {
                mFilterArray[0] = 0
            }
        }
        view.filter_lost.setOnCheckedChangeListener { _, _ ->
            if (view.filter_lost.isCheckable) {
                mFilterArray[1] = 1
            } else {
                mFilterArray[1] = 0
            }
        }
        view.filter_dog.setOnCheckedChangeListener { _, _ ->
            if (view.filter_dog.isCheckable) {
                mFilterArray[2] = 1
            } else {
                mFilterArray[2] = 0
            }
        }
        view.filter_cat.setOnCheckedChangeListener { _, _ ->
            if (view.filter_cat.isCheckable) {
                mFilterArray[3] = 1
            } else {
                mFilterArray[3] = 0
            }
        }
        view.btn_feed_apply_filters.setOnClickListener {
            Log.e("testt", mFilterArray[0].toString())
        }

        return view
    }

    fun refreshPosts(posts: ArrayList<Post>) {
        val dif = posts.size - mPostList.size
        if (dif != 0) {
            for (i in 0 until dif) {
                mPostList.add(i, posts[i])
                mAdapter!!.notifyItemInserted(i)
            }
        }
        rv_feed.scrollToPosition(0)
        feed_refresh.isRefreshing = false
    }


    companion object {
        @JvmStatic
        fun newInstance(list: ArrayList<Post>) =
            MainFragment().apply {
                arguments = Bundle().apply {
                    putParcelableArrayList(ARG_PARAM1, list)
                }
            }
    }
}