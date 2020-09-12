import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import Burger from './burger/Burger'
import style from './Navbar.module.css'

function Navbar({
  displayBurger,
  openBurgerMenu,
  displayNavItems,
  displayBurgerMenu,
}) {
  const navbarRef = useRef()

  let prevScrollPos = window.pageYOffset

  window.onscroll = function () {
    if (displayBurgerMenu) return
    const currentScrollPos = window.pageYOffset

    prevScrollPos > currentScrollPos
      ? (navbarRef.current.style.top = '0')
      : (navbarRef.current.style.top = '-47px')

    prevScrollPos = currentScrollPos
  }

  return (
    <div ref={navbarRef} className={style.navbar}>
      <Link to="/home" className={style.logo}>
        FakeBook
      </Link>
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
