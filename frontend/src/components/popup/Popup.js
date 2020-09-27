import React, { useRef } from 'react'
import { useAttachEvents } from 'hooks/useAttachEvents'
import Buttons from 'components/buttons/Buttons'
import style from './Popup.module.css'

function Popup({ message, remove, loading, closePopup }) {
  const popupRef = useRef()

  useAttachEvents(closePopup, popupRef)

  return (
    <div ref={popupRef} className={style.popup}>
      <div>
        <div>{message}</div>
        <Buttons
          text="Delete"
          submit={remove}
          loading={loading}
          cancel={closePopup}
          opacity={loading ? 0.8 : 1}
          autoFocus={true}
        />
      </div>
    </div>
  )
}

export default Popup
