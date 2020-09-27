import React from 'react'
import { useAttachEvents } from 'hooks/useAttachEvents'
import { ReactComponent as Edit } from 'SVGs/Edit.svg'
import { ReactComponent as Delete } from 'SVGs/Delete.svg'
import style from './Dropdown.module.css'

function Dropdown({ closeDropdown, openEditPost, openPopup }) {
  useAttachEvents(closeDropdown)

  return (
    <div className={style.dropdown}>
      <button onClick={openEditPost}>
        <Edit />
        <span>{'Edit    '}</span>
      </button>
      <button onClick={openPopup}>
        <Delete />
        <span>Delete</span>
      </button>
    </div>
  )
}

export default Dropdown
