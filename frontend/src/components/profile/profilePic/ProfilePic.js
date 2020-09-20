import React, { useState } from 'react'
import profilePic from 'images/profile2.png'
import Spinner from 'components/spinner/Spinner'
import EnlargedPic from './enlargedPic/EnlargedPic'
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

  return (
    <div className={style.profilePic}>
      <img
        src={avatar}
        onClick={() => setEnlarge(true)}
        className={style.avatar}
        alt="profile picture"
      />
      {loading && (
        <div className={style.spinner}>
          <Spinner />
        </div>
      )}
      {enlarge && (
        <EnlargedPic
          closeEnlargedPic={() => setEnlarge(false)}
          avatar={avatar}
        />
      )}
      <label htmlFor="uploadAvatar" className={style.background}>
        <div className={style.camera}></div>
      </label>
      <input
        type="file"
        onChange={uploadAvatar}
        id={!loading ? 'uploadAvatar' : null}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default ProfilePic
