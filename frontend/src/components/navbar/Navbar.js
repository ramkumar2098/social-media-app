import React, { useEffect, useRef, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import NavItems from './navItems/NavItems'
import Burger from './burger/Burger'
import BurgerMenu from './burgerMenu/BurgerMenu'
import style from './Navbar.module.css'

function Navbar({ displayBurger }) {
  const { push } = useHistory()

  useEffect(() => {
    window.addEventListener('storage', e => {
      if (e.key !== 'loggedIn') return
      const loggedIn = JSON.parse(e.newValue)

      push(loggedIn ? '/home' : '/login')
    })
  }, [])

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
            <NavItems className="navbar" />
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
