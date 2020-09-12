import React, { useState } from 'react'
import { POST_MAX_LENGTH, POST_MAX_VISIBLE_LENGTH } from 'appConstants'
import profile from 'images/profile.png'
import EditPost from './editPost/EditPost'
import PostHead from './postHead/PostHead'
import Dropdown from './dropdown/Dropdown'
import Popup from './popup/Popup'
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

  const [showAll, setShowAll] = useState(
    post.post.length < POST_MAX_VISIBLE_LENGTH
  )
  const toggleReadMore = () => setShowAll(!showAll)

  return (
    <>
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
                <div>
                  {showAll
                    ? post.post
                    : post.post.slice(0, POST_MAX_VISIBLE_LENGTH)}
                </div>
                {post.post.length > POST_MAX_VISIBLE_LENGTH && (
                  <button
                    onClick={toggleReadMore}
                    className={style.readMoreBtn}
                  >
                    {showAll ? 'Show less' : 'Read more'}
                  </button>
                )}
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
