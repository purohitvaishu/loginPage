const express = require('express')
const list = express.Router()
const Users = require('../models').Users
const Following = require('../models').Following

list.get('/', async (req, res) => {
  const count = await Users.count({ where: { uid: { $ne: req.session.userId } } })
  try {
    const user = await Users.findAll({
      raw: true,
      where: {
        fname: { $like: '%%' },
        uid: { $ne: req.session.userId }
      }
    })
    try {
      const followCount = await Following.count({
        where: {
          follower_Id: req.session.userId
        }
      })
      countId = { followC: followCount, unfollowC: count - followCount }
      return res.render('userList', { user: user, count: countId })
    }
    catch (error) {
      return res.status(500).send(error)
    }
  }
  catch (err) {
    console.log(err);
  }
})

module.exports = list