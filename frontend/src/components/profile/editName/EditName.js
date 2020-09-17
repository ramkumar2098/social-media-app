import React from 'react'
import Spinner from 'components/spinner/Spinner'
import style from './EditName.module.css'
import { buttons } from '../../home/Buttons.module.css'

function EditName({
  editedName,
  changeEditedName,
  NameError,
  updateName,
  loading,
  closeEditName,
}) {
  return (
    <>
      <input
        value={editedName}
        onChange={changeEditedName}
        className={style.name}
        autoFocus
      />
      <div className={buttons + ' ' + style.buttons}>
        <button
          onClick={updateName}
          disabled={loading}
          style={{ opacity: loading ? 0.8 : editedName ? 1 : 0.8 }}
        >
          {loading && <Spinner />}Save
        </button>
        <button onClick={closeEditName}>Cancel</button>
      </div>
      {NameError && <div className={style.nameError}>{NameError}</div>}
    </>
  )
}

export default EditName
