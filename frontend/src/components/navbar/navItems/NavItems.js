import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Logout from 'components/logout/Logout'
import style from './NavItems.module.css'

function NavItems({ className }) {
  const [logout, setLogout] = useState(false)

  return (
    <div className={style[className]}>
      <Link to="/people">People</Link>
      <Link to="/profile">Profile</Link>
      <button onClick={() => setLogout(true)}>Log out</button>
      {logout && <Logout />}
    </div>
  )
}

export default NavItems
