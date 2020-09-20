import React, { useState } from 'react'
import Popup from 'components/home/posts/post/popup/Popup'
import { Redirect } from 'react-router-dom'
import Error from '../error/Error'
import { buttons } from '../../home/Buttons.module.css'
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

    fetch('/deleteAccount', {
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
        logOut()
      })
      .catch(console.log())
  }

  const [loading, setLoading] = useState(false)
  const [redirect, setRedirect] = useState(false)

  const logOut = () => {
    fetch('/logout', { method: 'POST' }).catch(console.log)
    setRedirect(true)
  }

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
      <div className={buttons} style={{ marginTop: 0 }}>
        <button
          onClick={openPopup}
          style={{ opacity: loading ? 0.8 : password ? 1 : 0.8 }}
        >
          Delete
        </button>
        {displayPopup && (
          <Popup
            message="Delete your account permanently?"
            deletePost={deleteAccount}
            deletePostLoading={loading}
            closePopup={() => setDisplayPopup(false)}
          />
        )}
        {redirect && <Redirect to="/login" />}
        <button onClick={closeDeleteAccount}>Cancel</button>
      </div>
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
