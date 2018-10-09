var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Mongoose setup
var mongoose = require('mongoose');

//Need to use option newUrlParser because of deprecation
//(node:17724) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
mongoose.connect('mongodb://localhost/revadb', {useNewUrlParser: true});
require("./models/Question");

var index = require('./routes/index');
var users = require('./routes/users');
var general = require('./routes/general');
var teachers = require('./routes/teachers');
var ergoStudents = require('./routes/ergo');
var test = require('./routes/test');

var app = express();
let cors = require('cors');
app.use(cors({origin: "*", credentials: true}));



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use("/API/general", general);
app.use("/API/teachers", teachers);
app.use("/API/test", test);
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
