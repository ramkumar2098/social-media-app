import React from 'react'
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
        className={style.editPost}
        placeholder="Edit your post"
      />
      <div className={buttons} style={{ marginBottom: 0 }}>
        <button
          onClick={updatePost}
          disabled={updatePostLoading}
          style={{ opacity: updatePostLoading ? 0.8 : editedPost ? 1 : 0.8 }}
        >
          {updatePostLoading && <Spinner />}Save
        </button>
        <button onClick={closeEditPost}>Cancel</button>
      </div>
    </>
  )
}

export default EditPost
