import React, { useState } from 'react'
import EditName from './editName/EditName'
import Name from './name/Name'
import { month, date, year } from 'utils/utils'
import style from './Details.module.css'

function Details({ profile, setProfile }) {
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
      body: JSON.stringify({ editedFirstName }),
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
      body: JSON.stringify({ editedLastName }),
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

  return (
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
      <div>
        <span>Posts: </span>
        <span>{profile.posts}</span>
      </div>
    </div>
  )
}

export default Details
