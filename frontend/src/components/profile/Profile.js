import React, { useEffect, useState } from 'react'
import profilePic from 'images/profile2.png'
import Spinner from 'components/spinner/Spinner'
import { ReactComponent as Edit } from 'SVGs/Edit.svg'
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

  return (
    <div className={style.profile}>
      <img
        src={profilePic}
        className={style.profilePic}
        alt="profile picture"
      />
      <div className={style.details}>
        <div>
          <span>First name: </span>
          {editFirstName ? (
            <>
              <input
                value={editedFirstName}
                onChange={e => setEditedFirstName(e.target.value)}
                className={style.firstName}
                autoFocus
              />
              {firstNameError && (
                <div style={{ marginTop: '-16px', color: 'red' }}>
                  {firstNameError}
                </div>
              )}
              <div className={buttons + ' ' + style.buttons}>
                <button
                  onClick={updateFirstName}
                  disabled={loading}
                  style={{ opacity: loading ? 0.8 : editedFirstName ? 1 : 0.8 }}
                >
                  {loading && <Spinner />}Save
                </button>
                <button
                  onClick={() => {
                    setFirstNameError('')
                    setEditFirstName(false)
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <span>{profile.firstName}</span>
              <button
                onClick={() => {
                  setEditFirstName(true)
                  setEditedFirstName(profile.firstName)
                }}
                className={style.editBtn}
              >
                <Edit />
              </button>
            </>
          )}
        </div>
        <div style={{ clear: 'right' }}>
          <span>Last name: </span>
          <span>{profile.lastName}</span>
        </div>
        <div>
          <span>E-mail: </span>
          <span>{profile.email}</span>
        </div>
        <div>
          <span>Joined: </span>
          <span>{profile.joined}</span>
        </div>
      </div>
    </div>
  )
}

export default Profile
