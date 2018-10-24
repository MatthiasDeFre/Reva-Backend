var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Group = mongoose.model('Group');
let Exhibtor = mongoose.model('Exhibitor');
let Question = mongoose.model('Question');
let Answer = mongoose.model('Answer');
/* GET home page. */
router.get('/codes', function(req, res, next) {
  
  res.send([{code: "code"},{code:"code1"}, {code:"code2"}]);
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
    
    //Put all open questions into an array
    let questions = [];
    group.answers.forEach(function(answer) {
      if(!answer.answer)
        questions.push(answer)
    });

    //Data model should be valid so questions[0] exhibitor == questions[n]
    //If not = not our problem ¯\_(ツ)_/¯
    Answer.populate(questions,{path: "question", select: "body exhibitor"}, function(err, answerpop) {
    /*  let exhibitorObject = answerpop.question.exhibitor.toObject();
      exhibitorObject.questions = questions;*/
    
      Exhibtor.findById(questions[0].question.exhibitor, function(err, exhibitor) {
        let exhibitorObject = exhibitor.toObject();
        exhibitorObject.questions = questions;
        res.json(exhibitorObject);
      });
    })
    
  } else {
  //TODO Check if all previous answers have been filled in

  Exhibtor.findOne({}).sort({visits: -1}).limit(1).exec(function(err, exhibitor) {
    //Filter out all fields except body => PossibleAnswers = PossibleCheating
    Question.find({exhibitor: exhibitor._id}, {body:1}).exec(function(err, questions) {
      let exhibitorObject = exhibitor.toObject()
      console.log(exhibitor._id)
      exhibitorObject.questions= questions;
      questions.forEach(question => {
        group.answers.push(new Answer({question: question._id}))
      })
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
