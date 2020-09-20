import React, { useEffect, useState } from 'react'
import ProfilePic from './profilePic/ProfilePic'
import Details from './details/Details'
import ChangePassword from './changePassword/ChangePassword'
import DeleteAccount from './deleteAccount/DeleteAccount'
import style from './Profile.module.css'

function Profile({ setDisplayBurger }) {
  useEffect(() => {
    setDisplayBurger(true)

    return () => setDisplayBurger(false)
  }, [])

  const [profile, setProfile] = useState({})

  useEffect(() => {
    fetch('/profile')
      .then(response => response.json())
      .then(setProfile)
      .catch(console.log)
  }, [])

  return (
    Object.keys(profile).length > 0 && (
      <div className={style.profile}>
        <ProfilePic avatar={profile.avatar} />
        <Details profile={profile} setProfile={setProfile} />
        <ChangePassword />
        <DeleteAccount />
      </div>
    )
  )
}

export default Profile
