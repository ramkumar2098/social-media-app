import React, { useState } from 'react'
import profile from 'images/profile.png'
import PostHead from './postHead/PostHead'
import Dropdown from './dropdown/Dropdown'
import Actions from './actions/Actions'
import style from './Post.module.css'
import { buttons } from '../../Buttons.module.css'
import { ReactComponent as OpenDropdownCaret } from 'SVGs/OpenDropdownCaret.svg'
import { ReactComponent as CloseDropdownCaret } from 'SVGs/CloseDropdownCaret.svg'
import Replies from './replies/Replies'

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

  const [addReply, setAddReply] = useState(false)
  const openAddReply = () => setAddReply(true)

  const [reply, setReply] = useState('')

  const [replies, setReplies] = useState(['asdasd asdasd asd', 'asdas'])
  const [showReplies, setShowReplies] = useState(false)

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
          <>
            <textarea
              value={editedPost}
              onChange={e => setEditedPost(e.target.value)}
              className={style.editPost}
            />
            <div className={buttons} style={{ marginBottom: 0 }}>
              <button
                onClick={() => {
                  updatePost(post, editedPost)
                }}
                style={{ opacity: editedPost ? 1 : 0.8 }}
              >
                Save
              </button>
              <button onClick={exitEditPost}>Cancel</button>
            </div>
          </>
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
              <>
                <div className={style.reply}>
                  <span>
                    <img src={profile} alt="profile picture" />
                  </span>
                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                  />
                </div>
                <div className={buttons} style={{ marginBottom: 0 }}>
                  <button
                    onClick={() => {
                      setReplies([...replies, reply])
                      setReply('')
                      setAddReply(false)
                      setShowReplies(true)
                    }}
                    style={{ opacity: post ? 1 : 0.8 }}
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => {
                      setReply('')
                      setAddReply(false)
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
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
              replies={replies}
              setReplies={setReplies}
              updateReply={updateReply}
              deleteReply={deleteReply}
            />
          ))}
      </div>
    </div>
  )
}

export default Post
