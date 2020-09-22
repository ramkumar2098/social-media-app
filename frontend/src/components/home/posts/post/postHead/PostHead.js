import React from 'react'
import { Link } from 'react-router-dom'
import JavascriptTimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ReactTimeAgo from 'react-time-ago'
import { ReactComponent as VerticalKebab } from 'SVGs/VerticalKebab.svg'
import style from './PostHead.module.css'

JavascriptTimeAgo.addLocale(en)

function PostHead({
  userID,
  userName,
  date,
  edited,
  userAuthoredThisPost,
  openDropdown,
}) {
  return (
    <div className={style.postHead}>
      <div>
        <Link to={'/profile/' + userID}>{userName}</Link>{' '}
        <span className={style.date}>
          <ReactTimeAgo date={date} /> {edited && '(edited)'}
        </span>
      </div>
      {userAuthoredThisPost && (
        <button onClick={openDropdown} className={style.kebab}>
          <VerticalKebab />
        </button>
      )}
    </div>
  )
}

export default PostHead
