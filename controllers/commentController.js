const Comments = require('../models').Comments
const PostComments = require('../models').PostComments
const express = require('express')
const router = express.Router();

router.post('/', async (req, res) => {
  const comment = await Comments.create({
    comment: req.body.str,
    comment_sender_name: req.body.name,
    c_id: req.body.id
  })
  try {
    res.send({ success: true })
  }
  catch (err) {
    console.log(err);
    return res.send(err);
  }
})

module.exports = router