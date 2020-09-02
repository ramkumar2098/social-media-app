import React from 'react'
import style from './AddPost.module.css'
import { buttons } from '../Buttons.module.css'

function AddPost({ post, changePost, addPost, clearPost }) {
  return (
    <>
      <textarea
        value={post}
        onChange={changePost}
        className={style.addPost}
        placeholder="Your posts are public"
      ></textarea>
      <div className={buttons}>
        <button onClick={addPost} style={{ opacity: post ? 1 : 0.8 }}>
          Post
        </button>
        <button onClick={clearPost}>Cancel</button>
      </div>
    </>
  )
}

export default AddPost
