const crypto = require('crypto-random-string');
const { sendVerificationEmail } = require('./emailVerifyController');
const Users = require('../models');
const VerificationToken = require('../models').VerificationToken;
const express = require("express");
const router = express.Router();

router.post('/', async (req, res) => {
  const values = {
    where: { 'emailId': req.body.emailId },
    defaults: { 'emailId': req.body.emailId, 'password': req.body.pass }
  };
  const created = await Users.findOrCreate(values)
  try {
    if (!created) {
      return res.status(409).send('User with email address already exists');
    }
    const result = await VerificationToken.create({
      userId: user.uid,
      token: crypto(process.env.CRYPTO_HASH)
    })
    try {
      sendVerificationEmail(user.emailId, result.token);
      return res.status(200).json(`${user.emailId} account created successfully`);
    }
    catch (error) {
      res.status(500).send(error);
    }
  }
  catch (error) {
    res.status(500).send(error);
  }

});

module.exports = router;