import React, { useEffect, useRef } from 'react'
import Burger from './burger/Burger'
import style from './Navbar.module.css'

function Navbar({
  displayBurger,
  openBurgerMenu,
  displayNavItems,
  displayBurgerMenu,
}) {
  const navbarRef = useRef()

  useEffect(() => {
    let prevScrollPos = window.pageYOffset

    window.onscroll = function () {
      if (displayBurgerMenu) return
      const currentScrollPos = window.pageYOffset

      prevScrollPos > currentScrollPos
        ? (navbarRef.current.style.top = '0')
        : (navbarRef.current.style.top = '-47px')

      prevScrollPos = currentScrollPos
    }
  }, [displayBurgerMenu])

  return (
    <div ref={navbarRef} className={style.navbar}>
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
