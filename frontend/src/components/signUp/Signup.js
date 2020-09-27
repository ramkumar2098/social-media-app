import React, { useState, useRef } from 'react'
import useForm from 'hooks/useForm'
import Error from '../error/Error'
import PasswordIcon from '../passwordIcon/PasswordIcon'
import Spinner from '../spinner/Spinner'
import { Link, useHistory } from 'react-router-dom'
import style from '../Form.module.css'
import style1 from './Signup.module.css'

function Signup() {
  const [passwordInputType, setPasswordInputType] = useState('password')
  const [confirmPasswordInputType, setConfirmPasswordInputType] = useState(
    'password'
  )
  const { values, handleChange } = useForm()
  const { firstName, lastName, email, password, confirmPassword } = values

  const [errors, setErrors] = useState({})
  const {
    firstNameError,
    lastNameError,
    emailError,
    passwordError,
    confirmPasswordError,
  } = errors

  const [loading, setLoading] = useState(false)
  const signUpBtnRef = useRef()
  const { push } = useHistory()

  const submitForm = e => {
    e.preventDefault()
    let _errors = { ...errors }

    _errors.passwordError = password.length < 8 ? 'Password too weak' : ''

    _errors.confirmPasswordError =
      password.length >= 8 && password !== confirmPassword
        ? "Passwords didn't match"
        : ''

    setErrors(_errors)

    const a =
      _errors.firstNameError || _errors.lastNameError || _errors.emailError
    const b = _errors.passwordError || _errors.confirmPasswordError

    if (!a && b) return

    signUpBtnRef.current.disabled = true
    signUpBtnRef.current.classList.add(style.disable)
    setLoading(true)

    fetch('/signup', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(values),
    })
      .then(response => response.json())
      .then(data => {
        if (data.path) return push(data.path)

        setErrors(data)
        signUpBtnRef.current.disabled = false
        signUpBtnRef.current.classList.remove(style.disable)
        setLoading(false)
      })
      .catch(console.log)
  }

  const showPassword = () => setPasswordInputType('text')
  const hidePassword = () => setPasswordInputType('password')
  const showConfirmPassword = () => setConfirmPasswordInputType('text')
  const hideConfirmPassword = () => setConfirmPasswordInputType('password')

  return (
    <form onSubmit={submitForm} className={style.form}>
      <div>
        <div>
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            value={firstName}
            onChange={handleChange}
            required
          />
          {firstNameError && <Error error={firstNameError} />}
        </div>
        <div>
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            value={lastName}
            onChange={handleChange}
            required
          />
          {lastNameError && <Error error={lastNameError} />}
        </div>
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
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type={confirmPasswordInputType}
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            className={style1.confirmPassword}
            required
          />
          {confirmPasswordInputType === 'password' ? (
            <PasswordIcon display="Hide" handleEvent={showConfirmPassword} />
          ) : (
            <PasswordIcon display="Show" handleEvent={hideConfirmPassword} />
          )}
          {confirmPasswordError && <Error error={confirmPasswordError} />}
        </div>
        <button ref={signUpBtnRef} className={style.btn}>
          {loading && <Spinner />}
          <span>Sign Up</span>
        </button>
        <Link to="/login" className={style.link}>
          Already have an account?
        </Link>
      </div>
    </form>
  )
}

export default Signup
