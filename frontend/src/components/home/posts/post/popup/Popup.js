import React, { useRef, useEffect } from 'react'
import Spinner from 'components/spinner/Spinner'
import { buttons } from '../../../Buttons.module.css'
import style from './Popup.module.css'

function Popup({ message, deletePost, deletePostLoading, closePopup }) {
  const popupRef = useRef()

  useEffect(() => {
    const handleEvent = e =>
      (e.keyCode === 27 || popupRef.current.isEqualNode(e.target)) &&
      closePopup()

    ;['click', 'keyup'].forEach(event =>
      window.addEventListener(event, handleEvent)
    )

    return () =>
      ['click', 'keyup'].forEach(event =>
        window.removeEventListener(event, handleEvent)
      )
  }, [])

  return (
    <div ref={popupRef} className={style.popup}>
      <div>
        <div>{message}</div>
        <div className={buttons}>
          <button
            onClick={deletePost}
            disabled={deletePostLoading}
            style={{ opacity: deletePostLoading ? 0.8 : 1 }}
          >
            {deletePostLoading && <Spinner />}Delete
          </button>
          <button onClick={closePopup}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default Popup
