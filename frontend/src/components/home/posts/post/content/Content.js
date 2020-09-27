import React, { useState } from 'react'
import { POST_MAX_VISIBLE_LENGTH } from 'constants/constants'
import { readMoreBtn } from '../Post.module.css'

function Content({ post }) {
  const [showAll, setShowAll] = useState(post.length < POST_MAX_VISIBLE_LENGTH)

  return (
    <>
      <div>{showAll ? post : post.slice(0, POST_MAX_VISIBLE_LENGTH)}</div>
      {post.length > POST_MAX_VISIBLE_LENGTH && (
        <button onClick={() => setShowAll(!showAll)} className={readMoreBtn}>
          {showAll ? 'Show less' : 'Read more'}
        </button>
      )}
    </>
  )
}

export default Content
