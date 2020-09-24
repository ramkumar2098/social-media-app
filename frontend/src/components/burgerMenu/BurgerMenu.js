import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Overlay from './overlay/Overlay'
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

  const [redirect, setRedirect] = useState(false)

  const logOut = () => {
    fetch('/logout', { method: 'POST' }).catch(console.log)
    setRedirect(true)
  }

  return (
    <>
      <Overlay />
      <div className={style.burgerMenu}>
        <Link to="/people">People</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={logOut}>Log out</button>
        {redirect && <Redirect to="/login" />}
      </div>
    </>
  )
}

export default BurgerMenu
