import React, { useEffect } from 'react'
import { ReactComponent as Edit } from 'SVGs/Edit.svg'
import { ReactComponent as Delete } from 'SVGs/Delete.svg'
import style from './Dropdown.module.css'

function Dropdown({ closeDropdown, openEditPost, deletePost }) {
  useEffect(() => {
    const handleEvent = e => (e.keyCode === 27 || !e.keyCode) && closeDropdown()

    ;['click', 'keyup'].forEach(event =>
      window.addEventListener(event, handleEvent)
    )

    return () =>
      ['click', 'keyup'].forEach(event =>
        window.removeEventListener(event, handleEvent)
      )
  }, [])

  return (
    <div className={style.dropdown}>
      <button onClick={openEditPost}>
        <Edit />
        <span>{'Edit    '}</span>
      </button>
      <button onClick={deletePost}>
        <Delete />
        <span>Delete</span>
      </button>
    </div>
  )
}

export default Dropdown
