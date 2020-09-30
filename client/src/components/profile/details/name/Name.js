import React from 'react'
import { useParams } from 'react-router-dom'
import { ReactComponent as Edit } from 'SVGs/Edit.svg'
import style from './Name.module.css'

function Name({ name, openEditName }) {
  const { userID } = useParams()

  return (
    <>
      <span>{name}</span>
      {!userID && (
        <button onClick={openEditName} className={style.editBtn}>
          <Edit />
        </button>
      )}
    </>
  )
}

export default Name
