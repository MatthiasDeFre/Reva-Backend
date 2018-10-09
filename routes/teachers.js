var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/codes', function(req, res, next) {
  res.send([{code: "code"},{code:"code1"}, {code:"code2"}]);
});

module.exports = router;
