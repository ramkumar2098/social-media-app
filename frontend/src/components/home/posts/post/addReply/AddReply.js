import React from 'react'
import profilePic from 'images/profile.png'
import { POST_MAX_LENGTH } from 'constants/constants'
import Buttons from 'components/buttons/Buttons'
import style from './AddReply.module.css'

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
      <Buttons
        text="Reply"
        submit={addReply}
        loading={loading}
        cancel={closeAddReply}
        opacity={
          loading || reply.length > POST_MAX_LENGTH ? 0.8 : reply ? 1 : 0.8
        }
        styles={{ marginBottom: 0 }}
      />
      {reply.length >= POST_MAX_LENGTH && (
        <div style={{ color: 'red', marginLeft: '44px' }}>
          Reply reached maximum limit
        </div>
      )}
    </>
  )
}

export default AddReply
