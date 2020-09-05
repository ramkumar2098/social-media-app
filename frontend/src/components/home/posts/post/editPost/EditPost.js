import React from 'react'
import style from './EditPost.module.css'
import { buttons } from '../../../Buttons.module.css'

function EditPost({ editedPost, changePost, updatePost, closeEditPost }) {
  return (
    <>
      <textarea
        value={editedPost}
        onChange={changePost}
        className={style.editPost}
      />
      <div className={buttons} style={{ marginBottom: 0 }}>
        <button onClick={updatePost} style={{ opacity: editedPost ? 1 : 0.8 }}>
          Save
        </button>
        <button onClick={closeEditPost}>Cancel</button>
      </div>
    </>
  )
}

export default EditPost
