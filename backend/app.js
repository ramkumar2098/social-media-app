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

app.use(express.json({ limit: '250kb' }))
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
      joined: Date.now(),
      avatar: '',
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
    const posts = await col.find().sort({ _id: -1 }).toArray()

    const userLikedThesePosts = posts.map(post =>
      post.likedBy.includes(req.session.userID)
    )
    const userDislikedThesePosts = posts.map(post =>
      post.dislikedBy.includes(req.session.userID)
    )
    const userLikedTheseReplies = posts.map(post =>
      post.replies.map(reply => reply.likedBy.includes(req.session.userID))
    )
    const userDislikedTheseReplies = posts.map(post =>
      post.replies.map(reply => reply.dislikedBy.includes(req.session.userID))
    )
    const userAuthoredThesePosts = posts.map(
      post => post.userID === req.session.userID
    )
    const userAuthoredTheseReplies = posts.map(post =>
      post.replies.map(reply => reply.userID === req.session.userID)
    )

    posts.forEach((post, i) => {
      post.userLikedThisPost = userLikedThesePosts[i]
      post.userDislikedThisPost = userDislikedThesePosts[i]
      post.userAuthoredThisPost = userAuthoredThesePosts[i]

      post.replies.forEach((reply, _i) => {
        reply.userLikedThisReply = userLikedTheseReplies[i][_i]
        reply.userDislikedThisReply = userDislikedTheseReplies[i][_i]
        reply.userAuthoredThisReply = userAuthoredTheseReplies[i][_i]
      })
    })

    res.json(posts)
  } catch (err) {
    console.log(err)
  }
})

app.post('/addPost', async (req, res) => {
  const col = db.collection('posts')

  const post = {
    userName: req.session.userName,
    userID: req.session.userID,
    post: req.body.post,
    date: Date.now(),
    edited: false,
    likedBy: [],
    likes: 0,
    dislikedBy: [],
    dislikes: 0,
    replies: [],
  }

  try {
    const { avatar } = await db
      .collection('users')
      .findOne(
        { _id: mongodb.ObjectID(req.session.userID) },
        { projection: { _id: 0, avatar: 1 } }
      )
    post.avatar = avatar

    const result = await col.insertOne(post)
    res.json(result.ops[0])
  } catch (err) {
    console.log(err)
  }
})

app.post('/addReply', async (req, res) => {
  const col = db.collection('posts')

  const reply = {
    id: mongodb.ObjectId(),
    userName: req.session.userName,
    userID: req.session.userID,
    reply: req.body.reply,
    date: Date.now(),
    edited: false,
    likedBy: [],
    likes: 0,
    dislikedBy: [],
    dislikes: 0,
  }

  try {
    const { avatar } = await db
      .collection('users')
      .findOne(
        { _id: mongodb.ObjectID(req.session.userID) },
        { projection: { _id: 0, avatar: 1 } }
      )
    reply.avatar = avatar

    res.json(reply)
    col.updateOne(
      { _id: mongodb.ObjectId(req.body._id) },
      {
        $push: { replies: reply },
      }
    )
  } catch (err) {
    console.log(err)
  }
})

app.put('/editPost', async (req, res) => {
  const col = db.collection('posts')

  try {
    col.updateOne(
      { _id: mongodb.ObjectId(req.body._id) },
      {
        $set: { post: req.body.editedPost, edited: true },
      }
    )
    res.end()
  } catch (err) {
    console.log(err)
  }
})

app.put('/editReply', async (req, res) => {
  const col = db.collection('posts')

  try {
    col.updateOne(
      {
        _id: mongodb.ObjectId(req.body._id),
        'replies.id': mongodb.ObjectId(req.body.id),
      },
      {
        $set: {
          'replies.$.reply': req.body.editedReply,
          'replies.$.edited': true,
        },
      },
      { returnOriginal: false }
    )

    res.end()
  } catch (err) {
    console.log(err)
  }
})

app.delete('/deletePost', async (req, res) => {
  const col = db.collection('posts')

  try {
    col.deleteOne({ _id: mongodb.ObjectId(req.body._id) })
    res.end()
  } catch (err) {
    console.log(err)
  }
})

app.delete('/deleteReply', async (req, res) => {
  const col = db.collection('posts')

  try {
    col.updateOne(
      { _id: mongodb.ObjectId(req.body._id) },
      {
        $pull: {
          replies: { id: mongodb.ObjectId(req.body.id) },
        },
      },
      { returnOriginal: false }
    )

    res.end()
  } catch (err) {
    console.log(err)
  }
})

app.post('/likePost', async (req, res) => {
  const col = db.collection('posts')

  try {
    const post = await col.findOne({ _id: mongodb.ObjectId(req.body._id) })

    const userDislikedThisPost = post.dislikedBy.includes(req.session.userID)

    col.updateOne(
      { _id: mongodb.ObjectId(req.body._id) },
      {
        $push: { likedBy: req.session.userID },
        $inc: { likes: 1, dislikes: userDislikedThisPost ? -1 : 0 },
        $pull: { dislikedBy: userDislikedThisPost && req.session.userID },
      }
    )
    res.end()
  } catch (err) {
    console.log(err)
  }
})

app.post('/unlikePost', async (req, res) => {
  const col = db.collection('posts')

  try {
    col.updateOne(
      { _id: mongodb.ObjectId(req.body._id) },
      {
        $pull: { likedBy: req.session.userID },
        $inc: { likes: -1 },
      }
    )
    res.end()
  } catch (err) {
    console.log(err)
  }
})

app.post('/dislikePost', async (req, res) => {
  const col = db.collection('posts')

  try {
    const post = await col.findOne({ _id: mongodb.ObjectId(req.body._id) })

    const userLikedThisPost = post.likedBy.includes(req.session.userID)

    col.updateOne(
      { _id: mongodb.ObjectId(req.body._id) },
      {
        $push: { dislikedBy: req.session.userID },
        $inc: { dislikes: 1, likes: userLikedThisPost ? -1 : 0 },
        $pull: { likedBy: userLikedThisPost && req.session.userID },
      }
    )
    res.end()
  } catch (err) {
    console.log(err)
  }
})

app.post('/removeDislikePost', async (req, res) => {
  const col = db.collection('posts')

  try {
    col.updateOne(
      { _id: mongodb.ObjectId(req.body._id) },
      {
        $pull: { dislikedBy: req.session.userID },
        $inc: { dislikes: -1 },
      }
    )
    res.end()
  } catch (err) {
    console.log(err)
  }
})

app.post('/likeReply', async (req, res) => {
  const col = db.collection('posts')

  try {
    const post = await col.findOne({ _id: mongodb.ObjectId(req.body._id) })

    const reply = post.replies.find(reply => reply.id == req.body.id)

    const userDislikedThisReply = reply.dislikedBy.includes(req.session.userID)

    col.updateOne(
      {
        _id: mongodb.ObjectId(req.body._id),
        'replies.id': mongodb.ObjectId(req.body.id),
      },
      {
        $push: { 'replies.$.likedBy': req.session.userID },
        $inc: {
          'replies.$.likes': 1,
          'replies.$.dislikes': userDislikedThisReply ? -1 : 0,
        },
        $pull: {
          'replies.$.dislikedBy': userDislikedThisReply && req.session.userID,
        },
      }
    )
    res.end()
  } catch (err) {
    console.log(err)
  }
})

app.post('/unlikeReply', async (req, res) => {
  const col = db.collection('posts')

  try {
    col.updateOne(
      {
        _id: mongodb.ObjectId(req.body._id),
        'replies.id': mongodb.ObjectId(req.body.id),
      },
      {
        $pull: { 'replies.$.likedBy': req.session.userID },
        $inc: { 'replies.$.likes': -1 },
      }
    )
    res.end()
  } catch (err) {
    console.log(err)
  }
})

app.post('/dislikeReply', async (req, res) => {
  const col = db.collection('posts')

  try {
    const post = await col.findOne({ _id: mongodb.ObjectId(req.body._id) })

    const reply = post.replies.find(reply => reply.id == req.body.id)

    const userLikedThisReply = reply.likedBy.includes(req.session.userID)

    col.updateOne(
      {
        _id: mongodb.ObjectId(req.body._id),
        'replies.id': mongodb.ObjectId(req.body.id),
      },
      {
        $push: { 'replies.$.dislikedBy': req.session.userID },
        $inc: {
          'replies.$.dislikes': 1,
          'replies.$.likes': userLikedThisReply ? -1 : 0,
        },
        $pull: {
          'replies.$.likedBy': userLikedThisReply && req.session.userID,
        },
      }
    )
    res.end()
  } catch (err) {
    console.log(err)
  }
})

app.post('/removeDislikeReply', async (req, res) => {
  const col = db.collection('posts')

  try {
    col.updateOne(
      {
        _id: mongodb.ObjectId(req.body._id),
        'replies.id': mongodb.ObjectId(req.body.id),
      },
      {
        $pull: { 'replies.$.dislikedBy': req.session.userID },
        $inc: { 'replies.$.dislikes': -1 },
      }
    )
    res.end()
  } catch (err) {
    console.log(err)
  }
})

app.get('/profile/:userID', async (req, res) => {
  const col = db.collection('users')

  try {
    const user = await col.findOne(
      { _id: mongodb.ObjectId(req.params.userID) },
      { projection: { password: 0 } }
    )

    const posts = await db
      .collection('posts')
      .find({ userID: req.params.userID })
      .count()

    user.posts = posts
    res.send(user || {})
  } catch (err) {
    console.log(err)
  }
})

app.get('/profile', async (req, res) => {
  const col = db.collection('users')

  try {
    const user = await col.findOne(
      { _id: mongodb.ObjectId(req.session.userID) },
      { projection: { password: 0 } }
    )

    const posts = await db
      .collection('posts')
      .find({ userID: req.session.userID })
      .count()

    user.posts = posts
    res.send(user)
  } catch (err) {
    console.log(err)
  }
})

app.put('/editFirstName', async (req, res) => {
  const editedFirstName = capitalize(req.body.editedFirstName.trim())
  const firstNameError = validateFirstName(editedFirstName)

  if (firstNameError) {
    return res.json({ firstNameError })
  }

  const col = db.collection('users')

  try {
    const { value } = await col.findOneAndUpdate(
      { _id: mongodb.ObjectID(req.session.userID) },
      { $set: { firstName: editedFirstName } },
      { returnOriginal: false }
    )

    const userName = value.firstName + ' ' + value.lastName

    db.collection('posts').updateMany(
      { userID: req.session.userID },
      { $set: { userName } }
    )

    db.collection('posts').updateMany(
      {},
      { $set: { 'replies.$[element].userName': userName } },
      { arrayFilters: [{ 'element.userID': req.session.userID }] }
    )

    req.session.userName = userName
    res.json({ firstName: value.firstName })
  } catch (err) {
    console.log(err)
  }
})

app.put('/editLastName', async (req, res) => {
  const editedLastName = capitalize(req.body.editedLastName.trim())
  const lastNameError = validateLastName(editedLastName)

  if (lastNameError) {
    return res.json({ lastNameError })
  }

  const col = db.collection('users')

  try {
    const { value } = await col.findOneAndUpdate(
      { _id: mongodb.ObjectID(req.session.userID) },
      { $set: { lastName: editedLastName } },
      { returnOriginal: false }
    )

    const userName = value.firstName + ' ' + value.lastName

    db.collection('posts').updateMany(
      { userID: req.session.userID },
      { $set: { userName } }
    )

    db.collection('posts').updateMany(
      {},
      { $set: { 'replies.$[element].userName': userName } },
      { arrayFilters: [{ 'element.userID': req.session.userID }] }
    )

    req.session.userName = userName
    res.json({ lastName: value.lastName })
  } catch (err) {
    console.log(err)
  }
})

app.put('/changePassword', async (req, res) => {
  const col = db.collection('users')

  try {
    const { password } = await col.findOne(
      { _id: mongodb.ObjectID(req.session.userID) },
      { projection: { _id: 0, password: 1 } }
    )

    const passwordMatches = await bcrypt.compare(
      req.body.currentPassword,
      password
    )

    if (!passwordMatches)
      return res.json({ currentPasswordError: 'Wrong password' })

    const newPasswordError = validatePassword(req.body.newPassword)

    if (newPasswordError) {
      return res.json({ newPasswordError })
    }

    const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 10)

    col.updateOne(
      { _id: mongodb.ObjectID(req.session.userID) },
      { $set: { password: hashedNewPassword } }
    )

    res.json({})
  } catch (err) {
    console.log(err)
  }
})

app.delete('/deleteAccount', async (req, res) => {
  const col = db.collection('users')

  try {
    const { password } = await col.findOne(
      { _id: mongodb.ObjectID(req.session.userID) },
      { projection: { _id: 0, password: 1 } }
    )

    const passwordMatches = await bcrypt.compare(req.body.password, password)

    if (!passwordMatches)
      return res.json({ deleteAccountError: 'Wrong password' })

    db.collection('posts').updateMany(
      { userID: req.session.userID },
      { $set: { userName: 'Deleted user', avatar: '' } }
    )

    db.collection('posts').updateMany(
      {},
      {
        $set: {
          'replies.$[element].userName': 'Deleted user',
          'replies.$[element].avatar': '',
        },
      },
      { arrayFilters: [{ 'element.userID': req.session.userID }] }
    )

    col.deleteOne({ _id: mongodb.ObjectID(req.session.userID) })

    res.json({})
  } catch (err) {
    console.log(err)
  }
})

app.post('/uploadAvatar', async (req, res) => {
  const dataUrl = req.body.dataUrl.split(',')[1]

  const binData = new Buffer(dataUrl, 'base64')

  const col = db.collection('users')

  try {
    col.updateOne(
      { _id: mongodb.ObjectId(req.session.userID) },
      { $set: { avatar: binData } }
    )

    db.collection('posts').updateMany(
      { userID: req.session.userID },
      { $set: { avatar: binData } }
    )

    db.collection('posts').updateMany(
      {},
      { $set: { 'replies.$[element].avatar': binData } },
      { arrayFilters: [{ 'element.userID': req.session.userID }] }
    )

    res.end()
  } catch (err) {
    console.log(err)
  }
})

app.delete('/removeAvatar', async (req, res) => {
  const col = db.collection('users')

  try {
    col.updateOne(
      { _id: mongodb.ObjectId(req.session.userID) },
      { $set: { avatar: '' } }
    )

    db.collection('posts').updateMany(
      { userID: req.session.userID },
      { $set: { avatar: '' } }
    )

    db.collection('posts').updateMany(
      {},
      { $set: { 'replies.$[element].avatar': '' } },
      { arrayFilters: [{ 'element.userID': req.session.userID }] }
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
