import React from 'react'
import Post from './post/Post'
import style from './Posts.module.css'

function Posts({ posts, ...props }) {
  return (
    <div className={style.posts}>
      {posts.map(post => (
        <Post key={post._id} post={post} posts={posts} {...props} />
      ))}
    </div>
  )
}

export default Posts
