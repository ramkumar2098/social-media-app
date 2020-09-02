import React from 'react'
import profile from 'images/profile.png'
import style from './Reply.module.css'
import { buttons } from '../../../Buttons.module.css'

function Reply({ reply, changeReply, submitReply, closeAddReply, opacity }) {
  return (
    <>
      <div className={style.reply}>
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
        <button onClick={submitReply} style={{ opacity }}>
          Reply
        </button>
        <button onClick={closeAddReply}>Cancel</button>
      </div>
    </>
  )
}

export default Reply
