import React, { useState, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Spinner from './spinner/Spinner'

function PrivateRoute({ children, setUserName, ...rest }) {
  const [loggedIn, setLoggedIn] = useState('verifying...')

  useEffect(() => {
    fetch('/auth', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        setLoggedIn(data.userName)
        setUserName(data.userName)
      })
      .catch(console.log)
  }, [])

  return (
    <Route
      {...rest}
      render={() =>
        loggedIn === 'verifying...' ? (
          <Spinner />
        ) : loggedIn ? (
          children
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  )
}

export default PrivateRoute
