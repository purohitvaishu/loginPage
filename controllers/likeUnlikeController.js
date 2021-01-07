const PostComments = require('../models').PostComments
const express = require('express')
const router = express.Router();

router.post('/', async (req, res) => {
  const count = await PostComments.findOne({
    attributes: ['totalLikes', 'totalUnlikes'],
    raw: true,
    where: {
      id: req.body.postId
    }
  })
  try {
    if (req.body.type === 'like') {
      const like = await PostComments.update({
        totalLikes: parseInt(count.totalLikes) + 1
      },
        {
          where: {
            id: req.body.postId
          }
        }
      )
      let data = parseInt(count.totalLikes) + 1
      res.send({ success: true, data });
    } else {
      const unlike = await PostComments.update({
        totalUnlikes: parseInt(count.totalUnlikes) + 1
      },
        {
          where: {
            id: req.body.postId
          }
        })
      let data = parseInt(count.totalUnlikes) + 1
      res.send({ success: true, data });
    }
  }
  catch (err) {
    console.log(err);
    res.send({ error });
  }
})

module.exports = router