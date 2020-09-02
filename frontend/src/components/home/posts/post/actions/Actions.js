import React from 'react'
import { ReactComponent as ThumbsUp } from 'SVGs/ThumbsUp.svg'
import { ReactComponent as ThumbsDown } from 'SVGs/ThumbsDown.svg'
import style from './Actions.module.css'

function Actions({ openAddReply }) {
  return (
    <div className={style.actions}>
      <a href="#">
        <ThumbsUp />
      </a>
      <span className={style.count}>21</span>
      <a href="#">
        <ThumbsDown />
      </a>
      <span className={style.count}>15</span>
      <span>
        <button onClick={openAddReply} className={style.replyBtn}>
          Reply
        </button>
      </span>
    </div>
  )
}

export default Actions
