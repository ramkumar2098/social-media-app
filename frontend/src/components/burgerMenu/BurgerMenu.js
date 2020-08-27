import React, { useEffect } from 'react'
import Overlay from '../overlay/Overlay'
import style from './BurgerMenu.module.css'

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
      <div className={style.burgerMenu}>
        <a href="#">Profile</a>
        <a href="#">Log out</a>
      </div>
    </>
  )
}

export default BurgerMenu
