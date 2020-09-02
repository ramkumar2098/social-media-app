import React, { useState } from 'react'
import profile from 'images/profile.png'
import Edit from '../edit/Edit'
import PostHead from '../postHead/PostHead'
import Dropdown from '../dropdown/Dropdown'
import Actions from '../actions/Actions'
import Reply from '../reply/Reply'
import style from '../Post.module.css'
import style1 from './Replies.module.css'

function Replies({ reply, addReplyToReply, updateReply, deleteReply }) {
  const [displayReplyDropdown, setDisplayReplyDropdown] = useState(false)
  const openReplyDropdown = () => setDisplayReplyDropdown(true)
  const closeReplyDropdown = () => setDisplayReplyDropdown(false)

  const [editReply, setEditReply] = useState(false)
  const edit = () => {
    setEditReply(true)
    closeReplyDropdown()
  }
  const exitEditReply = () => setEditReply(false)

  const [editedReply, setEditedReply] = useState(reply)
  const [replyToReply, setReplyToReply] = useState('')

  const [addReplyToPost, setAddReplyToPost] = useState(false)
  const openAddReplyToPost = () => setAddReplyToPost(true)
  const closeAddReplyToPost = () => {
    setReplyToReply('')
    setAddReplyToPost(false)
  }

  const submitReplyToReply = () => {
    addReplyToReply(replyToReply)
    setReplyToReply('')
    closeAddReplyToPost()
  }

  return (
    <>
      <div className={style.replies}>
        <a href="#" style={{ height: '100%' }}>
          <img
            src={profile}
            className={style.profilePic}
            style={{ width: '30px' }}
            alt="profile picture"
          />
        </a>
        <div>
          {editReply ? (
            <Edit
              editedPost={editedReply}
              changePost={e => setEditedReply(e.target.value)}
              updatePost={() => updateReply(reply, editedReply)}
              exitEditPost={exitEditReply}
            />
          ) : (
            <div className={style1.replyContainer}>
              <PostHead openDropdown={openReplyDropdown} />
              {displayReplyDropdown && (
                <Dropdown
                  closeDropdown={closeReplyDropdown}
                  edit={edit}
                  deletePost={() => deleteReply(reply)}
                />
              )}
              <div>{reply}</div>
              <Actions openAddReply={openAddReplyToPost} />
              {addReplyToPost && (
                <Reply
                  reply={replyToReply}
                  changeReply={e => setReplyToReply(e.target.value)}
                  submitReply={submitReplyToReply}
                  closeAddReply={closeAddReplyToPost}
                  opacity={{ opacity: reply ? 1 : 0.8 }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Replies
