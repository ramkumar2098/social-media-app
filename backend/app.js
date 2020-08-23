import express from 'express'
import bcrypt from 'bcrypt'
import { capitalize } from './utils.js'
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from './validations.js'

const app = express()

app.use(express.json())

const users = []

app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body

  const [_firstName, _lastName, _email, _password, _confirmPassword] = [
    capitalize(firstName).trim(),
    capitalize(lastName).trim(),
    email.trim(),
    password.trim(),
    confirmPassword.trim(),
  ]

  const firstNameError = validateFirstName(_firstName)
  const lastNameError = validateLastName(_lastName)
  const emailError = validateEmail(users, _email)
  const passwordError = validatePassword(_password)
  const confirmPasswordError = validateConfirmPassword(
    _password,
    _confirmPassword
  )

  const errors =
    firstNameError ||
    lastNameError ||
    emailError ||
    passwordError ||
    confirmPasswordError

  if (errors)
    return res.json({
      firstNameError,
      lastNameError,
      emailError,
      passwordError,
      confirmPasswordError,
    })

  try {
    const hashedPassword = await bcrypt.hash(_password, 10)

    users.push({
      firstName: _firstName,
      lastName: _lastName,
      email: _email,
      password: hashedPassword,
    })
    res.json({ ok: 'ok' })
  } catch (err) {
    res.json({ err: 'err' })
  }
})

app.listen(3001)

// loading spinner
// something went wrong message
