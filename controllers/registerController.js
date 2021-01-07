const express = require("express");
const Users = require('../models').Users;
const router = express.Router();

router.post('/', async (req, res) => {
  if (!req.body.fname) {
    return res.status(400).send({
      success: 'false',
      message: 'First Name is required'
    });
  } else if (!req.body.lname) {
    return res.status(400).send({
      success: 'false',
      message: 'Last Name is required'
    });
  } else if (!req.body.email) {
    return res.status(400).send({
      success: 'false',
      message: 'Email id is required'
    });
  } else if (!req.body.uname) {
    return res.status(400).send({
      success: 'false',
      message: 'user name is required'
    });
  } else if (!req.body.pass) {
    return res.status(400).send({
      success: 'false',
      message: 'password is required'
    });
  } else if (!req.body.cnumber) {
    return res.status(400).send({
      success: 'false',
      message: 'Contact info is required'
    });
  }

  const user = await Users.findOne({
    attributes: ['uid'],
    where: { emailId: req.body.email, uname: req.body.uname }
  })
  try {
    const user = await Users.create({
      fname: req.body.fname,
      lname: req.body.lname,
      emailId: req.body.email,
      uname: req.body.uname,
      password: req.body.pass,
      contact: req.body.cnumber
    })
    try {
      req.session.userId = user.uid;
      return res.redirect('/login/user')
    }
    catch (error) {
      console.log(error)
      return res.send('Error in creating user')
    }
  }
  catch (error) {
    console.log(error)
    res.send('User already exist')
  }
})

//export this router to use in our index.js
module.exports = router;