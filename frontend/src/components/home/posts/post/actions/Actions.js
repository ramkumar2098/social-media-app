import React from 'react'
import { ReactComponent as ThumbsUp } from 'SVGs/ThumbsUp.svg'
import { ReactComponent as ThumbsDown } from 'SVGs/ThumbsDown.svg'
import style from './Actions.module.css'

function Actions({
  toggleLikePost,
  userLikedThisPost,
  likes,
  toggleDislikePost,
  userDislikedThisPost,
  dislikes,
  openAddReply,
}) {
  return (
    <div className={style.actions}>
      <button
        onClick={toggleLikePost}
        title={userLikedThisPost ? 'Unlike' : 'Like'}
      >
        <ThumbsUp style={{ fill: userLikedThisPost && '#1877f2' }} />
      </button>
      <span className={style.count}>{likes > 0 && likes}</span>
      <button
        onClick={toggleDislikePost}
        title={userDislikedThisPost ? 'Remove Dislike' : 'Dislike'}
      >
        <ThumbsDown style={{ fill: userDislikedThisPost && '#1877f2' }} />
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
