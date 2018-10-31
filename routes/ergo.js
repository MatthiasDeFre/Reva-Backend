var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Question = mongoose.model('Question');
/* GET home page. */
router.get('/questions', function(req, res, next) {
  //FILTER FOR STUDENTNUMBER
  let query = Question.find({}).populate("exhibitor");
  query.exec(function (err, questions) {
    if (err || questions.length == 0)
      return next(new Error("No questions found"));
      console.log(questions)
    res.json(questions);
  });
});
/* GET home page. */
router.post('/question/', function(req, res, next) {
  let question = new Question({body: req.body.body, possibleAnswers: req.body.possibleAnswers, exhibitor: req.exhibitor._id, posted: new Date()});
  question.save(function(err, question){
    if(err)
      return next(err)
    //Populate exhibitor
    res.json(question);
  })
});
router.put('/question/:question', function(req, res, next) {
  let question = req.question;
  question.body = req.body.body;
  question.possibleAnswers = req.body.possibleAnswers;
  question.exhibitor = req.body.exhibitor._id; 
  //populate exhibitor
  res.send(question);
});
router.delete('/question/:question', function(req, res, next) {
  let question = req.question;
  question.remove(function(err){
    if(err)
      return next(err);
    res.json(question)
  })
});
router.param("question", function (req, res, next, id) {
  console.log(id);
  let query = Question.findById(id).populate("exhibitor").exec(function (err, question) {
    if (err) {
      return next(new Error("Exhibitor not found"));
    }
    console.log(question)
    req.question = question;
    return next();
  });
})
module.exports = router;
