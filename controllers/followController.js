const express = require("express")
const Following = require('../models').Following
const router = express.Router()
const Users = require('../models').Users

router.post('/:id', async (req, res) => {
  var str = req.body.redirect.split('_')
  const user = await Users.findOne({
    where: {
      uid: req.params.id
    }
  })
  try {
    if (str[0] === 'follow') {
      const follower = await Following.create({
        follower_Id: req.session.userId,
        followed_Id: str[1]
      })
      let following = true
      return res.render('user_info', { user: user, following })
    }
    if (str[0] === 'unfollow') {
      const follower = await Following.destroy({
        where: {
          follower_Id: req.session.userId,
          followed_Id: str[1]
        }
      })
      let following = false
      return res.render('user_info', { user: user, following })
    }
  }
  catch (err) {
    console.log(err);
  }
})

module.exports = router;