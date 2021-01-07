const express = require('express')
const list = express.Router()
const Following = require('../models').Following
const Users = require('../models').Users

list.get('/:uname', async (req, res) => {
  const user = await Users.findOne({
    raw: true,
    where: {
      uname: req.params.uname
    }
  })
  try {
    const follow = await Following.findOne({
      where: {
        follower_Id: req.session.userId,
        followed_Id: user.uid
      }
    })
    if (follow) {
      user.following = true
      return res.render('user_info', { user })
    } else {
      user.following = false
      return res.render('user_info', { user })
    }
  }
  catch(err){
    console.log(err);
   }
})

module.exports = list