import React from 'react'
import Spinner from 'components/spinner/Spinner'
import style from './AddPost.module.css'
import { buttons } from '../Buttons.module.css'

function AddPost({ post, changePost, addPost, clearPost, loading }) {
  return (
    <>
      <textarea
        value={post}
        onChange={changePost}
        className={style.addPost}
        placeholder="Add a public post"
      ></textarea>
      <div className={buttons}>
        <button
          onClick={addPost}
          disabled={loading}
          style={{ opacity: loading ? 0.8 : post ? 1 : 0.8 }}
        >
          {loading && <Spinner />}Post
        </button>
        <button onClick={clearPost}>Cancel</button>
      </div>
    </>
  )
}

export default AddPost
