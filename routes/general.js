var express = require('express');
var router = express.Router();

let mongoose = require('mongoose');
let Question = mongoose.model('Question');
let Category = mongoose.model("Category");

/* GET home page. */
router.get('/questions', function(req, res, next) {
  
  let query = Question.find();
  query.exec(function(err, questions){
    if (err) 
        return next(err); 
     res.json(questions);
  })
});
router.get("/categories", function(req, res, next) {
  let query = Category.find();
})
module.exports = router;
