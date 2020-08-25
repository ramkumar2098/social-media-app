import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Header from './components/header/Header'
import Signup from './components/signUp/Signup'
import Login from './components/login/Login'

function App() {
  return (
    <Router>
      <Navbar />
      <Route path="/signup">
        <Header header="Create your account" />
        <Signup />
      </Route>
      <Route path="/login">
        <Header header="Log in to Fakebook" />
        <Login />
      </Route>
    </Router>
  )
}

export default App
