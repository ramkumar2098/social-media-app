import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import style from './NavItems.module.css'

function NavItems({ logOut, redirect, className }) {
  return (
    <div className={style[className]}>
      <Link to="/people">People</Link>
      <Link to="/profile">Profile</Link>
      <button onClick={logOut}>Log out</button>
      {redirect && <Redirect to="/login" />}
    </div>
  )
}

export default NavItems
