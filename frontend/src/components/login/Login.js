import React, { useState, useRef } from 'react'
import useForm from 'hooks/useForm'
import Error from '../error/Error'
import PasswordIcon from '../passwordIcon/PasswordIcon'
import Spinner from '../spinner/Spinner'
import { Link, useHistory } from 'react-router-dom'
import style from '../Form.module.css'
import style1 from './Login.module.css'

function Login() {
  const [passwordInputType, setPasswordInputType] = useState('password')

  const { values, handleChange } = useForm()
  const { email, password } = values

  const [errors, setErrors] = useState({})
  const { emailError, passwordError } = errors

  const [loading, setLoading] = useState(false)
  const LogInBtnRef = useRef()
  const { push } = useHistory()

  const submitForm = e => {
    e.preventDefault()

    LogInBtnRef.current.disabled = true
    LogInBtnRef.current.classList.add(style.disable)
    setLoading(true)

    fetch('/login', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(values),
    })
      .then(response => response.json())
      .then(data => {
        if (data.path) return push(data.path)

        setErrors(data)
        LogInBtnRef.current.disabled = false
        LogInBtnRef.current.classList.remove(style.disable)
        setLoading(false)
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
            onChange={handleChange}
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
            onChange={handleChange}
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
          {loading && <Spinner />}
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
