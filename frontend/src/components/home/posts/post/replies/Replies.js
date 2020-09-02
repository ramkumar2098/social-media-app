import React, { useState } from 'react'
import profile from 'images/profile.png'
import PostHead from '../postHead/PostHead'
import Dropdown from '../dropdown/Dropdown'
import Actions from '../actions/Actions'
import style from '../Post.module.css'
import style1 from './Replies.module.css'
import { buttons } from '../../../Buttons.module.css'

function Replies({ reply, replies, setReplies, updateReply, deleteReply }) {
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
  const closeAddReplyToPost = () => setAddReplyToPost(false)

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
            <>
              <textarea
                value={editedReply}
                onChange={e => setEditedReply(e.target.value)}
                className={style.editPost}
              />
              <div className={buttons} style={{ marginBottom: 0 }}>
                <button
                  onClick={() => updateReply(reply, editedReply)}
                  style={{ opacity: editedReply ? 1 : 0.8 }}
                >
                  Save
                </button>
                <button onClick={exitEditReply}>Cancel</button>
              </div>
            </>
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
                <>
                  <div className={style.reply}>
                    <span>
                      <img src={profile} alt="profile picture" />
                    </span>
                    <textarea
                      value={replyToReply}
                      onChange={e => setReplyToReply(e.target.value)}
                      placeholder="Add a reply"
                    />
                  </div>
                  <div className={buttons} style={{ marginBottom: 0 }}>
                    <button
                      onClick={() => {
                        setReplies([...replies, replyToReply])
                        setReplyToReply('')
                        closeAddReplyToPost()
                      }}
                      style={{ opacity: reply ? 1 : 0.8 }}
                    >
                      Reply
                    </button>
                    <button onClick={closeAddReplyToPost}>Cancel</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Replies
