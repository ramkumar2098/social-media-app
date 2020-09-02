import React from 'react'
import style from './Edit.module.css'
import { buttons } from '../../../Buttons.module.css'

function Edit({ editedPost, changePost, updatePost, exitEditPost }) {
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
        <button onClick={exitEditPost}>Cancel</button>
      </div>
    </>
  )
}

export default Edit
