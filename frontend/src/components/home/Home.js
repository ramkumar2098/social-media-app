import React, { useEffect, useState } from 'react'
import AddPost from './addPost/AddPost'
import Posts from './posts/Posts'
import style from './Home.module.css'

function Home({ userName, setDisplayBurger }) {
  useEffect(() => {
    setDisplayBurger(true)

    return () => setDisplayBurger(false)
  }, [])

  const [post, setPost] = useState('')
  const [posts, setPosts] = useState([])

  const addPost = () => {
    if (!post) return
    setPost('')
    setPosts([post, ...posts])

    fetch('/posts', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        userName,
        post,
        time: Date.now(),
        likes: 0,
        dislikes: 0,
        replies: [],
      }),
    }).catch(console.log)
  }

  const updatePost = (post, editedPost) => {
    const _posts = [...posts]
    const index = posts.indexOf(post)

    _posts[index] = editedPost
    setPosts(_posts)
  }

  const deletePost = post => {
    const _posts = [...posts]
    const index = posts.indexOf(post)

    _posts.splice(index, 1)
    setPosts(_posts)
  }

  const [replies, setReplies] = useState([])

  useEffect(() => {
    fetch('/posts')
      .then(response => response.json())
      .then(data => {
        const posts = []
        const replies = []
        data.reverse().forEach(post => {
          posts.push(post.post)
          replies.push(post.replies)
        })
        setPosts(posts)
        setReplies(replies)
      })
      .catch(console.log)
  }, [])

  return (
    <div className={style.home}>
      <AddPost
        post={post}
        changePost={e => setPost(e.target.value)}
        addPost={addPost}
        clearPost={() => setPost('')}
      />
      <Posts
        posts={posts}
        replies={replies}
        userName={userName}
        updatePost={updatePost}
        deletePost={deletePost}
      />
    </div>
  )
}

export default Home
