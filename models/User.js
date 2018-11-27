let mongoose = require('mongoose');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');

let UserSchema = new mongoose.Schema({
  name: {type: String},
  email: String,
  hash: String,
  salt: String,
  avatar: String,
  role : String
});

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(32).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, 'sha512')
    .toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  let hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, 'sha512')
    .toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
      exp: parseInt(exp.getTime() / 1000)
    },
    process.env.BACKEND_SECRET
  );
};

mongoose.model('User', UserSchema);
