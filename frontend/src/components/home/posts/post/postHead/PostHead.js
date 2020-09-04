import React from 'react'
import JavascriptTimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ReactTimeAgo from 'react-time-ago'
import { ReactComponent as VerticalKebab } from 'SVGs/VerticalKebab.svg'
import style from './PostHead.module.css'

JavascriptTimeAgo.addLocale(en)

function PostHead({ userName, openDropdown }) {
  return (
    <div className={style.postHead}>
      <div>
        <a href="#">{userName}</a> <ReactTimeAgo date={Date.now()} />
      </div>
      <button onClick={openDropdown} className={style.kebab}>
        <VerticalKebab />
      </button>
    </div>
  )
}

export default PostHead
