const express = require('express');
const phoneNo = express.Router();
const otpgenerator = require('otp-generator');
const Users = require('../models').Users;
const VerificationToken = require('../models').VerificationToken;

let otp = otpgenerator.generate(4, { alphabets: false, specialChars: false, digits: true, upperCase: false });
const accountSid = process.env.SMS_API;
const authToken = process.env.SMS_key;
const contact = process.env.CONTACT;

const phoneValue = (req, res) => {
  const client = require('twilio')(accountSid, authToken);
  client.messages.create(
    {
      to: req.body.pno,
      from: contact,
      body: otp,
    },
    (err, message) => {
      console.log(message.sid);
    });
}

phoneNo.post('/', async (req, res) => {
  const user = await Users.findOne({
    where: { 'contact': req.body.pno }
  })
  try {
    let pno = req.body.pno
    res.cookie('Phoneno', pno)
    const created = await VerificationToken.findOrCreate({
      where: { 'cno': req.body.pno },
      defaults: { 'cno': req.body.pno, 'userId': user.uid, 'token': otp }
    })
    try {
      if (!created) {
        const update = await VerificationToken.update({
          'token': otp,
          where: { 'cno': req.body.pno }
        })
        try {
          phoneValue();
          return res.redirect('/verify');
        }
        catch (error) {
          console.log(error)
        }
      }
      console.log('Created Successfully');
      phoneValue();
      return res.redirect('/verify');
    }
    catch {
      const created = await VerificationToken.findOrCreate({
        where: {
          'cno': req.body.pno
        },
        defaults: {
          'cno': req.body.pno,
          'token': otp
        }
      })
      try {
        let pno = req.body.pno
        res.cookie('Phoneno', pno)
        if (!created) {
          const updateUser = await VerificationToken.update(
            { 'token': otp },
            { where: { 'cno': req.body.pno } }
          )
          phoneValue();
          return res.redirect('/verify');
        }
        console.log('Created Successfully');
        phoneValue();
        return res.redirect('/verify');
      }
      catch (err) {
        console.log(err);
        return res.redirect('/login');
      }
    }
  }
  catch (err) {
    console.log(err);
  }
})

module.exports = phoneNo;