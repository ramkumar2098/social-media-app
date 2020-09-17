import React, { useEffect, useState } from 'react'
import profilePic from 'images/profile2.png'
import EditName from './editName/EditName'
import Name from './name/Name'
import { month, date, year } from 'utils'
import Spinner from 'components/spinner/Spinner'
import { Redirect } from 'react-router-dom'
import style from './Profile.module.css'
import { buttons } from '../home/Buttons.module.css'

function Profile({ setDisplayBurger }) {
  useEffect(() => {
    setDisplayBurger(true)

    return () => setDisplayBurger(false)
  }, [])

  const [profile, setProfile] = useState({})

  useEffect(() => {
    fetch('/profile')
      .then(response => response.json())
      .then(profile => {
        setProfile(profile)
        setEditedFirstName(profile.firstName)
        setEditedLastName(profile.lastName)
      })
      .catch(console.log)
  }, [])

  const [editFirstName, setEditFirstName] = useState(false)
  const [editedFirstName, setEditedFirstName] = useState('')

  const [firstNameError, setFirstNameError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateFirstName = () => {
    if (!editedFirstName) return
    setLoading(true)

    fetch('/editFirstName', {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: profile._id, editedFirstName }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.firstNameError) {
          setLoading(false)
          return setFirstNameError(data.firstNameError)
        }
        setFirstNameError('')
        setLoading(false)
        setEditFirstName(false)
        setProfile({ ...profile, firstName: data.firstName })
      })
      .catch(console.log)
  }

  const [editLastName, setEditLastName] = useState(false)
  const [editedLastName, setEditedLastName] = useState('')

  const [lastNameError, setLastNameError] = useState('')
  const [lastNameLoading, setLastNameLoading] = useState(false)

  const updateLastName = () => {
    if (!editedLastName) return
    setLastNameLoading(true)

    fetch('/editLastName', {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ _id: profile._id, editedLastName }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.lastNameError) {
          setLastNameLoading(false)
          return setLastNameError(data.lastNameError)
        }
        setLastNameError('')
        setLastNameLoading(false)
        setEditLastName(false)
        setProfile({ ...profile, lastName: data.lastName })
      })
      .catch(console.log)
  }

  const [displayChangePassword, setDisplayChangePassword] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [currentPasswordError, setCurrentPasswordError] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')

  const changePassword = () => {
    if (!currentPassword || !newPassword) return

    if (newPassword.length < 8) {
      return setNewPasswordError('Password too weak')
    }
    setChangePasswordLoading(true)

    fetch('/changePassword', {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.currentPasswordError) {
          setNewPasswordError('')
          setChangePasswordLoading(false)
          return setCurrentPasswordError(data.currentPasswordError)
        }
        if (data.newPasswordError) {
          setCurrentPasswordError('')
          setChangePasswordLoading(false)
          return setNewPasswordError(data.newPasswordError)
        }
        logOut()
      })
      .catch(console.log())
  }

  const [changePasswordLoading, setChangePasswordLoading] = useState(false)
  const [redirect, setRedirect] = useState(false)

  const logOut = () => {
    fetch('/logout', { method: 'POST' }).catch(console.log)
    setRedirect(true)
  }

  return (
    <div className={style.profile}>
      <img
        src={profilePic}
        className={style.profilePic}
        alt="profile picture"
      />
      <button>Change picture</button>
      <div className={style.details}>
        <div>
          <span>First name: </span>
          {editFirstName ? (
            <EditName
              editedName={editedFirstName}
              changeEditedName={e => setEditedFirstName(e.target.value)}
              NameError={firstNameError}
              updateName={updateFirstName}
              loading={loading}
              closeEditName={() => {
                setFirstNameError('')
                setEditFirstName(false)
              }}
            />
          ) : (
            <Name
              name={profile.firstName}
              openEditName={() => {
                setEditFirstName(true)
                setEditedFirstName(profile.firstName)
              }}
            />
          )}
        </div>
        <div>
          <span>Last name: </span>
          {editLastName ? (
            <EditName
              editedName={editedLastName}
              changeEditedName={e => setEditedLastName(e.target.value)}
              NameError={lastNameError}
              updateName={updateLastName}
              loading={lastNameLoading}
              closeEditName={() => {
                setLastNameError('')
                setEditLastName(false)
              }}
            />
          ) : (
            <Name
              name={profile.lastName}
              openEditName={() => {
                setEditLastName(true)
                setEditedLastName(profile.lastName)
              }}
            />
          )}
        </div>
        <div>
          <span>E-mail: </span>
          <span>{profile.email}</span>
        </div>
        <div>
          <span>Joined: </span>
          <span>
            {profile.joined &&
              `${month(profile.joined)} ${date(profile.joined)}, ${year(
                profile.joined
              )}`}
          </span>
        </div>
        {displayChangePassword ? (
          <>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              className={style.password}
              autoFocus
            />
            {currentPasswordError && (
              <div className={style.error}>{currentPasswordError}</div>
            )}
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="New Password"
              className={style.password}
            />
            <div className={buttons} style={{ marginTop: 0 }}>
              <button
                onClick={changePassword}
                disabled={changePasswordLoading}
                style={{
                  opacity: changePasswordLoading
                    ? 0.8
                    : currentPassword && newPassword
                    ? 1
                    : 0.8,
                }}
              >
                {changePasswordLoading && <Spinner />}Save
              </button>
              {redirect && <Redirect to="/login" />}
              <button
                onClick={() => {
                  setCurrentPassword('')
                  setNewPassword('')
                  setCurrentPasswordError('')
                  setNewPasswordError('')
                  setDisplayChangePassword(false)
                }}
              >
                Cancel
              </button>
            </div>
            {newPasswordError && (
              <div className={style.error}>{newPasswordError}</div>
            )}
          </>
        ) : (
          <button
            onClick={() => setDisplayChangePassword(true)}
            className={style.changePassword}
          >
            Change password
          </button>
        )}
      </div>
    </div>
  )
}

export default Profile
