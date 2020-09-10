import React, { useState } from 'react'
import Popup from '../popup/Popup'
import profile from 'images/profile.png'
import EditPost from '../editPost/EditPost'
import PostHead from '../postHead/PostHead'
import Dropdown from '../dropdown/Dropdown'
import Actions from '../actions/Actions'
import AddReply from '../addReply/AddReply'
import style from '../Post.module.css'

function Reply({ reply, post, posts, setPosts }) {
  const [displayReplyDropdown, setDisplayReplyDropdown] = useState(false)
  const openReplyDropdown = () => setDisplayReplyDropdown(true)
  const closeReplyDropdown = () => setDisplayReplyDropdown(false)

  const [displayEditReply, setDisplayEditReply] = useState(false)
  const openEditReply = () => {
    setDisplayEditReply(true)
    setEditedReply(reply.reply)
    closeReplyDropdown()
  }
  const closeEditReply = () => setDisplayEditReply(false)

  const [displayAddReplyToReply, setDisplayAddReplyToReply] = useState(false)
  const openAddReplyToReply = () => {
    setDisplayAddReplyToReply(true)
    setReplyToReply('')
  }
  const closeAddReplyToReply = () => setDisplayAddReplyToReply(false)

  const [replyToReply, setReplyToReply] = useState('')
  const [loading, setLoading] = useState(false)

  const addReplyToReply = () => {
    if (!replyToReply) return
    setLoading(true)

    fetch('/addReply', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: post._id, reply: replyToReply }),
    })
      .then(response => response.json())
      .then(reply => {
        const _post = post
        _post.replies.push(reply)

        const index = posts.findIndex(post => post._id === _post._id)
        const _posts = [...posts]
        _posts[index] = _post

        setReplyToReply('')
        setLoading(false)
        closeAddReplyToReply()
        setPosts(_posts)
      })
      .catch(console.log)
  }

  const [editedReply, setEditedReply] = useState(reply.reply)
  const [updateReplyLoading, setUpdateReplyLoading] = useState(false)

  const updateReply = () => {
    if (!editedReply) return
    setUpdateReplyLoading(true)

    fetch('/editReply', {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: post._id, id: reply.id, editedReply }),
    })
      .then(response => response.json())
      .then(_post => {
        const index = posts.findIndex(post => post._id === _post._id)
        const _posts = [...posts]
        _posts[index] = _post

        setUpdateReplyLoading(false)
        closeEditReply()
        setPosts(_posts)
      })
      .catch(console.log)
  }

  const [displayPopup, setDisplayPopup] = useState(false)
  const [deleteReplyLoading, setDeleteReplyLoading] = useState(false)

  const deleteReply = () => {
    setDeleteReplyLoading(true)

    fetch('/deleteReply', {
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: post._id, id: reply.id }),
    })
      .then(response => response.json())
      .then(_post => {
        const index = posts.findIndex(post => post._id === _post._id)
        const _posts = [...posts]
        _posts[index] = _post

        setDeleteReplyLoading(false)
        setPosts(_posts)
      })
      .catch(console.log)
  }

  const toggleLikeReply = () => {
    const url = reply.userLikedThisReply ? '/unlikeReply' : 'likeReply'

    reply.likes = reply.userLikedThisReply ? reply.likes - 1 : reply.likes + 1
    reply.userLikedThisReply = !reply.userLikedThisReply

    reply.dislikes = reply.userDislikedThisReply
      ? reply.dislikes - 1
      : reply.dislikes
    reply.userDislikedThisReply = reply.userDislikedThisReply && false

    const index = posts.findIndex(_post => _post._id === post._id)
    const _posts = [...posts]
    _posts[index] = post

    setPosts(_posts)

    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: post._id, id: reply.id }),
    }).catch(console.log)
  }

  const toggleDislikeReply = () => {
    const url = reply.userDislikedThisReply
      ? '/removeDislikeReply'
      : 'dislikeReply'

    reply.dislikes = reply.userDislikedThisReply
      ? reply.dislikes - 1
      : reply.dislikes + 1
    reply.userDislikedThisReply = !reply.userDislikedThisReply

    reply.likes = reply.userLikedThisReply ? reply.likes - 1 : reply.likes
    reply.userLikedThisReply = reply.userLikedThisReply && false

    const index = posts.findIndex(_post => _post._id === post._id)
    const _posts = [...posts]
    _posts[index] = post

    setPosts(_posts)

    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: post._id, id: reply.id }),
    }).catch(console.log)
  }

  return (
    <>
      {displayPopup && (
        <Popup
          message="Delete your reply permanently?"
          deletePost={deleteReply}
          deletePostLoading={deleteReplyLoading}
          closePopup={() => setDisplayPopup(false)}
        />
      )}
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
            <EditPost
              editedPost={editedReply}
              changePost={e => setEditedReply(e.target.value)}
              updatePost={updateReply}
              closeEditPost={closeEditReply}
              updatePostLoading={updateReplyLoading}
            />
          ) : (
            <div className={style.replyContainer}>
              <PostHead
                userName={reply.userName}
                date={reply.date}
                edited={reply.edited}
                openDropdown={openReplyDropdown}
              />
              {displayReplyDropdown && (
                <Dropdown
                  closeDropdown={closeReplyDropdown}
                  openEditPost={openEditReply}
                  openPopup={() => setDisplayPopup(true)}
                />
              )}
              <div>{reply.reply}</div>
              <Actions
                toggleLikePost={toggleLikeReply}
                userLikedThisPost={reply.userLikedThisReply}
                likes={reply.likes}
                toggleDislikePost={toggleDislikeReply}
                userDislikedThisPost={reply.userDislikedThisReply}
                dislikes={reply.dislikes}
                openAddReply={openAddReplyToReply}
              />
              {displayAddReplyToReply && (
                <AddReply
                  reply={replyToReply}
                  changeReply={e => setReplyToReply(e.target.value)}
                  addReply={addReplyToReply}
                  closeAddReply={closeAddReplyToReply}
                  loading={loading}
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
