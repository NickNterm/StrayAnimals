package com.iqsoft.strayanimals.adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.iqsoft.strayanimals.R
import com.iqsoft.strayanimals.models.Post
import com.iqsoft.strayanimals.models.User
import kotlinx.android.synthetic.main.item_post.view.*

class PostListAdapter(private val context: Context, private var list: ArrayList<Post>, private var userList: ArrayList<User>):RecyclerView.Adapter<RecyclerView.ViewHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return MyViewHolder(LayoutInflater.from(context).inflate(R.layout.item_post,parent,false))
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        val model = list[position]

        if(holder is MyViewHolder){

        }
    }

    override fun getItemCount(): Int {
        return list.size
    }

    class MyViewHolder(view: View):RecyclerView.ViewHolder(view)
}