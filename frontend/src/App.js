import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import CheckAuth from 'components/checkAuth/CheckAuth'
import PrivateRoute from 'components/privateRoute/PrivateRoute'
import Navbar from './components/navbar/Navbar'
import BurgerMenu from './components/burgerMenu/BurgerMenu'
import Header from './components/header/Header'
import Signup from './components/signUp/Signup'
import Login from './components/login/Login'
import Home from './components/home/Home'
import Profile from 'components/profile/Profile'

function App() {
  const [displayBurger, setDisplayBurger] = useState(false)
  const [displayBurgerMenu, setDisplayBurgerMenu] = useState(false)

  const openBurgerMenu = () => setDisplayBurgerMenu(true)
  const closeBurgerMenu = () => setDisplayBurgerMenu(false)

  const mediaQ = window.matchMedia('(min-width: 700px)')
  const [displayNavItems, setDisplayNavItems] = useState(mediaQ.matches)
  mediaQ.onchange = () => setDisplayNavItems(mediaQ.matches)

  return (
    <Router>
      <Navbar
        displayBurger={displayBurger}
        openBurgerMenu={openBurgerMenu}
        displayNavItems={displayNavItems}
        displayBurgerMenu={displayBurgerMenu}
      />
      {displayBurgerMenu && !displayNavItems && (
        <BurgerMenu closeBurgerMenu={closeBurgerMenu} />
      )}
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
        <PrivateRoute path="/profile">
          <Profile setDisplayBurger={setDisplayBurger} />
        </PrivateRoute>
      </Switch>
    </Router>
  )
}

export default App
