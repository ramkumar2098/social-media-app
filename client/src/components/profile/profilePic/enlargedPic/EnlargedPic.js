import React, { useRef } from 'react'
import { useAttachEvents } from 'hooks/useAttachEvents'
import style from './EnlargedPic.module.css'
import { overlay } from 'components/Overlay.module.css'

function EnlargedPic({ closeEnlargedPic, avatar }) {
  const enlargedPicRef = useRef()

  useAttachEvents(closeEnlargedPic, enlargedPicRef)

  return (
    <div ref={enlargedPicRef} className={overlay}>
      <button onClick={closeEnlargedPic} className={style.closeBtn}>
        x
      </button>
      <img
        src={avatar}
        className={style.enlargedAvatar}
        alt="profile picture"
      />
    </div>
  )
}

export default EnlargedPic
