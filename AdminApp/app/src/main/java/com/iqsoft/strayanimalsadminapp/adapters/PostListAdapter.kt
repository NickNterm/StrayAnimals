package com.iqsoft.strayanimalsadminapp.adapters

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.google.firebase.firestore.FirebaseFirestore
import com.iqsoft.strayanimalsadminapp.Constants
import com.iqsoft.strayanimalsadminapp.R
import com.iqsoft.strayanimalsadminapp.activities.MainActivity
import com.iqsoft.strayanimalsadminapp.models.Post
import com.iqsoft.strayanimalsadminapp.models.User
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
                    holder.itemView.tv_item_post_post_time.text = Constants.getDate(model.postedTime, "dd/MM/yyyy")
                    holder.itemView.tv_item_post_description.text = model.description
                    holder.itemView.ib_item_post_location.setOnClickListener {
                        val gmmIntentUri = Uri.parse("geo:"+model.location.latitude+","+model.location.longitude)
                        val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri)
                        mapIntent.setPackage("com.google.android.apps.maps")
                        context.startActivity(mapIntent)
                    }
                    holder.itemView.btn_post_item_approve.setOnClickListener {
                        val hashMap = HashMap<String, Any>()
                        hashMap[Constants.POST_RATED] = 1
                        mFirebase.collection(Constants.POSTS)
                            .document(model.id)
                            .update(hashMap)
                            .addOnSuccessListener {
                                list.removeAt(position)
                                (context as MainActivity).adapter.notifyItemRemoved(position)
                            }
                            .addOnFailureListener {
                                Log.e("test", it.toString())
                            }
                    }
                    holder.itemView.btn_post_item_delete.setOnClickListener {
                        mFirebase.collection(Constants.POSTS)
                            .document(model.id)
                            .delete()
                            .addOnSuccessListener {
                                list.removeAt(position)
                                (context as MainActivity).adapter.notifyItemRemoved(position)
                            }
                            .addOnFailureListener {
                                Log.e("test", it.toString())
                            }
                    }
                }
            }
    }

    override fun getItemCount(): Int {
        return list.size
    }

    class MyViewHolder(view: View) : RecyclerView.ViewHolder(view)
}