import React, { useState, useEffect } from 'react'
import profilePic from 'images/profile2.jpg'
import { useParams } from 'react-router-dom'
import EnlargedPic from './enlargedPic/EnlargedPic'
import ButtonSpinner from 'components/buttonSpinner/ButtonSpinner'
import { ReactComponent as Delete } from 'SVGs/Delete.svg'
import Popup from 'components/popup/Popup'
import UploadAvatar from './uploadAvatar/UploadAvatar'
import style from './ProfilePic.module.css'

function ProfilePic({ avatar: _avatar }) {
  const [avatar, setAvatar] = useState()
  const [enlarge, setEnlarge] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setAvatar(_avatar ? `data:image/jpeg;base64,${_avatar}` : profilePic)
  }, [_avatar])

  const compress = img => {
    const elem = document.createElement('canvas')
    const ctx = elem.getContext('2d')
    const width = 600
    const scaleFactor = width / img.width
    elem.width = width
    elem.height = img.height * scaleFactor
    ctx.drawImage(img, 0, 0, width, img.height * scaleFactor)

    return ctx.canvas.toDataURL('image/jpeg', 0.7)
  }

  function uploadAvatar(e) {
    if (!e.target.files?.length) return

    setLoading(true)

    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
      .then(dataUrl => {
        const img = new Image()
        img.src = dataUrl
        return img
      })
      .then(compress)
      .then(dataUrl => {
        if (dataUrl.length > 100_000) return alert('Image too large')

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

  const { userID } = useParams()

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
          <ButtonSpinner />
        </div>
      )}
      {!userID && avatar !== profilePic && (
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
          remove={removeAvatar}
          loading={loading}
          closePopup={() => setDisplayPopup(false)}
        />
      )}
      {!userID && (
        <UploadAvatar uploadAvatar={uploadAvatar} loading={loading} />
      )}
    </div>
  )
}

export default ProfilePic
