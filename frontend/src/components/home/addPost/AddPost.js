import React from 'react'
import style from './AddPost.module.css'
import Spinner from 'components/spinner/Spinner'
import { buttons } from '../Buttons.module.css'

function AddPost({ post, changePost, addPost, clearPost, spinner }) {
  return (
    <>
      <textarea
        value={post}
        onChange={changePost}
        className={style.addPost}
        placeholder="Your posts are public"
      ></textarea>
      <div className={buttons}>
        <button
          onClick={addPost}
          disabled={spinner}
          style={{ opacity: spinner ? 0.8 : post ? 1 : 0.8 }}
        >
          {spinner && <Spinner />}Post
        </button>
        <button onClick={clearPost}>Cancel</button>
      </div>
    </>
  )
}

export default AddPost
