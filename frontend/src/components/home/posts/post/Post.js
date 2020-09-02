import React, { useState } from 'react'
import profile from 'images/profile.png'
import Edit from './edit/Edit'
import PostHead from './postHead/PostHead'
import Dropdown from './dropdown/Dropdown'
import Actions from './actions/Actions'
import Reply from './reply/Reply'
import { ReactComponent as OpenDropdownCaret } from 'SVGs/OpenDropdownCaret.svg'
import { ReactComponent as CloseDropdownCaret } from 'SVGs/CloseDropdownCaret.svg'
import Replies from './replies/Replies'
import style from './Post.module.css'

function Post({ post, updatePost, deletePost }) {
  const [displayDropdown, setDisplayDropdown] = useState(false)
  const openDropdown = () => setDisplayDropdown(true)
  const closeDropdown = () => setDisplayDropdown(false)

  const [editPost, setEditPost] = useState(false)
  const edit = () => {
    setEditPost(true)
    closeDropdown()
  }
  const exitEditPost = () => setEditPost(false)

  const [editedPost, setEditedPost] = useState(post)
  const [reply, setReply] = useState('')

  const [addReply, setAddReply] = useState(false)
  const openAddReply = () => setAddReply(true)
  const closeAddReply = () => {
    setReply('')
    setAddReply(false)
  }

  const submitReply = () => {
    setReplies([...replies, reply])
    setReply('')
    setAddReply(false)
    setShowReplies(true)
  }

  const [replies, setReplies] = useState([])
  const [showReplies, setShowReplies] = useState(false)

  const addReplyToReply = replyToReply => {
    setReplies([...replies, replyToReply])
  }

  const updateReply = (reply, editedReply) => {
    const _replies = [...replies]
    const index = replies.indexOf(reply)

    _replies[index] = editedReply
    setReplies(_replies)
  }

  const deleteReply = reply => {
    const _replies = [...replies]
    const index = replies.indexOf(reply)

    _replies.splice(index, 1)
    setReplies(_replies)
  }

  return (
    <div className={style.post}>
      <a href="#" style={{ height: '100%' }}>
        <img src={profile} className={style.profilePic} alt="profile picture" />
      </a>
      <div>
        {editPost ? (
          <Edit
            editedPost={editedPost}
            changePost={e => setEditedPost(e.target.value)}
            updatePost={() => updatePost(post, editedPost)}
            exitEditPost={exitEditPost}
          />
        ) : (
          <>
            <div className={style.postContainer}>
              <PostHead openDropdown={openDropdown} />
              {displayDropdown && (
                <Dropdown
                  closeDropdown={closeDropdown}
                  edit={edit}
                  deletePost={() => deletePost(post)}
                />
              )}
              <div>{post}</div>
              <Actions openAddReply={openAddReply} />
            </div>
            {addReply && (
              <Reply
                reply={reply}
                changeReply={e => setReply(e.target.value)}
                submitReply={submitReply}
                closeAddReply={closeAddReply}
                opacity={{ opacity: post ? 1 : 0.8 }}
              />
            )}
          </>
        )}
        {replies.length > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className={style.showRepliesBtn}
          >
            {showReplies ? <CloseDropdownCaret /> : <OpenDropdownCaret />}
            <span>
              {showReplies ? 'Hide' : 'Show'}
              {replies.length > 1 ? ` ${replies.length} replies` : ' reply'}
            </span>
          </button>
        )}
        {showReplies &&
          replies.map(reply => (
            <Replies
              key={reply}
              reply={reply}
              addReplyToReply={addReplyToReply}
              updateReply={updateReply}
              deleteReply={deleteReply}
            />
          ))}
      </div>
    </div>
  )
}

export default Post
