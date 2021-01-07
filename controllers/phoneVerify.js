const express = require('express');
const phoneVerified = express.Router();
const Users = require('../models').Users;
const VerificationToken = require('../models').VerificationToken;

phoneVerified.post('/', async (req, res) => {
  const phone = await VerificationToken.findOne({
    where: { 'cno': req.cookies.Phoneno, 'token': req.body.otp }
  })
  try {
    const user = await Users.findOrCreate({
      attributes: ['uid'],
      where: { 'contact': req.cookies.Phoneno }
    })
    try {
      const pno = await VerificationToken.destroy({
        where: { 'cno': req.cookies.Phoneno }
      })
      try {
        console.log('destroy Successfully.')
        req.session.userId = user.uid
        res.clearCookie(Phoneno);
        return res.redirect('/login/user/'+user.uid)
      }
      catch (err) {
        res.send(err);
      }
    }
    catch (err) {
      console.log(err);
    }
  }
  catch (err) {
    console.log(err + 'Invalid OTP please try again')
    res.redirect('/login')
  }
})

module.exports = phoneVerified;