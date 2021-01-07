"use strict";

//import inbuilt module
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const ejs = require('ejs');
require('dotenv').config();

//import custom module
const loginUserConroller = require('./controllers/loginUserController');
const loginController = require('./controllers/loginController');
const userListController = require('./controllers/userListController');
const userDetailController = require('./controllers/userDetailController')
const followingUser = require('./controllers/followController');
const userPostController = require('./controllers/userPostController');
const likeUnlikeController = require('./controllers/likeUnlikeController');
const commentController = require('./controllers/commentController');
const registerController = require('./controllers/registerController');
const signUpController = require('./controllers/emailSignupController');
const verifyEmail = require('./controllers/verifyController');
const verifyPhone = require('./controllers/phoneSignupController');
const phoneVerify = require('./controllers/phoneVerify');
const passport_facebook = require('./auth/facebook');
const passport_google = require('./auth/google');
const app = express();
const view = __dirname + "/views/";

app.set('view engine', 'ejs');
//cors-cross-origin resource sharing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESS_SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: process.env.COOKIE_MAXAGE,
    sameSite: true,
    secure: false
  }
}));
app.use(passport.initialize())
app.use(passport.session())

//adding public folder files
app.use(express.static(path.join(__dirname, 'public')));

//for default redirection
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login')
  }
  next()
}
const redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/login')
  } else {
    next()
  }
}

//main page 
app.get('/', (req, res) => {
  const { userId } = req.session
  res.render('main', { user: userId })
});

//email verification login/signup
app.get('/auth/email', (req, res) => {
  res.sendFile(view + "email.html");
});
app.use('/signUp', redirectHome, signUpController);
app.use('/email-Verification', verifyEmail);

//phone otp verification 
app.get('/auth/phone', (req, res) => {
  res.sendFile(view + "phone.html");
});
app.use('/phoneLogin', redirectHome, verifyPhone);

//after sending otp
app.get('/verify', (req, res) => {
  res.sendFile(view + "otp_verify.html");
})
app.use('/phone-Verification', redirectHome, phoneVerify);

//Login page 
app.get('/login', (req, res) => {
  res.sendFile(view + "login.html");
});
app.use('/checkUser', redirectHome, loginController);

//home page
app.use('/login/user', redirectLogin, loginUserConroller);

//list of users
app.use('/login/user/allUsers', redirectLogin, userListController)

//user info
app.use('/login/user/user-info', redirectLogin, userDetailController)

//follow unfollow
app.use('/login/user/follow', redirectLogin, followingUser);

//post any data
app.use('/login/user/post', redirectLogin, userPostController);

//like or unlike post
app.use('/login/user/likeunlike', redirectLogin, likeUnlikeController);

//comments
app.use('/login/user/comment', redirectLogin, commentController);

//social login 
//for facebook
app.get('/auth/facebook',
  passport_facebook.authenticate('facebook')
);

app.get('/auth/facebook/callback',
  passport_facebook.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    req.session.userId = req.user.dataValues.uid;
    req.session.save();
    res.redirect('/login/user');
  });
// for google
app.get('/auth/google',
  passport_google.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport_google.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    req.session.userId = req.user.dataValues.uid;
    req.session.save();
    res.redirect('/login/user')
  }
);

//Signup page
app.get('/register', (req, res) => {
  res.sendFile(view + "signUp.html");
});
app.use('/register-error', redirectHome, registerController);

//logout page
app.get('/logout', redirectLogin, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/login/user')
    }
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.redirect('/login')
  })
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});