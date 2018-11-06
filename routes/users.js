var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let User = mongoose.model('User');
let passport = require('passport');
let jwt = require('express-jwt');
let auth = jwt({secret: process.env.BACKEND_SECRET});

/* GET users listing. */
router.post('/login', function(req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Please fill out all fields' });
  }
  console.log(req.body)
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (user) {
      return res.json({ 
        token: user.generateJWT(), user: user 
      });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.post('/register', function(req, res, next) {
  console.log(req.body);
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Please fill out all fields' });
  }
  if (req.body.username.length < 4 || req.body.password < 6) {
    return res.status(400).json({ message: 'Fields to short' });
  }
  
  let user = new User();
  user.name = req.body.name;
  user.email = red.body.email;
  user.setPassword(req.body.password);
  user.save(function(err) {
    if (err) {
      return next(err);
    }
    return res.json({ token: user.generateJWT(), user: user });
  });
});
module.exports = router;
