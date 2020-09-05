import React from 'react'
import { ReactComponent as ThumbsUp } from 'SVGs/ThumbsUp.svg'
import { ReactComponent as ThumbsDown } from 'SVGs/ThumbsDown.svg'
import style from './Actions.module.css'

function Actions({ likes, dislikes, userLikedThisPost, openAddReply }) {
  return (
    <div className={style.actions}>
      <button title={userLikedThisPost ? 'Unlike' : 'Like'}>
        <ThumbsUp style={{ fill: userLikedThisPost && '#1877f2' }} />
      </button>
      <span className={style.count}>{likes > 0 && likes}</span>
      <button title="Dislike">
        <ThumbsDown />
      </button>
      <span className={style.count}>{dislikes > 0 && dislikes}</span>
      <span>
        <button onClick={openAddReply} className={style.replyBtn}>
          Reply
        </button>
      </span>
    </div>
  )
}

export default Actions
