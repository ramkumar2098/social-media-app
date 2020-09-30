import React from 'react'
import { POST_MAX_LENGTH } from 'constants/constants'
import Buttons from 'components/buttons/Buttons'
import style from './EditPost.module.css'

function EditPost({
  editedPost,
  changePost,
  updatePost,
  closeEditPost,
  updatePostLoading,
  error,
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
      <Buttons
        text="Save"
        submit={updatePost}
        loading={updatePostLoading}
        cancel={closeEditPost}
        opacity={
          updatePostLoading || editedPost.length > POST_MAX_LENGTH
            ? 0.8
            : editedPost
            ? 1
            : 0.8
        }
        styles={{ marginBottom: 0 }}
      />
      {(editedPost.length >= POST_MAX_LENGTH || error) && (
        <div style={{ color: 'red' }}>
          {error || 'Post reached maximum limit'}
        </div>
      )}
    </>
  )
}

export default EditPost
