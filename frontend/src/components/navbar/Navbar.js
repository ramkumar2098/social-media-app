import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import NavItems from './navItems/NavItems'
import BurgerMenu from './burgerMenu/BurgerMenu'
import style from './Navbar.module.css'
import Burger from './burger/Burger'

function Navbar({ displayBurger }) {
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
    setRedirect(true)

    fetch('/logout', { method: 'POST' })
      .then(() => setRedirect(false))
      .catch(console.log)
  }

  const mediaQ = window.matchMedia('(min-width: 700px)')
  const [largeScreen, setLargeScreen] = useState(mediaQ.matches)
  mediaQ.onchange = () => setLargeScreen(mediaQ.matches)

  const [displayBurgerMenu, setDisplayBurgerMenu] = useState(false)

  return (
    <>
      <div ref={navbarRef} className={style.navbar}>
        <Link to="/home" className={style.logo}>
          FakeBook
        </Link>
        {displayBurger &&
          (largeScreen ? (
            <NavItems logOut={logOut} redirect={redirect} className="navbar" />
          ) : (
            <Burger openBurgerMenu={() => setDisplayBurgerMenu(true)} />
          ))}
      </div>
      {displayBurgerMenu && !largeScreen && (
        <BurgerMenu closeBurgerMenu={() => setDisplayBurgerMenu(false)} />
      )}
    </>
  )
}

export default Navbar
