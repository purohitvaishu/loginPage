const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('./auth_config');
const Users = require('../models').Users;

// serialize and deserialize
passport.serializeUser((user, done) => {
  done(null, user.uid);
});
passport.deserializeUser((uid, done) => {
  Users.findByPk(uid).then((user) => {
    done(null, user);
  }).catch(done);
});

passport.use(new GoogleStrategy({
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.callbackURL
},
  (accessToken, refreshToken, profile, done) => {
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