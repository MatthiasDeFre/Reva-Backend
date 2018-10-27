var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Group = mongoose.model('Group');
let Exhibtor = mongoose.model('Exhibitor');
let Question = mongoose.model('Question');
let Answer = mongoose.model('Answer');
/* GET home page. */

//GET Group
router.get('/group/:code', function(req, res, next) {
  let query = Group.findOne({code: req.params.code},function(err, group){
 
    if(err || group == null) {
      res.status(404)
      res.json("Not found")
    } else {
      res.json(group)
    }
  })
});

/*GET Existing categories*/ 
router.get("/categories", function(req, res, next) {
  let query = Exhibtor.find().distinct("category", function(err, categories){
    console.log(categories)
    res.json(categories);
  });
})

//GET the next exhibitor with questions
router.get("/exhibitor/:group", function(req, res, next) {
  console.log("test")
  let group = req.group;
  //Check if previous answer has been filled in => 
  //if not resend last retrieved exhibitor
  if(group.answers.length > 0 && !group.answers[group.answers.length-1].answer) {
    console.log("has open question")
    //SINGLE QUESTION
    Answer.populate(group.answers[group.answers.length-1], {select: "body", path: "question", populate: {path: "exhibitor"}}, function(err, answerpop){
      let exhibitorObject = answerpop.question.exhibitor.toObject();
      exhibitorObject.question = {_id:answerpop.question._id, body: answerpop.question.body};
      res.json(exhibitorObject);
    });
    //MULTIPLE QUESTIONS
    /*Group.populate(group, {select: "body", path: "answers.question", populate: {path: "exhibitor",}}, function(err, questions) {
      //TO DO Check if all exhibitor share the same id, if not data model is broken and group should be removed
      let exhibitorObject = questions.answers[questions.answers.length-1].question.exhibitor.toObject();
     exhibitorObject.questions = [];
     let tempQuestions = questions.answers.filter(value => {
       return !value.answer
     })
     tempQuestions.forEach(question =>{
      console.log(questions)
      exhibitorObject.questions.push({_id: question.question._id, body: question.question.body})
     }); 
      res.json(exhibitorObject);
    })*/
  } else {
  //TODO Check if all previous answers have been filled in

  Exhibtor.findOne({}).sort({visits: -1}).limit(1).exec(function(err, exhibitor) {
    //Filter out all fields except body => PossibleAnswers = PossibleCheating
    Question.find({exhibitor: exhibitor._id}, {body:1}).exec(function(err, questions) {
      let exhibitorObject = exhibitor.toObject()
      console.log(exhibitor._id)

      //SINGLE QUESTION
      let question = questions[Math.floor(Math.random()*questions.length)];
      exhibitorObject.question= question;
      group.answers.push(new Answer({question: question._id}))
      //MULTIPLE QUESTIONS
     /* exhibitorObject.questions= questions;
      questions.forEach(question => {
        group.answers.push(new Answer({question: question._id}))
      })*/
      group.save(function(err) {
        res.json(exhibitorObject)
      })
    })
  })
}
});
//Answer a question for the given group
//Method gets the group and then appends the answer to the answerstring property of the last answer object
router.post('/answer/:group', function(req, res, next) {
 let group = req.group;
 let answers = req.body.answers;
 console.log(req.body)
 let countdown = answers.length;
 answers.forEach(answer => {
  --countdown
   if(!group.answers[countdown].answer)
     group.answers[countdown].answer = answer
 })
 group.save(function(err) {
  if (err) { return next(err); }   
  //check what to return
  res.json("ok");
});
});

//Get group
router.param("group", function(req, res, next, id) {
  let query = Group.findById(id).select({"answers": 1}).exec(function(err, group) {
    if(err) {
      return next(new Error("Group not found"));
    }
    req.group = group;
    return next();
  });
 
})


module.exports = router;
