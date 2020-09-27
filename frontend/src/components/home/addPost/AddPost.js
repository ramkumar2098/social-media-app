import React from 'react'
import { POST_MAX_LENGTH } from 'constants/constants'
import ButtonSpinner from 'components/buttonSpinner/ButtonSpinner'
import style from './AddPost.module.css'
import { buttons } from 'components/Buttons.module.css'

function AddPost({ post, changePost, addPost, clearPost, loading }) {
  return (
    <>
      <textarea
        value={post}
        onChange={changePost}
        maxLength={POST_MAX_LENGTH}
        className={style.addPost}
        placeholder="Add a public post"
      ></textarea>
      <div className={buttons}>
        <button
          onClick={addPost}
          disabled={loading}
          style={{
            opacity:
              loading || post.length > POST_MAX_LENGTH ? 0.8 : post ? 1 : 0.8,
          }}
        >
          {loading && <ButtonSpinner />}Post
        </button>
        <button onClick={clearPost}>Cancel</button>
      </div>
      {post.length >= POST_MAX_LENGTH && (
        <div style={{ color: 'red' }}>Post reached maximum limit</div>
      )}
    </>
  )
}

export default AddPost
