import React, { useEffect, useState, useRef } from 'react'
import { POST_MAX_LENGTH } from 'appConstants'
import AddPost from './addPost/AddPost'
import Posts from './posts/Posts'
import Spinner from 'components/privateRoute/spinner/Spinner'
import style from './Home.module.css'

function Home({ setDisplayBurger }) {
  useEffect(() => {
    setDisplayBurger(true)

    return () => setDisplayBurger(false)
  }, [])

  const [posts, setPosts] = useState([])
  const [postsLoading, setPostsLoading] = useState([])

  const postsRef = useRef()

  useEffect(() => {
    setPostsLoading(true)

    fetch('/posts')
      .then(response => response.json())
      .then(posts => {
        setPostsLoading(false)
        setPosts(posts)
        postsRef.current = posts

        displayPosts()
      })
      .catch(console.log)
  }, [])

  const [post, setPost] = useState('')
  const [loading, setLoading] = useState(false)

  const addPost = () => {
    if (!post || post.length > POST_MAX_LENGTH) return
    setLoading(true)

    fetch('/addPost', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ post }),
    })
      .then(response => response.json())
      .then(post => {
        post.userAuthoredThisPost = true

        setPost('')
        setLoading(false)
        postsRef.current = [post, ...postsRef.current]

        displayPosts()
      })
      .catch(console.log)
  }

  const [postsType, setPostsType] = useState(
    localStorage.getItem('postsType') || 'All posts'
  )

  const displayPosts = () => {
    const posts = postsRef.current

    setPosts(
      postsType === 'All posts'
        ? posts
        : posts.filter(({ userAuthoredThisPost }) => userAuthoredThisPost)
    )
  }

  useEffect(() => {
    postsRef.current?.length > 0 && displayPosts()
  }, [postsType])

  return (
    <div className={style.home}>
      <AddPost
        post={post}
        changePost={e => setPost(e.target.value)}
        addPost={addPost}
        clearPost={() => setPost('')}
        loading={loading}
      />
      <select
        value={postsType}
        onChange={e => {
          setPostsType(e.target.value)
          localStorage.setItem('postsType', e.target.value)
        }}
        className={style.postsType}
      >
        <option>All posts</option>
        <option>Your posts</option>
      </select>
      {posts.length > 0 ? (
        <Posts {...{ posts, setPosts, postsRef, displayPosts }} />
      ) : (
        !postsLoading && (
          <div style={{ clear: 'right', textAlign: 'center' }}>
            no posts found
          </div>
        )
      )}
      {postsLoading && <Spinner />}
    </div>
  )
}

export default Home
