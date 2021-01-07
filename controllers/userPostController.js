const express = require('express')
const logUser = express.Router();
const Users = require('../models').Users;
const PostComments = require('../models').PostComments;

logUser.post('/', async (req, res) => {
  const { userId } = req.session
  const user = await Users.findOne({
    where: { uid: userId }
  })
  try {
    const post = await PostComments.create({
      totalUnlikes: 0,
      postId: userId,
      postUname: user.uname,
      comment: req.body.comment,
      totalLikes: 0,
    })
    try {
      res.redirect('/login/user')
    }
    catch (err) {
      console.log(err)
      res.redirect('/login/user')
    }
  }
  catch (error) {
    console.log(error)
    res.redirect('/login');
  }
})

module.exports = logUser