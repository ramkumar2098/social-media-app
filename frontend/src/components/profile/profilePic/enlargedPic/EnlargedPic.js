import React, { useRef, useEffect } from 'react'
import style from './EnlargedPic.module.css'

function EnlargedPic({ closeEnlargedPic, avatar }) {
  const enlargedPicRef = useRef()

  useEffect(() => {
    const handleEvent = e =>
      (e.keyCode === 27 || enlargedPicRef.current.isEqualNode(e.target)) &&
      closeEnlargedPic()

    ;['click', 'keyup'].forEach(event =>
      window.addEventListener(event, handleEvent)
    )

    return () =>
      ['click', 'keyup'].forEach(event =>
        window.removeEventListener(event, handleEvent)
      )
  }, [])

  return (
    <div ref={enlargedPicRef} className={style.enlargedPic}>
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
