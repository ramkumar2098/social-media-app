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
        <Header />
        <Signup />
      </Route>
      <Route path="/login" component={Login} />
    </Router>
  )
}

export default App
