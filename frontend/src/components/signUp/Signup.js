import React, { useState, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Error from '../error/Error'
import PasswordIcon from '../passwordIcon/PasswordIcon'
import Spinner from '../spinner/Spinner'
import style from '../Form.module.css'
import style1 from './Signup.module.css'

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

  const [spinner, setSpinner] = useState(false)

  const passwordErrorRef = useRef()
  const confirmPasswordErrorRef = useRef()
  const signUpBtnRef = useRef()

  const { push } = useHistory()

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

    signUpBtnRef.current.disabled = true
    signUpBtnRef.current.classList.add(style.disable)
    setSpinner(true)

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
      .then(data => {
        const {
          firstNameError,
          lastNameError,
          emailError,
          passwordError,
          confirmPasswordError,
        } = data

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

          signUpBtnRef.current.disabled = false
          signUpBtnRef.current.classList.remove(style.disable)
          setSpinner(false)
        } else {
          push(data.path)
        }
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
            onChange={e => setFirstName(e.target.value)}
            required
          />
          {firstNameError && <Error error={firstNameError} />}
        </div>
        <div>
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
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
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type={confirmPasswordInputType}
            id="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
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
          {spinner && <Spinner />}
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
