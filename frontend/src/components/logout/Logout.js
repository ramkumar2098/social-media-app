import React from 'react'
import { Redirect } from 'react-router-dom'

function Logout() {
  fetch('/logout', { method: 'POST' }).catch(console.log)

  return <Redirect to="/login" />
}

export default Logout
