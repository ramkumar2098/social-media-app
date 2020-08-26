import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PrivateRoute from 'components/privateRoute/PrivateRoute'
import Navbar from './components/navbar/Navbar'
import Header from './components/header/Header'
import Signup from './components/signUp/Signup'
import Login from './components/login/Login'
import Home from './components/Home/Home'

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
      <PrivateRoute path="/home">
        <Home />
      </PrivateRoute>
    </Router>
  )
}

export default App
