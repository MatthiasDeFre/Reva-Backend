var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Question = mongoose.model('Question');
let Group = mongoose.model('Group');
let Answer = mongoose.model('Answer');
/* GET home page. */
router.get('/codes', function(req, res, next) {
  let query = Group.find({"teacherId" : req.query.teacherId}).select({"code":1});
  query.exec(function(err, codes){
    if(err || codes.length == 0)
      return next(new Error("No codes found"));
    res.send(codes);
  }); 
});

/* GET all questions with possible answers. */
router.get('/questions', function(req, res, next) {
  let query = Question.find({});
  query.exec(function(err, questions){
    if(err || questions.length == 0)
      return next(new Error("No questions found"));
    res.send(questions);
  }); 
});

/* GET all questions with answers from groups from the given . */
router.get('/groupquestions', function(req, res, next) {
  let query = Group.find({"teacherId": req.query.teacherId}).populate("answers.question");
  query.exec(function(err, groups){
    if(err || groups.length == 0)
      return next(new Error("No questions found"));
    let questionArray = [];
    groups.forEach(group => {
      group.answers.forEach(answer => {
        //Check if its possible to change answer.question instead of creating new object
       answer.question = "test"
        let test = {
          group: {name: group.name, image: group.imageString},
          //question: {body: answer.question.body, possibleAnswers: answer.question.possibleAnswers},
          question: answer.question,
          answer: answer.answer
        }
        console.log(answer.question)
        questionArray.push(test)
      })
      
    });
    //console.log(questionArray)
    res.send(questionArray);
  }); 
});

router.post('/makegroups', function(req, res, next) {
  let amount = req.query.amount;
  console.log(req.query.amount);
  let groups = [];
  let questionsQ = Question.find();
  questionsQ.exec((err, questions) => {

    for(var i=0; i < amount; i++) {
      //New group with random questionlist
      questions = shuffle(questions);
    //optional = generateCode();
     groups.push(new Group({teacherId: 0, code: generateCode(), name:"een naam",imageString:"een image", answers: createEmptyAnswer(questions)}));
    }
    console.log(groups);
    Group.insertMany(groups, () => res.send(groups));
   
  })
  //TODO
  //let visitId = req.visitId
  //GET visitId from db and check for teacher with user
 
});

function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
  }

  return array;
}

function createEmptyAnswer(questions) {
  let answers = [];
  for(var i =0; i < questions.length; i++) {
    answers.push(new Answer({question: questions[i]._id}));
  }
  console.log(questions.length);
  return answers;
}

function generateCode() {
  let code = Math.random().toString(36).substring(2, 7);
  
  if(code.length < 5)
    return generateCode();
  //Check if code exists
  let query = Group.findOne({"code":code});
  query.exec(function(err, group) {
    console.log(group)
    if(group == null)
      return code
    return generateCode()
  })
  
}

module.exports = router;
