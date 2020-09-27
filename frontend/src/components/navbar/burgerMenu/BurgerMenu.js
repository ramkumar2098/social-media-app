import React, { useEffect } from 'react'
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

  return (
    <>
      <Overlay />
      <NavItems className="burgerMenu" />
    </>
  )
}

export default BurgerMenu
