import React from 'react'
import style from './Header.module.css'

function Header({ header }) {
  return <div className={style.header}>{header}</div>
}

export default Header
