var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Question = mongoose.model('Question');
let Exhibitor = mongoose.model('Exhibitor');
router.get('/question/:question', function(req, res, next) {
  //FILTER FOR STUDENTNUMBER
  res.json(req.question)
});

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

/*GET filtered exhibitors*/
router.get('/exhibitors', function(req, res, next) {
  let query;
  if(req.query.category) {
   query = Exhibitor.find({category:req.query.category}).select("name");   
  } else {
   query = Exhibitor.find({}).select("name");    
  }
   query.exec(function (err, exhibitors) {
//    console.log(exhibitors)
    if (err || exhibitors.length == 0)
      return next(new Error("No exhibitors found"));
     // console.log(exhibitors)
    res.json(exhibitors);
  });
});

/*GET Existing categories*/ 
router.get("/categories", function(req, res, next) {
  let query = Exhibitor.find().distinct("category", function(err, categories){
    res.json(categories);
  });
})

/* GET home page. */
router.post('/question/', function(req, res, next) {
  console.log(req.body)
  validateQuestion(req.body, function() {
  let question = new Question({body: req.body._body, possibleAnswers: req.body._answers, exhibitor: req.body._exhibitor._id, posted: new Date()});
  
   question.save(function(err, question){
    console.log(err)
     if(err)
      return next(err)
    //Populate exhibitor
    res.json(question);
  })     
})
});
router.put('/question/:question', function(req, res, next) {
  let question = req.question;
  console.log(req.body)
  question.body = req.body._body;
  question.possibleAnswers = req.body._answers;
  question.exhibitor = req.body._exhibitor._id; 
  //populate exhibitor
 question.save(function(err, q) {
  if(err)
    return next(err) 
  res.json(q);
 })
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
/*  router.delete("/removequestions", function (req, res, next) {
  Question.deleteMany({ ?????Id: 0 }, function (err, response) {
    res.status(204);
    res.send("Questions deleted")
  })
})  */

//HELPER FUNCTIONS
function validateQuestion(question, callback) {
  if(question.body.length < 10 || !questions.possibleAnswers) {
    return next(new Error("Invalid fields"));
  }
  //SEARCH FOR EXHIBITOR
  Exhibitor.findById(question._exhibitor._id, function(err, ex) {
    if(err || !exhibitor)
      return next(new Error("Exhibitor not found"))
    else
      //CONTINUE (would need to return promise otherwise)
      callback();
  })
}

module.exports = router;
