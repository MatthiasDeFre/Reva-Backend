var express = require('express');
var router = express.Router();

let mongoose = require('mongoose');
let Question = mongoose.model('Question');

/* GET home page. */
router.get('/questions', function(req, res, next) {
  
  let query = Question.find();
  query.exec(function(err, questions){
    if (err) 
        return next(err); 
     res.json(questions);
  })
});

module.exports = router;
