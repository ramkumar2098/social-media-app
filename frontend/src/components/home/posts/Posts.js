import React from 'react'
import Post from './post/Post'
import style from './Posts.module.css'

function Posts({ posts, ...props }) {
  return (
    posts.length > 0 && (
      <div className={style.posts}>
        {posts.map(post => (
          <Post key={post} post={post} posts={posts} {...props} />
        ))}
      </div>
    )
  )
}

export default Posts
