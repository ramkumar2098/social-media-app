import React from 'react'
import ButtonSpinner from 'components/buttonSpinner/ButtonSpinner'
import Error from '../../error/Error'
import { buttons } from 'components/Buttons.module.css'

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
        style={{ marginBottom: '10px' }}
        autoFocus
      />
      <div className={buttons} style={{ margin: 0 }}>
        <button
          onClick={updateName}
          disabled={loading}
          style={{ opacity: loading ? 0.8 : editedName ? 1 : 0.8 }}
        >
          {loading && <ButtonSpinner />}Save
        </button>
        <button onClick={closeEditName}>Cancel</button>
      </div>
      {NameError && <Error error={NameError} />}
    </>
  )
}

export default EditName
