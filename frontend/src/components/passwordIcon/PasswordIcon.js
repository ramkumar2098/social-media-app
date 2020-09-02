import React from 'react'
import HidePassword from 'SVGs/HidePassword.svg'
import ShowPassword from 'SVGs/ShowPassword.svg'
import style from './PasswordIcon.module.css'

function PasswordIcon({ display, handleEvent }) {
  return (
    <img
      tabIndex="0"
      src={display === 'Hide' ? HidePassword : ShowPassword}
      onClick={handleEvent}
      onKeyUp={e => e.keyCode === 13 && handleEvent()}
      alt={display + ' password icon'}
      className={style.passwordIcon}
    />
  )
}

export default PasswordIcon
