import express from 'express'
import bcrypt from 'bcrypt'
import mongodb from 'mongodb'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import postsRoutes from './routes/postsRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import { capitalize } from './utils.js'
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from './validations.js'

const app = express()
const MongoStore = connectMongo(session)

const url = 'mongodb://localhost/'
const client = new mongodb.MongoClient(url, { useUnifiedTopology: true })
const dbName = 'social'

;(async () => await client.connect())()
export const db = client.db(dbName)
const col = db.collection('users')

const SESS_NAME = 'sid'
const TEN_YEARS = 1000 * 60 * 60 * 24 * 365 * 10

app.use(express.json())
app.use(
  session({
    name: SESS_NAME,
    secret: 'secret',
    store: new MongoStore({ url: url + dbName }),
    cookie: {
      maxAge: TEN_YEARS,
      sameSite: true,
    },
    resave: false,
    saveUninitialized: false,
  })
)

app.get('/auth', (req, res) => {
  res.json({ loggedIn: !!req.session.userID })
})

app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body

  const [_firstName, _lastName, _email, _password, _confirmPassword] = [
    capitalize(firstName.trim()),
    capitalize(lastName.trim()),
    email.trim(),
    password.trim(),
    confirmPassword.trim(),
  ]

  const errors = {}

  errors.firstNameError = validateFirstName(_firstName)
  errors.lastNameError = validateLastName(_lastName)
  errors.emailError = await validateEmail(col, _email)
  errors.passwordError = validatePassword(_password)
  errors.confirmPasswordError = validateConfirmPassword(
    _password,
    _confirmPassword
  )

  const hasErrors = Object.values(errors).filter(e => e).length

  if (hasErrors) return res.send(errors)

  try {
    const hashedPassword = await bcrypt.hash(_password, 10)
    const document = {
      firstName: _firstName,
      lastName: _lastName,
      email: _email,
      password: hashedPassword,
      joined: Date.now(),
      avatar: '',
    }

    col.insertOne(document)

    res.json({ path: '/login' })
  } catch (err) {
    console.log(err)
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  let emailError
  let passwordError
  let user

  if (!email) {
    emailError = 'Enter e-mail'
  } else {
    user = await col.findOne({ email })
    let pwd

    if (user)
      try {
        pwd = await bcrypt.compare(password, user.password)
      } catch (err) {
        console.log(err)
      }

    if (!user || !pwd) {
      emailError = 'Invalid e-mail or password'
    }
  }

  if (!password) {
    passwordError = 'Enter password'
  }

  if (emailError || passwordError)
    return res.json({ emailError, passwordError })

  req.session.userID = user._id
  req.session.userName = user.firstName + ' ' + user.lastName
  res.json({ path: '/home' })
})

app.use('/posts', postsRoutes)

app.use('/profile', profileRoutes)

app.get('/people', async (req, res) => {
  try {
    const users = await col
      .aggregate([
        {
          $project: {
            name: { $concat: ['$firstName', ' ', '$lastName'] },
            avatar: 1,
          },
        },
      ])
      .toArray()

    res.send(users)
  } catch (err) {
    console.log(err)
  }
})

app.delete('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return console.log(err)
    }
    res.clearCookie(SESS_NAME)
    res.end()
  })
})

app.listen(3001)
