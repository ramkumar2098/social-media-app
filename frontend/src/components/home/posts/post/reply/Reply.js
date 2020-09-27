import React, { useState } from 'react'
import { POST_MAX_LENGTH } from 'appConstants'
import { Link } from 'react-router-dom'
import profilePic from 'images/profile.png'
import EditPost from '../editPost/EditPost'
import PostHead from '../postHead/PostHead'
import Dropdown from '../dropdown/Dropdown'
import Popup from 'components/popup/Popup'
import Content from '../content/Content'
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
    if (!replyToReply || replyToReply.length > POST_MAX_LENGTH) return
    setLoading(true)

    fetch('/addReply', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: post._id, reply: replyToReply }),
    })
      .then(response => response.json())
      .then(reply => {
        reply.userAuthoredThisReply = true
        post.replies.push(reply)

        setReplyToReply('')
        setLoading(false)
        closeAddReplyToReply()
        setPosts([...posts])
      })
      .catch(console.log)
  }

  const [editedReply, setEditedReply] = useState(reply.reply)
  const [updateReplyLoading, setUpdateReplyLoading] = useState(false)

  const updateReply = () => {
    if (!editedReply || editedReply.length > POST_MAX_LENGTH) return
    setUpdateReplyLoading(true)

    fetch('/editReply', {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: post._id, id: reply.id, editedReply }),
    })
      .then(() => {
        reply.edited = true
        reply.reply = editedReply

        setUpdateReplyLoading(false)
        closeEditReply()
        setPosts([...posts])
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
      .then(() => {
        const replyIndex = post.replies.findIndex(
          _reply => _reply.id === reply.id
        )
        post.replies.splice(replyIndex, 1)

        setDeleteReplyLoading(false)
        setPosts([...posts])
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

    setPosts([...posts])

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

    setPosts([...posts])

    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: post._id, id: reply.id }),
    }).catch(console.log)
  }

  return (
    <div className={style.reply}>
      <Link to={'/profile/' + reply.userID}>
        <img
          src={
            reply.avatar ? `data:image/jpeg;base64,${reply.avatar}` : profilePic
          }
          className={style.profilePic}
          style={{ width: '30px', height: '30px' }}
          alt="profile picture"
        />
      </Link>
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
              userID={reply.userID}
              userName={reply.userName}
              date={reply.date}
              edited={reply.edited}
              userAuthoredThisPost={reply.userAuthoredThisReply}
              openDropdown={openReplyDropdown}
            />
            {displayReplyDropdown && (
              <Dropdown
                closeDropdown={closeReplyDropdown}
                openEditPost={openEditReply}
                openPopup={() => setDisplayPopup(true)}
              />
            )}
            {displayPopup && (
              <Popup
                message="Delete your reply permanently?"
                remove={deleteReply}
                loading={deleteReplyLoading}
                closePopup={() => setDisplayPopup(false)}
              />
            )}
            <Content post={reply.reply} />
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
  )
}

export default Reply
