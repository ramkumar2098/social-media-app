import React, { useState } from 'react'
import Buttons from 'components/buttons/Buttons'
import Popup from 'components/popup/Popup'
import Logout from 'components/logout/Logout'
import Error from '../error/Error'
import { button, password as _password } from '../Profile.module.css'

function DeleteAccount() {
  const [displayDeleteAccount, setDisplayDeleteAccount] = useState(false)

  const closeDeleteAccount = () => {
    setPassword('')
    setDeleteAccountError('')
    setDisplayDeleteAccount(false)
  }

  const [deleteAccountError, setDeleteAccountError] = useState('')
  const [password, setPassword] = useState('')
  const [displayPopup, setDisplayPopup] = useState(false)

  const openPopup = () => {
    if (!password) return
    setDisplayPopup(true)
  }

  const deleteAccount = () => {
    setLoading(true)

    fetch('/profile/deleteAccount', {
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.deleteAccountError) {
          setLoading(false)
          setDisplayPopup(false)
          return setDeleteAccountError(data.deleteAccountError)
        }
        setLogout(true)
      })
      .catch(console.log())
  }

  const [loading, setLoading] = useState(false)
  const [logout, setLogout] = useState(false)

  return displayDeleteAccount ? (
    <>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className={_password}
        autoFocus
      />
      <Buttons
        text="Delete"
        submit={openPopup}
        cancel={closeDeleteAccount}
        opacity={loading ? 0.8 : password ? 1 : 0.8}
        styles={{ marginTop: 0 }}
      />
      {displayPopup && (
        <Popup
          message="Delete your account permanently?"
          remove={deleteAccount}
          loading={loading}
          closePopup={() => setDisplayPopup(false)}
        />
      )}
      {logout && <Logout />}
      {deleteAccountError && <Error error={deleteAccountError} />}
    </>
  ) : (
    <button
      onClick={() => setDisplayDeleteAccount(true)}
      className={button}
      style={{ clear: 'right' }}
    >
      Delete account
    </button>
  )
}

export default DeleteAccount
