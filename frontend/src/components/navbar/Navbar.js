import React from 'react'
import Burger from './burger/Burger'
import style from './Navbar.module.css'

function Navbar({ displayBurger, openBurgerMenu, displayNavItems }) {
  return (
    <div className={style.navbar}>
      <a href="/" className={style.logo}>
        Fakebook
      </a>
      {displayBurger && !displayNavItems && (
        <Burger openBurgerMenu={openBurgerMenu} />
      )}
      {displayBurger && displayNavItems && (
        <div className={style.navItems}>
          <a href="#">Profile</a>
          <a href="#">Log out</a>
        </div>
      )}
    </div>
  )
}

export default Navbar
