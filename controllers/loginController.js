const express = require("express");
const Users = require('../models').Users;
const router = express.Router();

router.post('/', async (req, res) => {
  if (!req.body.uname) {
    return res.status(400).send({
      success: 'false',
      message: 'user name is required'
    });
  } else if (!req.body.pass) {
    return res.status(400).send({
      success: 'false',
      message: 'password is required'
    });
  }
  const user = await Users.findOne({
    where: { uname: req.body.uname, password: req.body.pass }
  })
  try {
    req.session.userId = user.uid;
    req.session.save();
    res.redirect('/login/user');
  }
  catch (error) {
    console.log(error)
    res.redirect('/login');
  };
});

//export this router to use in our server.js
module.exports = router;