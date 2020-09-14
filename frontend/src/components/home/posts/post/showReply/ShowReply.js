import React from 'react'
import { ReactComponent as OpenDropdownCaret } from 'SVGs/OpenDropdownCaret.svg'
import { ReactComponent as CloseDropdownCaret } from 'SVGs/CloseDropdownCaret.svg'
import { showRepliesBtn } from '../Post.module.css'

function ShowReply({ toggleDisplayReplies, displayReplies, repliesCount }) {
  return (
    <button onClick={toggleDisplayReplies} className={showRepliesBtn}>
      {displayReplies ? <CloseDropdownCaret /> : <OpenDropdownCaret />}
      <span>
        {displayReplies ? 'Hide' : 'Show'}
        {repliesCount > 1 ? ` ${repliesCount} replies` : ' reply'}
      </span>
    </button>
  )
}

export default ShowReply
