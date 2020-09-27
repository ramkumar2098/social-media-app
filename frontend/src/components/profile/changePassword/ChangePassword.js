import React, { useState } from 'react'
import Error from '../error/Error'
import Buttons from 'components/buttons/Buttons'
import Logout from 'components/logout/Logout'
import { button, password } from '../Profile.module.css'

function ChangePassword() {
  const [displayChangePassword, setDisplayChangePassword] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [currentPasswordError, setCurrentPasswordError] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')

  const closeChangePassword = () => {
    setCurrentPassword('')
    setNewPassword('')
    setCurrentPasswordError('')
    setNewPasswordError('')
    setDisplayChangePassword(false)
  }

  const changePassword = () => {
    if (!currentPassword || !newPassword) return

    if (newPassword.length < 8) {
      return setNewPasswordError('Password too weak')
    }
    setLoading(true)

    fetch('/profile/changePassword', {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.currentPasswordError) {
          setNewPasswordError('')
          setLoading(false)
          return setCurrentPasswordError(data.currentPasswordError)
        }
        if (data.newPasswordError) {
          setCurrentPasswordError('')
          setLoading(false)
          return setNewPasswordError(data.newPasswordError)
        }
        setLogout(true)
      })
      .catch(console.log())
  }

  const [loading, setLoading] = useState(false)
  const [logout, setLogout] = useState(false)

  return (
    <div style={{ marginBottom: '12px' }}>
      {displayChangePassword ? (
        <>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
            className={password}
            style={{ display: 'block' }}
            autoFocus
          />
          {currentPasswordError && <Error error={currentPasswordError} />}
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="New Password"
            className={password}
          />
          <Buttons
            text="Save"
            submit={changePassword}
            loading={loading}
            cancel={closeChangePassword}
            opacity={loading ? 0.8 : currentPassword && newPassword ? 1 : 0.8}
            styles={{ margin: 0 }}
          />
          {logout && <Logout />}
          {newPasswordError && <Error error={newPasswordError} />}
        </>
      ) : (
        <button
          onClick={() => setDisplayChangePassword(true)}
          className={button}
        >
          Change password
        </button>
      )}
    </div>
  )
}

export default ChangePassword
