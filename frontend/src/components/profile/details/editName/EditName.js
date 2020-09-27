import React from 'react'
import Buttons from 'components/buttons/Buttons'
import Error from '../../error/Error'

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
      <Buttons
        text="Save"
        submit={updateName}
        loading={loading}
        cancel={closeEditName}
        opacity={loading ? 0.8 : editedName ? 1 : 0.8}
        styles={{ margin: 0 }}
      />

      {NameError && <Error error={NameError} />}
    </>
  )
}

export default EditName
