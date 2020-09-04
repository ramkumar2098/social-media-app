import React from 'react'
import Post from './post/Post'
import style from './Posts.module.css'

function Posts({ posts, replies, ...props }) {
  return (
    posts.length > 0 && (
      <div className={style.posts}>
        {posts.map((post, i) => (
          <Post key={post} post={post} replies={replies[i]} {...props} />
        ))}
      </div>
    )
  )
}

export default Posts
