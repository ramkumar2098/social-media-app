import React, { useState } from 'react'
import { POST_MAX_LENGTH } from 'appConstants'
import { Link } from 'react-router-dom'
import profilePic from 'images/profile.png'
import EditPost from './editPost/EditPost'
import PostHead from './postHead/PostHead'
import Dropdown from './dropdown/Dropdown'
import Popup from './popup/Popup'
import Content from './content/Content'
import Actions from './actions/Actions'
import AddReply from './addReply/AddReply'
import ShowReply from './showReply/ShowReply'
import Reply from './reply/Reply'
import style from './Post.module.css'

function Post({ post, posts, setPosts }) {
  const [displayDropdown, setDisplayDropdown] = useState(false)
  const openDropdown = () => setDisplayDropdown(true)
  const closeDropdown = () => setDisplayDropdown(false)

  const [displayEditPost, setDisplayEditPost] = useState(false)
  const openEditPost = () => {
    setDisplayEditPost(true)
    setEditedPost(post.post)
    closeDropdown()
  }
  const closeEditPost = () => setDisplayEditPost(false)

  const [displayAddReply, setDisplayAddReply] = useState(false)
  const openAddReply = () => {
    setDisplayAddReply(true)
    setReply('')
  }
  const closeAddReply = () => setDisplayAddReply(false)

  const [reply, setReply] = useState('')
  const [displayReplies, setDisplayReplies] = useState(false)
  const [loading, setLoading] = useState(false)

  const addReply = () => {
    if (!reply || reply.length > POST_MAX_LENGTH) return
    setLoading(true)

    fetch('/addReply', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: post._id, reply }),
    })
      .then(response => response.json())
      .then(reply => {
        reply.userAuthoredThisReply = true
        post.replies.push(reply)

        setReply('')
        setLoading(false)
        closeAddReply()
        setPosts([...posts])
        setDisplayReplies(true)
      })
      .catch(console.log)
  }

  const [editedPost, setEditedPost] = useState(post.post)
  const [updatePostLoading, setUpdatePostLoading] = useState(false)

  const updatePost = () => {
    if (!editedPost || editedPost.length > POST_MAX_LENGTH) return
    setUpdatePostLoading(true)

    fetch('/editPost', {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: post._id, editedPost }),
    })
      .then(() => {
        post.edited = true
        post.post = editedPost

        setUpdatePostLoading(false)
        closeEditPost()
        setPosts([...posts])
      })
      .catch(console.log)
  }

  const [displayPopup, setDisplayPopup] = useState(false)
  const [deletePostLoading, setDeletePostLoading] = useState(false)

  const deletePost = () => {
    setDeletePostLoading(true)

    fetch('/deletePost', {
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: post._id }),
    })
      .then(() => {
        const postIndex = posts.findIndex(_post => _post._id === post._id)
        posts.splice(postIndex, 1)

        setDeletePostLoading(false)
        setPosts([...posts])
      })
      .catch(console.log)
  }

  const toggleLikePost = () => {
    const url = post.userLikedThisPost ? '/unlikePost' : 'likePost'

    post.likes = post.userLikedThisPost ? post.likes - 1 : post.likes + 1
    post.userLikedThisPost = !post.userLikedThisPost

    post.dislikes = post.userDislikedThisPost
      ? post.dislikes - 1
      : post.dislikes
    post.userDislikedThisPost = post.userDislikedThisPost && false

    setPosts([...posts])

    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: post._id }),
    }).catch(console.log)
  }

  const toggleDislikePost = () => {
    const url = post.userDislikedThisPost ? '/removeDislikePost' : 'dislikePost'

    post.dislikes = post.userDislikedThisPost
      ? post.dislikes - 1
      : post.dislikes + 1
    post.userDislikedThisPost = !post.userDislikedThisPost

    post.likes = post.userLikedThisPost ? post.likes - 1 : post.likes
    post.userLikedThisPost = post.userLikedThisPost && false

    setPosts([...posts])

    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: post._id }),
    }).catch(console.log)
  }

  return (
    <div className={style.post}>
      <Link to={'/profile/' + post.userID}>
        <img
          src={
            post.avatar ? `data:image/jpeg;base64,${post.avatar}` : profilePic
          }
          className={style.profilePic}
          alt="profile picture"
        />
      </Link>
      <div>
        {displayEditPost ? (
          <EditPost
            editedPost={editedPost}
            changePost={e => setEditedPost(e.target.value)}
            updatePost={updatePost}
            closeEditPost={closeEditPost}
            updatePostLoading={updatePostLoading}
          />
        ) : (
          <div className={style.postContainer}>
            <PostHead
              userID={post.userID}
              userName={post.userName}
              date={post.date}
              edited={post.edited}
              userAuthoredThisPost={post.userAuthoredThisPost}
              openDropdown={openDropdown}
            />
            {displayDropdown && (
              <Dropdown
                closeDropdown={closeDropdown}
                openEditPost={openEditPost}
                openPopup={() => setDisplayPopup(true)}
              />
            )}
            {displayPopup && (
              <Popup
                message={
                  post.replies.length
                    ? 'Delete your post and all of its replies permanently?'
                    : 'Delete your post permanently?'
                }
                deletePost={deletePost}
                deletePostLoading={deletePostLoading}
                closePopup={() => setDisplayPopup(false)}
              />
            )}
            <Content post={post.post} />
            <Actions
              toggleLikePost={toggleLikePost}
              userLikedThisPost={post.userLikedThisPost}
              likes={post.likes}
              toggleDislikePost={toggleDislikePost}
              userDislikedThisPost={post.userDislikedThisPost}
              dislikes={post.dislikes}
              openAddReply={openAddReply}
            />
            {displayAddReply && (
              <AddReply
                reply={reply}
                changeReply={e => setReply(e.target.value)}
                addReply={addReply}
                closeAddReply={closeAddReply}
                loading={loading}
              />
            )}
          </div>
        )}
        {post.replies.length > 0 && (
          <ShowReply
            toggleDisplayReplies={() => setDisplayReplies(!displayReplies)}
            displayReplies={displayReplies}
            repliesCount={post.replies.length}
          />
        )}
        {displayReplies &&
          post.replies.map(reply => (
            <Reply
              key={reply.id}
              reply={reply}
              post={post}
              posts={posts}
              setPosts={setPosts}
            />
          ))}
      </div>
    </div>
  )
}

export default Post
