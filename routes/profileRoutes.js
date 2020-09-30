const express = require('express')
const bcrypt = require('bcrypt')
const mongodb = require('mongodb')
const connectToDb = require('../app.js')
const { capitalize, isHex } = require('../utils.js')
const {
  validateFirstName,
  validateLastName,
  validatePassword,
} = require('../validations.js')

const router = express.Router()

let db
let col

setTimeout(async () => {
  try {
    db = await connectToDb()
    col = db.collection('users')
  } catch (err) {
    console.log(err)
  }
})

router.get('/:userID', async (req, res) => {
  const userID = req.params.userID
  const userDoestExist = () => {
    res.statusMessage = "user doesn't exist"
    return res.status(404).end()
  }

  if (userID.length !== 24 || !isHex(userID)) return userDoestExist()

  try {
    const user = await col.findOne(
      { _id: mongodb.ObjectId(userID) },
      { projection: { password: 0 } }
    )

    if (!user) return userDoestExist()

    user.posts = await db.collection('posts').find({ userID }).count()

    res.send(user)
  } catch (err) {
    res.status(500).send(err)
    console.log(err)
  }
})

router.get('/', async (req, res) => {
  try {
    const user = await col.findOne(
      { _id: mongodb.ObjectId(req.session.userID) },
      { projection: { password: 0 } }
    )

    user.posts = await db
      .collection('posts')
      .find({ userID: req.session.userID })
      .count()

    res.send(user)
  } catch (err) {
    console.log(err)
  }
})

router.put('/editFirstName', async (req, res) => {
  const editedFirstName = capitalize(req.body.editedFirstName.trim())
  const firstNameError = validateFirstName(editedFirstName)

  if (firstNameError) {
    return res.json({ firstNameError })
  }

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

router.put('/editLastName', async (req, res) => {
  const editedLastName = capitalize(req.body.editedLastName.trim())
  const lastNameError = validateLastName(editedLastName)

  if (lastNameError) {
    return res.json({ lastNameError })
  }

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

router.put('/changePassword', async (req, res) => {
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

    const samePassword = await bcrypt.compare(req.body.newPassword, password)

    if (passwordMatches && samePassword)
      return res.json({ newPasswordError: 'Enter new password' })

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

router.delete('/deleteAccount', async (req, res) => {
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

router.post('/uploadAvatar', async (req, res) => {
  const dataUrl = req.body.dataUrl.split(',')[1]

  const binData = new Buffer(dataUrl, 'base64')

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

router.delete('/removeAvatar', async (req, res) => {
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

module.exports = router
