const express = require('express')
const logUser = express.Router();
const Users = require('../models').Users;
const PostComments = require('../models').PostComments;
const Following = require('../models').Following
const Comments = require('../models').Comments

logUser.get('/', async (req, res) => {
  const { userId } = req.session
  const user = await Users.findOne({
    where: { uid: userId }
  })
  try {
    const follower = await Following.findAll({
      attributes: ['followed_Id'],
      raw: true,
      where: {
        follower_Id: user.uid
      }
    })
    let followed_Id = []
    follower.forEach((follower) => {
      followed_Id.push(follower.followed_Id);
    })
    try {
      var post = await PostComments.findAll({
        raw: true,
        where: {
          $or: [{
            postId: userId
          },
          {
            postId: { $in: followed_Id }
          }]
        }
      })
      var comment = await Comments.findAll({
        raw: true
      })
      if (comment.length === 0) {
        comment = 0;
        res.render('home', { user, post, comment });
      } else {
        res.render('home', { user, post, comment });
      }
    }
    catch (err) {
      console.log(err);
      post = 0;
      comment = 0;
      res.render('home', { user, post, comment });
    }
  }
  catch (error) {
    console.log(error)
    res.redirect('/login');
  }
})

logUser.get('/:id', (req, res) => {
  let user = req.params.id
  res.render('details', { user })
})

logUser.post('/:id/details', async (req, res) => {
  const phone_user = await Users.update({
    fname: req.body.fname,
    lname: req.body.lname,
    emailid: req.body.email,
    password: req.body.pass
  }, {
      where: {
        uid: req.params.id
      }
    })
  try {
    res.redirect('/login/user')
  }
  catch (err) { console.log(err) }
})

module.exports = logUser