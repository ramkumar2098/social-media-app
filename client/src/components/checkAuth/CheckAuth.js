import React, { useState, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Spinner from 'components/spinner/Spinner'

function CheckAuth({ children, ...rest }) {
  const [loggedIn, setLoggedIn] = useState(null)

  useEffect(() => {
    fetch('/auth')
      .then(response => response.json())
      .then(data => {
        setLoggedIn(data.loggedIn)
        localStorage.setItem('loggedIn', data.loggedIn)
      })
      .catch(console.log)
  }, [])

  if (loggedIn === null) return <Spinner />

  return (
    <Route
      {...rest}
      render={() => (loggedIn ? <Redirect to="/home" /> : children)}
    />
  )
}

export default CheckAuth
