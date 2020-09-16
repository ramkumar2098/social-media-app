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

app.get('/profile', async (req, res) => {
  const col = db.collection('users')

  try {
    const user = await col
      .aggregate([
        { $match: { _id: mongodb.ObjectId(req.session.userID) } },
        { $project: { password: 0 } },
      ])
      .toArray()

    res.json(user[0])
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
      { _id: mongodb.ObjectID(req.body._id) },
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

/* db.posts.insertMany([
  {
    _id: '5f5c78c2d40d389b27ab5a55',
    userName: 'catman',
    userID: '5f4f80d2c9625d577565492f',
    post: 'key press',
    date: 1599126701660,
    edited: false,
    likedBy: [
      '5f4f80d2c9625d577565492a',
      '5f4f80d2c9625d577565492b',
      '5f4f80d2c9625d577565492c',
    ],
    likes: 3,
    dislikedBy: ['5f4f80d2c9625d577565492f', '5f4f80d2c9625d577565492e'],
    dislikes: 2,
    replies: [
      {
        id: '5f5c78c2d40d389b27ab5a52',
        userName: 'class',
        userID: '5f4f80d2c9625d577565492f',
        reply: 'yolo',
        date: 1599156793695,
        edited: true,
        likedBy: ['5f4f80d2c9625d577565492f'],
        likes: 1,
        dislikedBy: [],
        dislikes: 0,
        userLikedThisReply: true,
        userDislikedThisReply: false,
      },
      {
        id: '5f5c78c2d40d389b27ab5a53',
        userName: 'press',
        userID: '5f4f80d2c9625d577565492e',
        reply: 'summer',
        date: 1599126534281,
        edited: false,
        likedBy: [],
        likes: 0,
        dislikedBy: [],
        dislikes: 0,
        userLikedThisReply: false,
        userDislikedThisReply: false,
      },
    ],
    userLikedThisPost: false,
    userDislikedThisPost: true,
  },
  {
    _id: '5f5c78c2d40d389b27ab5a54',
    userName: 'asdf',
    userID: '5f4f80d2c9625d577565492e',
    post: 'lorem ipsum',
    date: 1599126701760,
    edited: true,
    likedBy: ['5f4f80d2c9625d577565492f', '5f4f80d2c9625d577565492e'],
    likes: 2,
    dislikedBy: ['5f4f80d2c9625d577565492g', '5f4f80d2c9625d577565492h'],
    dislikes: 2,
    replies: [
      {
        id: '5f5c78c2d40d389b27ab5a50',
        userName: 'zxcv',
        userID: '5f4f80d2c9625d577565492e',
        reply: 'ninja ipsum',
        date: 1599126793695,
        edited: false,
        likedBy: [],
        likes: 0,
        dislikedBy: ['5f4f80d2c9625d577565492f'],
        dislikes: 1,
        userLikedThisReply: false,
        userDislikedThisReply: true,
      },
      {
        id: '5f5c78c2d40d389b27ab5a51',
        userName: 'qwer',
        userID: '5f4f80d2c9625d577565492f',
        reply: 'super ipsum',
        date: 1599126834281,
        edited: false,
        likedBy: ['5f4f80d2c9625d577565492f'],
        likes: 1,
        dislikedBy: [],
        dislikes: 0,
        userLikedThisReply: true,
        userDislikedThisReply: false,
      },
    ],
    userLikedThisPost: true,
    userDislikedThisPost: false,
  },
]) */
