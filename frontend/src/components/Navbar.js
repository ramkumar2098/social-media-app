import React from 'react'
import style from './Navbar.module.css'

function Navbar() {
  return (
    <div className={style.navbar}>
      <a href="/" className={style.logo}>
        Fakebook
      </a>
    </div>
  )
}

export default Navbar
