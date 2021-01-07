const passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
const Users = require('../models').Users;
const config = require('./auth_config');

// serialize and deserialize
passport.serializeUser((user, done) => {
  done(null, user.uid);
});
passport.deserializeUser((uid, done) => {
  Users.findByPk(uid).then((user) => {
    done(null, user);
  }).catch(done);
});

passport.use(new FacebookStrategy({
  clientID: config.facebook.clientId,
  clientSecret: config.facebook.clientSecret,
  callbackURL: config.facebook.callbackURL
}, (accessToken, refreshToken, profile, done) => {
  process.nextTick(() => {
    const values = {
      where: {
        'uname': profile.displayName
      },
      defaults: {
        'fname': profile.name.givenName,
        'lname': profile.name.familyName,
        'emailid': profile.emails[0].value
      }
    };
    Users.findOrCreate(values)
      .spread((user, created) => {
        return done(null, user)
      })
      .catch((err) => {
        return done(err)
      })
  })
}));

module.exports = passport;