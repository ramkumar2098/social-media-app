import React, { useState } from 'react'
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
    closeDropdown()
  }
  const closeEditPost = () => setDisplayEditPost(false)

  const [displayAddReply, setDisplayAddReply] = useState(false)
  const openAddReply = () => setDisplayAddReply(true)
  const closeAddReply = () => setDisplayAddReply(false)

  const [reply, setReply] = useState('')
  const [displayReplies, setDisplayReplies] = useState(false)
  const [loading, setLoading] = useState(false)

  const addReply = () => {
    if (!reply) return
    setLoading(true)

    fetch('/replies', {
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
        setPosts(_posts)
      })
      .catch(console.log)
  }

  return (
    <div className={style.post}>
      <a href="#">
        <img src={profile} className={style.profilePic} alt="profile picture" />
      </a>
      <div>
        {displayEditPost ? (
          <EditPost closeEditPost={closeEditPost} />
        ) : (
          <>
            <div className={style.postContainer}>
              <PostHead
                userName={post.userName}
                date={post.time}
                openDropdown={openDropdown}
              />
              {displayDropdown && (
                <Dropdown
                  closeDropdown={closeDropdown}
                  openEditPost={openEditPost}
                  // deletePost
                />
              )}
              <div>{post.post}</div>
              <Actions
                likes={post.likes}
                dislikes={post.dislikes}
                userLikedThisPost={post.userLikedThisPost}
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
          post.replies.map(reply => <Reply key={reply.id} reply={reply} />)}
      </div>
    </div>
  )
}

export default Post
