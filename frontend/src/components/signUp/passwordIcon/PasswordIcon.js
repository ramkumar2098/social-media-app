import React from 'react'
import HidePasswordIcon from 'SVGs/HidePasswordIcon.svg'
import ShowPasswordIcon from 'SVGs/ShowPasswordIcon.svg'
import style from './PasswordIcon.module.css'

function PasswordIcon({ display, handleEvent }) {
  return (
    <img
      tabIndex="0"
      src={display === 'Hide' ? HidePasswordIcon : ShowPasswordIcon}
      onClick={handleEvent}
      onKeyUp={e => e.keyCode === 13 && handleEvent()}
      alt={display + ' password icon'}
      className={style.passwordIcon}
    />
  )
}

export default PasswordIcon
