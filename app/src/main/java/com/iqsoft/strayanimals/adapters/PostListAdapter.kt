package com.iqsoft.strayanimals.adapters

import android.content.Context
import android.content.Intent
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.google.firebase.firestore.FirebaseFirestore
import com.iqsoft.strayanimals.R
import com.iqsoft.strayanimals.activities.ShowLocationActivity
import com.iqsoft.strayanimals.activities.ViewProfileActivity
import com.iqsoft.strayanimals.models.Post
import com.iqsoft.strayanimals.models.User
import com.iqsoft.strayanimals.utils.Constants
import kotlinx.android.synthetic.main.item_post.view.*

class PostListAdapter(
    private val context: Context,
    private var list: ArrayList<Post>
) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {
    private val mFirebase = FirebaseFirestore.getInstance()
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return MyViewHolder(LayoutInflater.from(context).inflate(R.layout.item_post, parent, false))
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        val model = list[position]
        Log.e("testt", model.toString())

        mFirebase.collection(Constants.USERS)
            .document(model.createdBy)
            .get()
            .addOnSuccessListener { document ->
                val user = document.toObject(User::class.java)!!
                if (holder is MyViewHolder) {
                    Glide.with(context)
                        .load(user.photo)
                        .centerCrop()
                        .placeholder(R.drawable.ic_account_placeholder)
                        .into(holder.itemView.iv_item_post_profile_image)
                    holder.itemView.tv_item_post_creator_name.text = user.name
                    Glide.with(context)
                        .load(model.image[0])
                        .centerCrop()
                        .placeholder(R.drawable.ic_baseline_loading)
                        .into(holder.itemView.iv_item_post_main_image)
                    holder.itemView.tv_item_post_description.text = model.description
                    if (context !is ViewProfileActivity) {
                        holder.itemView.ib_item_post_info.visibility = View.VISIBLE
                    }
                    holder.itemView.ib_item_post_info.setOnClickListener {
                        val intent = Intent(context, ViewProfileActivity::class.java)
                        intent.putExtra(Constants.INTENT_USER_TO_SHOW, user)
                        context.startActivity(intent)
                    }
                    holder.itemView.ib_item_post_location.setOnClickListener {
                        val intent = Intent(context, ShowLocationActivity::class.java)
                        intent.putExtra(Constants.INTENT_LOCATION, model.location)
                        context.startActivity(intent)
                    }
                }
            }
    }

    override fun getItemCount(): Int {
        return list.size
    }

    class MyViewHolder(view: View) : RecyclerView.ViewHolder(view)
}