const { containsNumbers, containsSpecialCharacters } = require('./utils.js')

function validateFirstName(firstName) {
  return !firstName
    ? 'Enter first name'
    : firstName.length > 40
    ? 'Name too long'
    : containsNumbers(firstName)
    ? "Name can't contain numbers"
    : containsSpecialCharacters(firstName)
    ? 'Special characters not allowed'
    : ''
}

function validateLastName(lastName) {
  return !lastName
    ? 'Enter last name'
    : lastName.length > 40
    ? 'Name too long'
    : containsNumbers(lastName)
    ? "Name can't contain numbers"
    : containsSpecialCharacters(lastName)
    ? 'Special characters not allowed'
    : ''
}

async function validateEmail(col, email) {
  let userExists
  try {
    userExists = await col.findOne({ email })
  } catch (err) {
    console.log(err)
  }
  const regExp = /\S+@\S+\.\S+/

  return userExists
    ? 'User with this e-mail already exists'
    : !email
    ? 'Enter e-mail'
    : email.length > 50
    ? 'Enter correct e-mail'
    : !regExp.test(email)
    ? 'Invalid email'
    : ''
}

function validatePassword(password) {
  return !password
    ? 'Enter password'
    : password.length < 8
    ? 'Password too weak'
    : password.length > 40
    ? 'Password too long'
    : !containsSpecialCharacters(password)
    ? 'Use atleast one special character'
    : ''
}

function validateConfirmPassword(password, confirmPassword) {
  return !validatePassword(password) && password !== confirmPassword
    ? "Passwords didn't match"
    : ''
}

module.exports = {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
}
