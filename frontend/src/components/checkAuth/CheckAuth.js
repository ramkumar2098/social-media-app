import React, { useState, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Spinner from './spinner/Spinner'

function CheckAuth({ children, ...rest }) {
  const [loggedIn, setLoggedIn] = useState('verifying...')

  useEffect(() => {
    fetch('/auth', { method: 'POST' })
      .then(response => response.json())
      .then(data => setLoggedIn(data.loggedIn))
      .catch(console.log)
  }, [])

  return (
    <Route
      {...rest}
      render={() =>
        loggedIn === 'verifying...' ? (
          <Spinner />
        ) : loggedIn ? (
          <Redirect to="/home" />
        ) : (
          children
        )
      }
    />
  )
}

export default CheckAuth
