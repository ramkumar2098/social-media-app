import React from 'react'
import style from './UploadAvatar.module.css'

function UploadAvatar({ uploadAvatar, loading }) {
  return (
    <>
      <label
        htmlFor="uploadAvatar"
        className={style.uploadAvatar}
        title="Upload avatar"
      >
        <div className={style.camera}></div>
      </label>
      <input
        type="file"
        value=""
        onChange={uploadAvatar}
        id={!loading ? 'uploadAvatar' : null}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </>
  )
}

export default UploadAvatar
