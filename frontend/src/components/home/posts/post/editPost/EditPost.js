import React from 'react'
import { POST_MAX_LENGTH } from 'appConstants'
import Spinner from 'components/spinner/Spinner'
import style from './EditPost.module.css'
import { buttons } from '../../../Buttons.module.css'

function EditPost({
  editedPost,
  changePost,
  updatePost,
  closeEditPost,
  updatePostLoading,
}) {
  return (
    <>
      <textarea
        value={editedPost}
        onChange={changePost}
        maxLength={POST_MAX_LENGTH}
        onFocus={e => {
          e.target.value = ''
          e.target.value = editedPost
        }}
        className={style.editPost}
        placeholder="Edit your post"
        autoFocus
      />
      <div className={buttons} style={{ marginBottom: 0 }}>
        <button
          onClick={updatePost}
          disabled={updatePostLoading}
          style={{
            opacity:
              updatePostLoading || editedPost.length > POST_MAX_LENGTH
                ? 0.8
                : editedPost
                ? 1
                : 0.8,
          }}
        >
          {updatePostLoading && <Spinner />}Save
        </button>
        <button onClick={closeEditPost}>Cancel</button>
      </div>
      {editedPost.length >= POST_MAX_LENGTH && (
        <div style={{ color: 'red' }}>Post reached maximum limit</div>
      )}
    </>
  )
}

export default EditPost
