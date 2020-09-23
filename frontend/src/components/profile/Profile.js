import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProfilePic from './profilePic/ProfilePic'
import Details from './details/Details'
import ChangePassword from './changePassword/ChangePassword'
import DeleteAccount from './deleteAccount/DeleteAccount'
import Spinner from 'components/privateRoute/spinner/Spinner'
import style from './Profile.module.css'

function Profile({ setDisplayBurger }) {
  useEffect(() => {
    setDisplayBurger(true)

    return () => setDisplayBurger(false)
  }, [])

  const [profile, setProfile] = useState({})

  const { userID } = useParams()

  const url = '/profile/' + (userID || '')

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(setProfile)
      .catch(console.log)
  }, [userID])

  return Object.keys(profile).length > 0 ? (
    <div className={style.profile}>
      <ProfilePic avatar={profile.avatar} />
      <Details profile={profile} setProfile={setProfile} />
      {!userID && (
        <>
          <ChangePassword />
          <DeleteAccount />
        </>
      )}
    </div>
  ) : (
    <Spinner />
  )
}

export default Profile
