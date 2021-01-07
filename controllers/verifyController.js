const Users = require('../models').Users;
const VerificationToken = require('../models').VerificationToken;
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const user = await Users.find({
    where: { emailId: req.query.emailId }
  })
  try {
    if (user.isVerified) {
      return res.status(202).json(`Email Already Verified`);
    } else {
      const foundToken = await VerificationToken.find({
        where: { token: req.query.verificationToken }
      })
      try {
        if (foundToken) {
          const updatedUser = await user.update({ isVerified: true })
          try {
            return res.status(403).json(`User with ${user.emailId} has been verified`);
          }
          catch (reason) {
            return res.status(403).json(`Verification failed`);
          }
        } else {
          return res.status(404).json(`Token expired`);
        }
      }
      catch (reason) {
        return res.status(404).json(`Token expired`);
      }
    }
  }
  catch (reason) {
    return res.status(404).json(`Email not found`);
  }
})

module.exports = router;