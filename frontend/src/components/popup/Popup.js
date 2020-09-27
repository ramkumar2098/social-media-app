import React, { useRef, useEffect } from 'react'
import ButtonSpinner from 'components/buttonSpinner/ButtonSpinner'
import style from './Popup.module.css'
import { buttons } from 'components/Buttons.module.css'

function Popup({ message, remove, loading, closePopup }) {
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
            onClick={remove}
            disabled={loading}
            style={{ opacity: loading ? 0.8 : 1 }}
            autoFocus
          >
            {loading && <ButtonSpinner />}Delete
          </button>
          <button onClick={closePopup}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default Popup
