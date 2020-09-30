import React from 'react'
import profilePic from 'images/profile2.jpg'
import { Link } from 'react-router-dom'
import style from './Person.module.css'

function Person({ person }) {
  return (
    <div className={style.person}>
      <img
        src={
          person.avatar ? `data:image/jpeg;base64,${person.avatar}` : profilePic
        }
        className={style.profilePic}
        alt="Profile picture"
      />
      <span className={style.name}>{person.name}</span>
      <Link to={'/profile/' + person._id} className={style.overlay}></Link>
    </div>
  )
}

export default Person
