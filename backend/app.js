import express from 'express'
import bcrypt from 'bcrypt'
import mongodb from 'mongodb'
import session from 'express-session'
import connectMongo from 'connect-mongo'
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
const db = client.db(dbName)
const col = db.collection('users')

const SESS_NAME = 'sid'
const FIVE_MINUTES = 1000 * 60 * 5

app.use(express.json())
app.use(
  session({
    name: SESS_NAME,
    secret: 'secret',
    store: new MongoStore({ url: url + dbName }),
    cookie: {
      // maxAge: FIVE_MINUTES,
      sameSite: true,
    },
    resave: false,
    saveUninitialized: false,
  })
)

app.post('/auth', (req, res) => {
  res.json({ loggedIn: !!req.session.userID, userName: req.session.userName })
})

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
  const emailError = await validateEmail(col, _email)
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
    const document = {
      firstName: _firstName,
      lastName: _lastName,
      email: _email,
      password: hashedPassword,
    }

    await col.insertOne(document)

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

app.get('/posts', async (req, res) => {
  const col = db.collection('posts')

  try {
    const posts = await col.find().toArray()
    res.json(posts)
  } catch (err) {
    console.log(err)
  }
})

app.post('/posts', async (req, res) => {
  const col = db.collection('posts')

  try {
    col.insertOne(req.body)
    res.end()
  } catch (err) {
    console.log(err)
  }
})

app.post('/replies', async (req, res) => {
  const col = db.collection('posts')

  try {
    col.updateOne(
      { _id: mongodb.ObjectId('5f50c1b5bc9cce2ada62c82f') },
      {
        $push: {
          replies: { id: mongodb.ObjectId(), ...req.body },
        },
      }
    )
    res.end()
  } catch (err) {
    console.log(err)
  }
})

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return console.log(err)
    }
    res.clearCookie(SESS_NAME)
    res.end()
  })
})

app.listen(3001)
