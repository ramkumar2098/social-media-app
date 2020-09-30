const express = require('express')
const mongodb = require('mongodb')
const connectToDb = require('../app.js')

const router = express.Router()

let db
let col

setTimeout(async () => {
  try {
    db = await connectToDb()
    col = db.collection('posts')
  } catch (err) {
    console.log(err)
  }
})

const POST_MAX_LENGTH = 6000

router.get('/', async (req, res) => {
  try {
    const posts = await col
      .aggregate([
        {
          $addFields: {
            userLikedThisPost: { $in: [req.session.userID, '$likedBy'] },
            userDislikedThisPost: { $in: [req.session.userID, '$dislikedBy'] },
            userAuthoredThisPost: { $eq: ['$userID', req.session.userID] },
          },
        },
        { $project: { likedBy: 0, dislikedBy: 0 } },
        { $sort: { _id: -1 } },
      ])
      .toArray()

    const userLikedTheseReplies = posts.map(post =>
      post.replies.map(reply => reply.likedBy.includes(req.session.userID))
    )
    const userDislikedTheseReplies = posts.map(post =>
      post.replies.map(reply => reply.dislikedBy.includes(req.session.userID))
    )
    const userAuthoredTheseReplies = posts.map(post =>
      post.replies.map(reply => reply.userID === req.session.userID)
    )

    posts.forEach((post, i) => {
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

router.post('/addPost', async (req, res) => {
  if (req.body.post.length > POST_MAX_LENGTH)
    return res.send({ err: 'Post too long' })

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

router.post('/addReply', async (req, res) => {
  if (req.body.reply.length > POST_MAX_LENGTH)
    return res.send({ err: 'Reply too long' })

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
      { $push: { replies: reply } }
    )
  } catch (err) {
    console.log(err)
  }
})

router.put('/editPost', async (req, res) => {
  if (req.body.editedPost.length > POST_MAX_LENGTH)
    return res.send({ err: 'Post too long' })

  try {
    col.updateOne(
      { _id: mongodb.ObjectId(req.body._id) },
      { $set: { post: req.body.editedPost, edited: true } }
    )

    res.send({})
  } catch (err) {
    console.log(err)
  }
})

router.put('/editReply', async (req, res) => {
  if (req.body.editedReply.length > POST_MAX_LENGTH)
    return res.send({ err: 'Reply too long' })

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
      }
    )
    res.send({})
  } catch (err) {
    console.log(err)
  }
})

router.delete('/deletePost', async (req, res) => {
  try {
    col.deleteOne({ _id: mongodb.ObjectId(req.body._id) })
    res.end()
  } catch (err) {
    console.log(err)
  }
})

router.delete('/deleteReply', async (req, res) => {
  try {
    col.updateOne(
      { _id: mongodb.ObjectId(req.body._id) },
      { $pull: { replies: { id: mongodb.ObjectId(req.body.id) } } }
    )

    res.end()
  } catch (err) {
    console.log(err)
  }
})

router.post('/likePost', async (req, res) => {
  try {
    const [{ userDislikedThisPost }] = await col
      .aggregate([
        { $match: { _id: mongodb.ObjectId(req.body._id) } },
        {
          $project: {
            _id: 0,
            userDislikedThisPost: { $in: [req.session.userID, '$dislikedBy'] },
          },
        },
      ])
      .toArray()

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

router.post('/unlikePost', async (req, res) => {
  try {
    col.updateOne(
      { _id: mongodb.ObjectId(req.body._id) },
      { $pull: { likedBy: req.session.userID }, $inc: { likes: -1 } }
    )

    res.end()
  } catch (err) {
    console.log(err)
  }
})

router.post('/dislikePost', async (req, res) => {
  try {
    const [{ userLikedThisPost }] = await col
      .aggregate([
        { $match: { _id: mongodb.ObjectId(req.body._id) } },
        {
          $project: {
            _id: 0,
            userLikedThisPost: { $in: [req.session.userID, '$likedBy'] },
          },
        },
      ])
      .toArray()

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

router.post('/removeDislikePost', async (req, res) => {
  try {
    col.updateOne(
      { _id: mongodb.ObjectId(req.body._id) },
      { $pull: { dislikedBy: req.session.userID }, $inc: { dislikes: -1 } }
    )

    res.end()
  } catch (err) {
    console.log(err)
  }
})

router.post('/likeReply', async (req, res) => {
  try {
    const [{ userDislikedThisReply }] = await col
      .aggregate([
        { $match: { _id: mongodb.ObjectId(req.body._id) } },
        { $unwind: '$replies' },
        { $match: { 'replies.id': mongodb.ObjectId(req.body.id) } },
        {
          $project: {
            _id: 0,
            userDislikedThisReply: {
              $in: [req.session.userID, '$replies.dislikedBy'],
            },
          },
        },
      ])
      .toArray()

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

router.post('/unlikeReply', async (req, res) => {
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

router.post('/dislikeReply', async (req, res) => {
  try {
    const [{ userLikedThisReply }] = await col
      .aggregate([
        { $match: { _id: mongodb.ObjectId(req.body._id) } },
        { $unwind: '$replies' },
        { $match: { 'replies.id': mongodb.ObjectId(req.body.id) } },
        {
          $project: {
            _id: 0,
            userLikedThisReply: {
              $in: [req.session.userID, '$replies.likedBy'],
            },
          },
        },
      ])
      .toArray()

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

router.post('/removeDislikeReply', async (req, res) => {
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

module.exports = router
