import React, { useState, useRef } from 'react'
import HidePasswordIcon from '../HidePasswordIcon.svg'
import ShowPasswordIcon from '../ShowPasswordIcon.svg'
import style from './Signup.module.css'

function Signup() {
  const [passwordInputType, setPasswordInputType] = useState('password')
  const [confirmPasswordInputType, setConfirmPasswordInputType] = useState(
    'password'
  )
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const errorRefs = useRef({
    firstNameError,
    lastNameError,
    emailError,
    passwordError,
    confirmPasswordError,
  })

  const passwordErrorRef = useRef()
  const confirmPasswordErrorRef = useRef()

  const submitBtnRef = useRef()

  const submitForm = e => {
    e.preventDefault()

    if (password.length < 8) {
      setPasswordError('Password too weak')
      passwordErrorRef.current = 'Password too weak'
    } else {
      setPasswordError('')
      passwordErrorRef.current = ''
    }

    if (password.length >= 8 && password !== confirmPassword) {
      setConfirmPasswordError("Passwords didn't match")
      confirmPasswordErrorRef.current = "Passwords didn't match"
    } else {
      setConfirmPasswordError('')
      confirmPasswordErrorRef.current = ''
    }

    if (passwordErrorRef.current || confirmPasswordErrorRef.current) return

    submitBtnRef.current.disabled = true

    fetch('/signup', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      }),
    })
      .then(response => response.json())
      .then(json => {
        console.log(json)

        const {
          firstNameError,
          lastNameError,
          emailError,
          passwordError,
          confirmPasswordError,
        } = json

        const errors =
          firstNameError ||
          lastNameError ||
          emailError ||
          passwordError ||
          confirmPasswordError

        if (errors) {
          setFirstNameError(firstNameError)
          setLastNameError(lastNameError)
          setEmailError(emailError)
          setPasswordError(passwordError)
          setConfirmPasswordError(confirmPasswordError)
        } else {
          console.log('NO ERRORS')
          // go to login
        }

        submitBtnRef.current.disabled = false
      })
      .catch(console.log)
  }

  const showPassword = () => setPasswordInputType('text')
  const hidePassword = () => setPasswordInputType('password')
  const showConfirmPassword = () => setConfirmPasswordInputType('text')
  const hideConfirmPassword = () => setConfirmPasswordInputType('password')

  return (
    <form onSubmit={submitForm} className={style.signupForm}>
      <div>
        <div>
          <label htmlFor="firstName">First name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
          {firstNameError && (
            <div className={style.error}>{firstNameError}</div>
          )}
        </div>
        <div>
          <label htmlFor="lastName">Last name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
          {lastNameError && <div className={style.error}>{lastNameError}</div>}
        </div>
        <div>
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          {emailError && <div className={style.error}>{emailError}</div>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <div>
            <input
              type={passwordInputType}
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {passwordInputType === 'password' ? (
              <img
                src={HidePasswordIcon}
                onClick={showPassword}
                alt="Hide password icon"
              />
            ) : (
              <img
                src={ShowPasswordIcon}
                onClick={hidePassword}
                alt="Show password icon"
              />
            )}
          </div>
          {passwordError && <div className={style.error}>{passwordError}</div>}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type={confirmPasswordInputType}
            id="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          {confirmPasswordInputType === 'password' ? (
            <img
              src={HidePasswordIcon}
              onClick={showConfirmPassword}
              alt="Hide password icon"
            />
          ) : (
            <img
              src={ShowPasswordIcon}
              onClick={hideConfirmPassword}
              alt="Show password icon"
            />
          )}
          {confirmPasswordError && (
            <div className={style.error}>{confirmPasswordError}</div>
          )}
        </div>
        <button ref={submitBtnRef} className={style.signUpBtn}>
          Sign Up
        </button>
      </div>
    </form>
  )
}

export default Signup

// make header sticky
// when '/signup' is triggered send an ajax request. if authenticated, redirect to '/'
// properly handle errors
