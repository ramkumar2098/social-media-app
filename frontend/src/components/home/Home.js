import React, { useEffect, useState } from 'react'
import AddPost from './addPost/AddPost'
import Posts from './posts/Posts'
import style from './Home.module.css'

function Home({ setDisplayBurger }) {
  useEffect(() => {
    setDisplayBurger(true)

    return () => setDisplayBurger(false)
  }, [])

  const [post, setPost] = useState('')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

  const addPost = () => {
    if (!post) return
    setLoading(true)

    fetch('/posts', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ post }),
    })
      .then(response => response.json())
      .then(post => {
        setPost('')
        setLoading(false)
        setPosts([post, ...posts])
      })
      .catch(console.log)
  }

  useEffect(() => {
    fetch('/posts')
      .then(response => response.json())
      .then(setPosts)
      .catch(console.log)
  }, [])

  return (
    <div className={style.home}>
      <AddPost
        post={post}
        changePost={e => setPost(e.target.value)}
        addPost={addPost}
        clearPost={() => setPost('')}
        loading={loading}
      />
      {posts.length > 0 && <Posts posts={posts} setPosts={setPosts} />}
    </div>
  )
}

export default Home
