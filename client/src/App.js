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
        <CheckAuth path="/signup" exact>
          <Header header="Create your account" />
          <Signup />
        </CheckAuth>
        <CheckAuth path="/login" exact>
          <Header header="Log in to Fakebook" />
          <Login />
        </CheckAuth>
        <PrivateRoute path="/home" exact>
          <Home setDisplayBurger={setDisplayBurger} />
        </PrivateRoute>
        <PrivateRoute path="/profile/:userID" exact>
          <Profile setDisplayBurger={setDisplayBurger} />
        </PrivateRoute>
        <PrivateRoute path="/profile" exact>
          <Profile setDisplayBurger={setDisplayBurger} />
        </PrivateRoute>
        <PrivateRoute path="/people" exact>
          <People setDisplayBurger={setDisplayBurger} />
        </PrivateRoute>
        <Route>
          <div>404</div>
        </Route>
      </Switch>
      <Footer />
    </BrowserRouter>
  )
}

export default App
