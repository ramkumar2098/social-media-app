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

  const addPost = () => {
    if (!post) return
    setPost('')
    setPosts([post, ...posts])
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

  return (
    <div className={style.home}>
      <AddPost
        post={post}
        changePost={e => setPost(e.target.value)}
        addPost={addPost}
        clearPost={() => setPost('')}
      />
      <Posts posts={posts} updatePost={updatePost} deletePost={deletePost} />
    </div>
  )
}

export default Home
