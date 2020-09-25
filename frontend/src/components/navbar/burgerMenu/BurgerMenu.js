import React, { useState, useEffect } from 'react'
import Overlay from './overlay/Overlay'
import NavItems from '../navItems/NavItems'

function BurgerMenu({ closeBurgerMenu }) {
  useEffect(() => {
    const handleEvent = e =>
      (e.keyCode === 27 || !e.keyCode) && closeBurgerMenu()

    ;['click', 'keyup'].forEach(event =>
      window.addEventListener(event, handleEvent)
    )

    return () =>
      ['click', 'keyup'].forEach(event =>
        window.removeEventListener(event, handleEvent)
      )
  }, [])

  const [redirect, setRedirect] = useState(false)

  const logOut = () => {
    fetch('/logout', { method: 'POST' }).catch(console.log)
    setRedirect(true)
  }

  return (
    <>
      <Overlay />
      <NavItems logOut={logOut} redirect={redirect} className="burgerMenu" />
    </>
  )
}

export default BurgerMenu
