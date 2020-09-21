import React, { useState } from 'react'
import profilePic from 'images/profile2.jpg'
import EnlargedPic from './enlargedPic/EnlargedPic'
import Spinner from 'components/spinner/Spinner'
import { ReactComponent as Delete } from 'SVGs/Delete.svg'
import Popup from 'components/home/posts/post/popup/Popup'
import UploadAvatar from './uploadAvatar/UploadAvatar'
import style from './ProfilePic.module.css'

function ProfilePic({ avatar: _avatar }) {
  const [avatar, setAvatar] = useState(
    _avatar ? `data:image/jpeg;base64,${_avatar}` : profilePic
  )
  const [enlarge, setEnlarge] = useState(false)
  const [loading, setLoading] = useState(false)

  const uploadAvatar = e => {
    if (!e.target.files?.length) return
    if (e.target.files[0].size > 200_000)
      return alert('Image upload limit is 200kb')

    setLoading(true)

    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
      .then(dataUrl => {
        fetch('/uploadAvatar', {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ dataUrl }),
        })
          .then(() => {
            setLoading(false)
            setAvatar(dataUrl)
          })
          .catch(console.log)
      })
      .catch(console.log)
  }

  const removeAvatar = () => {
    setLoading(true)

    fetch('/removeAvatar', { method: 'DELETE' })
      .then(() => {
        setLoading(false)
        setAvatar(profilePic)
        setDisplayPopup(false)
      })
      .catch(console.log)
  }

  const [displayPopup, setDisplayPopup] = useState(false)

  return (
    <div className={style.profilePic}>
      <img
        src={avatar}
        onClick={() => setEnlarge(true)}
        className={style.avatar}
        title="Click to enlarge"
        alt="profile picture"
      />
      {enlarge && (
        <EnlargedPic
          closeEnlargedPic={() => setEnlarge(false)}
          avatar={avatar}
        />
      )}
      {loading && (
        <div className={style.spinner}>
          <Spinner />
        </div>
      )}
      {avatar !== profilePic && (
        <button
          onClick={() => setDisplayPopup(true)}
          className={style.removeAvatarBtn}
          title="Remove avatar"
          disabled={loading}
        >
          <Delete />
        </button>
      )}
      {displayPopup && (
        <Popup
          message="Delete your profile picture?"
          deletePost={removeAvatar}
          deletePostLoading={loading}
          closePopup={() => setDisplayPopup(false)}
        />
      )}
      <UploadAvatar uploadAvatar={uploadAvatar} loading={loading} />
    </div>
  )
}

export default ProfilePic
