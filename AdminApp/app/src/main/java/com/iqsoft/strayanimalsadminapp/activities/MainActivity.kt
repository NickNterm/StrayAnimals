package com.iqsoft.strayanimalsadminapp.activities

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.firebase.firestore.FirebaseFirestore
import com.iqsoft.strayanimalsadminapp.Constants
import com.iqsoft.strayanimalsadminapp.R
import com.iqsoft.strayanimalsadminapp.adapters.PostListAdapter
import com.iqsoft.strayanimalsadminapp.models.Post
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {
    lateinit var adapter: PostListAdapter
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        FirebaseFirestore.getInstance().collection(Constants.POSTS)
            .orderBy(Constants.POST_TIME)
            .whereEqualTo(Constants.POST_RATED,0)
            .get()
            .addOnSuccessListener { document ->
                val postList: ArrayList<Post> = ArrayList()
                for (i in document.documents) {
                    val post = i.toObject(Post::class.java)!!
                    post.id = i.id
                    postList.add(post)
                }
                if(postList.size == 0){
                    checkText.visibility = View.VISIBLE
                    rv_main.visibility = View.GONE
                }else{
                    postList.reverse()
                    rv_main.layoutManager = LinearLayoutManager(this)
                    adapter = PostListAdapter(this,postList)
                    rv_main.adapter = adapter
                }

            }.addOnFailureListener {
                checkText.visibility = View.VISIBLE
                rv_main.visibility = View.GONE
                Log.e("test", it.toString())
            }
    }
}