var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let User = mongoose.model('User');
let passport = require('passport');
let jwt = require('express-jwt');
let auth = jwt({secret: process.env.BACKEND_SECRET});
let Settings = mongoose.model('Settings');

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
  user.name = req.body.name
  user.email = req.body.username;
  user.setPassword(req.body.password);
  Settings.findOne({}, "studentCode teacherCode", function(err, settings) {
    let inputCode = req.body.regcode
    console.log(inputCode)
    console.log(settings)
    if(inputCode == settings.studentCode)
      user.role = "ERGO"
    else if(inputCode == settings.teacherCode)
      user.role = "TEACHER"
    else {
      let error = new Error("Foute code")
      error.status = 400
      return next(error)
    }
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      return res.json({ token: user.generateJWT(), user: user });
    });
  });
  
});


router.get("/expodate", function(req, res,next) {

  Settings.findOne({},"expoDate", function(err,settings){
    console.log(settings.expoDate);
    if (settings.expoDate != null) {  
    return res.json({expoDate: settings.expoDate});
    }
  });
});

module.exports = router;
