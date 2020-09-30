import React from 'react'
import { POST_MAX_LENGTH } from 'constants/constants'
import Buttons from 'components/buttons/Buttons'
import style from './AddPost.module.css'

function AddPost({ post, changePost, addPost, clearPost, loading, error }) {
  return (
    <>
      <textarea
        value={post}
        onChange={changePost}
        maxLength={POST_MAX_LENGTH}
        className={style.addPost}
        placeholder="Add a public post"
      ></textarea>
      <Buttons
        text="Post"
        submit={addPost}
        loading={loading}
        cancel={clearPost}
        opacity={
          loading || post.length > POST_MAX_LENGTH ? 0.8 : post ? 1 : 0.8
        }
      />
      {(post.length >= POST_MAX_LENGTH || error) && (
        <div style={{ color: 'red', position: 'absolute' }}>
          {error || 'Post reached maximum limit'}
        </div>
      )}
    </>
  )
}

export default AddPost
