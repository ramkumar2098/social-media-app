import React, { useState } from 'react'
import profile from 'images/profile.png'
import EditPost from '../editPost/EditPost'
import PostHead from '../postHead/PostHead'
import Dropdown from '../dropdown/Dropdown'
import Actions from '../actions/Actions'
import AddReply from '../addReply/AddReply'
import style from '../Post.module.css'

function Reply({ reply }) {
  const [displayReplyDropdown, setDisplayReplyDropdown] = useState(false)
  const openReplyDropdown = () => setDisplayReplyDropdown(true)
  const closeReplyDropdown = () => setDisplayReplyDropdown(false)

  const [displayEditReply, setDisplayEditReply] = useState(false)
  const openEditReply = () => {
    setDisplayEditReply(true)
    closeReplyDropdown()
  }
  const closeEditReply = () => setDisplayEditReply(false)

  const [displayAddReplyToReply, setDisplayAddReplyToReply] = useState(false)
  const openAddReplyToReply = () => setDisplayAddReplyToReply(true)
  const closeAddReplyToReply = () => setDisplayAddReplyToReply(false)

  const [replyToReply, setReplyToReply] = useState('')

  return (
    <>
      <div className={style.reply}>
        <a href="#">
          <img
            src={profile}
            className={style.profilePic}
            style={{ width: '30px' }}
            alt="profile picture"
          />
        </a>
        <div>
          {displayEditReply ? (
            <EditPost closeEditPost={closeEditReply} />
          ) : (
            <div className={style.replyContainer}>
              <PostHead
                userName={reply.userName}
                date={reply.time}
                openDropdown={openReplyDropdown}
              />
              {displayReplyDropdown && (
                <Dropdown
                  closeDropdown={closeReplyDropdown}
                  openEditPost={openEditReply}
                />
              )}
              <div>{reply.reply}</div>
              <Actions
                likes={reply.likes}
                dislikes={reply.dislikes}
                openAddReply={openAddReplyToReply}
              />
              {displayAddReplyToReply && (
                <AddReply
                  reply={replyToReply}
                  changeReply={e => setReplyToReply(e.target.value)}
                  closeAddReply={closeAddReplyToReply}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Reply
