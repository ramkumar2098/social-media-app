import React, { useState, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Error from '../error/Error'
import PasswordIcon from '../passwordIcon/PasswordIcon'
import Spinner from '../spinner/Spinner'
import style from '../Form.module.css'
import style1 from './Login.module.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordInputType, setPasswordInputType] = useState('password')
  const [spinner, setSpinner] = useState(false)

  const LogInBtnRef = useRef()

  const { push } = useHistory()

  const submitForm = e => {
    e.preventDefault()

    LogInBtnRef.current.disabled = true
    LogInBtnRef.current.classList.add(style.disable)
    setSpinner(true)

    fetch('/login', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(data => {
        const { emailError, passwordError } = data

        if (emailError || passwordError) {
          setEmailError(emailError)
          setPasswordError(passwordError)

          LogInBtnRef.current.disabled = false
          LogInBtnRef.current.classList.remove(style.disable)
          setSpinner(false)
        } else {
          push(data.path)
        }
      })
      .catch(console.log)
  }

  const showPassword = () => setPasswordInputType('text')
  const hidePassword = () => setPasswordInputType('password')

  return (
    <form onSubmit={submitForm} className={style.form + ' ' + style1.loginForm}>
      <div>
        <div>
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          {emailError && <Error error={emailError} />}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type={passwordInputType}
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {passwordInputType === 'password' ? (
            <PasswordIcon display="Hide" handleEvent={showPassword} />
          ) : (
            <PasswordIcon display="Show" handleEvent={hidePassword} />
          )}
          {passwordError && <Error error={passwordError} />}
        </div>
        <button ref={LogInBtnRef} className={style.btn}>
          {spinner && <Spinner />}
          <span>Log In</span>
        </button>
        <div>
          <Link to="/login" className={style.link}>
            Forgot password?
          </Link>
          <Link to="/signup" className={style.link}>
            Sign up for Fakebook
          </Link>
        </div>
      </div>
    </form>
  )
}

export default Login
