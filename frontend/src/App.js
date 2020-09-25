import React, { useState } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import CheckAuth from 'components/checkAuth/CheckAuth'
import PrivateRoute from 'components/privateRoute/PrivateRoute'
import Navbar from './components/navbar/Navbar'
import Header from './components/header/Header'
import Signup from './components/signUp/Signup'
import Login from './components/login/Login'
import Home from './components/home/Home'
import Profile from 'components/profile/Profile'
import Footer from 'components/footer/Footer'
import People from 'components/people/People'

function App() {
  const [displayBurger, setDisplayBurger] = useState(false)

  return (
    <BrowserRouter>
      <Navbar displayBurger={displayBurger} />
      <Switch>
        <Route path="/" exact>
          <Redirect to="/home" />
        </Route>
        <CheckAuth path="/signup">
          <Header header="Create your account" />
          <Signup />
        </CheckAuth>
        <CheckAuth path="/login">
          <Header header="Log in to Fakebook" />
          <Login />
        </CheckAuth>
        <PrivateRoute path="/home">
          <Home setDisplayBurger={setDisplayBurger} />
        </PrivateRoute>
        <PrivateRoute path="/profile/:userID">
          <Profile setDisplayBurger={setDisplayBurger} />
        </PrivateRoute>
        <PrivateRoute path="/profile">
          <Profile setDisplayBurger={setDisplayBurger} />
        </PrivateRoute>
        <PrivateRoute path="/people">
          <People setDisplayBurger={setDisplayBurger} />
        </PrivateRoute>
      </Switch>
      <Footer />
    </BrowserRouter>
  )
}

export default App
