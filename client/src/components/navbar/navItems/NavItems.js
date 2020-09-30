import React from 'react'
import { useLogout } from 'hooks/useLogout'
import { Link } from 'react-router-dom'
import style from './NavItems.module.css'

function NavItems({ className }) {
  const logout = useLogout()

  return (
    <div className={style[className]}>
      <Link to="/people">People</Link>
      <Link to="/profile">Profile</Link>
      <button onClick={() => logout()}>Log out</button>
    </div>
  )
}

export default NavItems
