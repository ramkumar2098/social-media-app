import React from 'react'
import profile from 'images/profile.png'
import Spinner from 'components/spinner/Spinner'
import style from './AddReply.module.css'
import { buttons } from '../../../Buttons.module.css'

function AddReply({ reply, changeReply, addReply, closeAddReply, loading }) {
  return (
    <>
      <div className={style.addReply}>
        <span>
          <img src={profile} alt="profile picture" />
        </span>
        <textarea
          value={reply}
          onChange={changeReply}
          placeholder="Add a reply"
        />
      </div>
      <div className={buttons} style={{ marginBottom: 0 }}>
        <button
          onClick={addReply}
          disabled={loading}
          style={{ opacity: loading ? 0.8 : reply ? 1 : 0.8 }}
        >
          {loading && <Spinner />}Reply
        </button>
        <button onClick={closeAddReply}>Cancel</button>
      </div>
    </>
  )
}

export default AddReply
