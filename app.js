var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
let passport = require('passport');
//Mongoose setup
var mongoose = require('mongoose');

//Need to use option newUrlParser because of deprecation
//(node:17724) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
mongoose.connect('mongodb://localhost/revadb', {useNewUrlParser: true});
require("./models/Category");
require("./models/Exhibitor");
require("./models/Question");
require("./models/Group");
require("./models/User");
require('./config/passport');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var general = require('./routes/general');
var teachers = require('./routes/teachers');
var students = require('./routes/student');
var ergoStudents = require('./routes/ergo');
var test = require('./routes/test');

var app = express();
let cors = require('cors');
app.use(cors({origin: "*", credentials: true}));


console.log(" ___      ___             ____\n|   \\    |     \\       / /    \\\n| ___\\   |___   \\     / /______\\\n|     \\  |       \\   / /        \\\n|      \\ |___     \\./ /          \\\n====================================\n:: Node.js Backend ::  (v0.2.6.ALHPA)\nCopyright Team 07 XD")
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

//ROUTING PATHS
app.use('/', index);
app.use('/API/users', users);
app.use("/API/general", general);
app.use("/API/teachers", teachers);
app.use("/API/student", students);
app.use("/API/ergo", ergoStudents);
app.use("/API/test", test);
app.use("/API/admin", admin);
//app.use("/API/ergo", ergoStudents);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
 
  res.status(err.status || 500);
  res.send('error');
});


module.exports = app;
