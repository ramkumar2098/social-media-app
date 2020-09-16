import React, { useRef, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
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

  const [redirect, setRedirect] = useState(false)

  const logOut = () => {
    fetch('/logout', { method: 'POST' }).catch(console.log)
    setRedirect(true)
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
          <Link to="/profile">Profile</Link>
          <button onClick={logOut}>Log out</button>
          {redirect && <Redirect to="/login" />}
        </div>
      )}
    </div>
  )
}

export default Navbar
