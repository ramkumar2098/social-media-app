import React, { useState } from 'react'
import Popup from './popup/Popup'
import profile from 'images/profile.png'
import EditPost from './editPost/EditPost'
import PostHead from './postHead/PostHead'
import Dropdown from './dropdown/Dropdown'
import Actions from './actions/Actions'
import AddReply from './addReply/AddReply'
import { ReactComponent as OpenDropdownCaret } from 'SVGs/OpenDropdownCaret.svg'
import { ReactComponent as CloseDropdownCaret } from 'SVGs/CloseDropdownCaret.svg'
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
    if (!reply) return
    setLoading(true)

    fetch('/addReply', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: post._id, reply }),
    })
      .then(response => response.json())
      .then(reply => {
        const _post = post
        _post.replies.push(reply)

        const index = posts.findIndex(post => post._id === _post._id)
        const _posts = [...posts]
        _posts[index] = _post

        setReply('')
        setLoading(false)
        closeAddReply()
        setPosts(_posts)
        setDisplayReplies(true)
      })
      .catch(console.log)
  }

  const [editedPost, setEditedPost] = useState(post.post)
  const [updatePostLoading, setUpdatePostLoading] = useState(false)

  const updatePost = () => {
    if (!editedPost) return
    setUpdatePostLoading(true)

    fetch('/editPost', {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: post._id, editedPost }),
    })
      .then(() => {
        const _post = post
        _post.post = editedPost
        _post.edited = true

        const index = posts.findIndex(post => post._id === _post._id)
        const _posts = [...posts]
        _posts[index] = _post

        setUpdatePostLoading(false)
        closeEditPost()
        setPosts(_posts)
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
        const _post = post
        const _posts = posts.filter(post => post._id !== _post._id)

        setDeletePostLoading(false)
        setPosts(_posts)
      })
      .catch(console.log)
  }

  const toggleLikePost = () => {
    const url = post.userLikedThisPost ? '/unlikePost' : 'likePost'

    const _post = post
    _post.likes = post.userLikedThisPost ? post.likes - 1 : post.likes + 1
    _post.userLikedThisPost = !post.userLikedThisPost

    _post.dislikes = post.userDislikedThisPost
      ? post.dislikes - 1
      : post.dislikes
    _post.userDislikedThisPost = post.userDislikedThisPost && false

    const index = posts.findIndex(post => post._id === _post._id)
    const _posts = [...posts]
    _posts[index] = _post

    setPosts(_posts)

    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: post._id }),
    }).catch(console.log)
  }

  const toggleDislikePost = () => {
    const url = post.userDislikedThisPost ? '/removeDislikePost' : 'dislikePost'

    const _post = post
    _post.dislikes = post.userDislikedThisPost
      ? post.dislikes - 1
      : post.dislikes + 1
    _post.userDislikedThisPost = !post.userDislikedThisPost

    _post.likes = post.userLikedThisPost ? post.likes - 1 : post.likes
    _post.userLikedThisPost = post.userLikedThisPost && false

    const index = posts.findIndex(post => post._id === _post._id)
    const _posts = [...posts]
    _posts[index] = _post

    setPosts(_posts)

    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: post._id }),
    }).catch(console.log)
  }

  return (
    <>
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
      <div className={style.post}>
        <a href="#">
          <img
            src={profile}
            className={style.profilePic}
            alt="profile picture"
          />
        </a>
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
            <>
              <div className={style.postContainer}>
                <PostHead
                  userName={post.userName}
                  date={post.date}
                  edited={post.edited}
                  openDropdown={openDropdown}
                />
                {displayDropdown && (
                  <Dropdown
                    closeDropdown={closeDropdown}
                    openEditPost={openEditPost}
                    openPopup={() => setDisplayPopup(true)}
                  />
                )}
                <div>{post.post}</div>
                <Actions
                  toggleLikePost={toggleLikePost}
                  userLikedThisPost={post.userLikedThisPost}
                  likes={post.likes}
                  toggleDislikePost={toggleDislikePost}
                  userDislikedThisPost={post.userDislikedThisPost}
                  dislikes={post.dislikes}
                  openAddReply={openAddReply}
                />
              </div>
              {displayAddReply && (
                <AddReply
                  reply={reply}
                  changeReply={e => setReply(e.target.value)}
                  addReply={addReply}
                  closeAddReply={closeAddReply}
                  loading={loading}
                />
              )}
            </>
          )}
          {post.replies.length > 0 && (
            <button
              onClick={() => setDisplayReplies(!displayReplies)}
              className={style.showRepliesBtn}
            >
              {displayReplies ? <CloseDropdownCaret /> : <OpenDropdownCaret />}
              <span>
                {displayReplies ? 'Hide' : 'Show'}
                {post.replies.length > 1
                  ? ` ${post.replies.length} replies`
                  : ' reply'}
              </span>
            </button>
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
    </>
  )
}

export default Post
