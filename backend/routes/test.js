var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');

router.get('/reset', function(req, res, next) {
  res.send("server ok");
});
router.get('/seed', function(req, res, next) {
    res.send("server ok");
});
  

module.exports = router;
