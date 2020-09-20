import React from 'react'
import { ReactComponent as Edit } from 'SVGs/Edit.svg'
import style from './Name.module.css'

function Name({ name, openEditName }) {
  return (
    <>
      <span>{name}</span>
      <button onClick={openEditName} className={style.editBtn}>
        <Edit />
      </button>
    </>
  )
}

export default Name
