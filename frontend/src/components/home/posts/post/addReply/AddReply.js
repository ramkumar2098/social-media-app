import React from 'react'
import profile from 'images/profile.png'
import style from './AddReply.module.css'
import { buttons } from '../../../Buttons.module.css'

function AddReply({ reply, changeReply, addReply, closeAddReply, opacity }) {
  return (
    <>
      <div className={style.addReply}>
        <span>
          <img src={profile} alt="profile picture" />
        </span>
        <textarea
          value={reply}
          onChange={changeReply}
          placeholder="Add a reply"
        />
      </div>
      <div className={buttons} style={{ marginBottom: 0 }}>
        <button onClick={addReply} style={{ opacity }}>
          Reply
        </button>
        <button onClick={closeAddReply}>Cancel</button>
      </div>
    </>
  )
}

export default AddReply
