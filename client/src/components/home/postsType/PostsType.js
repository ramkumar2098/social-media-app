import React from 'react'
import style from './PostsType.module.css'

function PostsType({ postsType, changePostsType }) {
  return (
    <select
      value={postsType}
      onChange={changePostsType}
      className={style.postsType}
    >
      <option>All posts</option>
      <option>Your posts</option>
    </select>
  )
}

export default PostsType
