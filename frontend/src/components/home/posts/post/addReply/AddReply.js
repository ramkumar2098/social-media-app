import React from 'react'
import profilePic from 'images/profile.png'
import { POST_MAX_LENGTH } from 'constants/constants'
import ButtonSpinner from 'components/buttonSpinner/ButtonSpinner'
import style from './AddReply.module.css'
import { buttons } from 'components/Buttons.module.css'

function AddReply({ reply, changeReply, addReply, closeAddReply, loading }) {
  return (
    <>
      <div className={style.addReply}>
        <span>
          <img src={profilePic} alt="profile picture" />
        </span>
        <textarea
          value={reply}
          onChange={changeReply}
          maxLength={POST_MAX_LENGTH}
          placeholder="Add a reply"
          autoFocus
        />
      </div>
      <div className={buttons} style={{ marginBottom: 0 }}>
        <button
          onClick={addReply}
          disabled={loading}
          style={{
            opacity:
              loading || reply.length > POST_MAX_LENGTH ? 0.8 : reply ? 1 : 0.8,
          }}
        >
          {loading && <ButtonSpinner />}Reply
        </button>
        <button onClick={closeAddReply}>Cancel</button>
      </div>
      {reply.length >= POST_MAX_LENGTH && (
        <div style={{ color: 'red', marginLeft: '44px' }}>
          Reply reached maximum limit
        </div>
      )}
    </>
  )
}

export default AddReply
