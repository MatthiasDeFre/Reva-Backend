var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');

let Question = mongoose.model('Question');
let Group = mongoose.model("Group");
let Answer = mongoose.model("Answer")
let Exhibitor = mongoose.model("Exhibitor")
router.get('/reset', function(req, res, next) {
  mongoose.connection.db.dropDatabase()
  res.send("ok");
});

router.get('/seed', function(req, res, next) {
  let quest = new Question({body: "test", posted: new Date(), possibleAnswers: ["Answer 1", "Answer 2"]});
  let quest2 = new Question({body: "test2", posted: new Date(), possibleAnswers: ["Answer 1"]});
  
  let exhibitor = new Exhibitor({name: "jan", category:"Test"});
  let exhibitor2 = new Exhibitor({name: "jan", category:"Test2"});
  let exhibitor3 = new Exhibitor({name: "jan", category:"Test3"});

  let query = Question.insertMany([quest, quest2]);
  let query2 = Exhibitor.insertMany([exhibitor, exhibitor2, exhibitor3])
  query.then(() => query2.then(() =>res.send("seeding ok")));
  
});

//Create group with force added questions
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

function createEmptyAnswer(questions) {
  let answers = [];
  for(var i =0; i < questions.length; i++) {
    answers.push(new Answer({question: questions[i]._id}));
  }
  console.log(questions.length);
  return answers;
}
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
function generateCode() {
  let code = Math.random().toString(36).substring(2, 7);
  
  if(code.length < 5)
    return generateCode();
  //Check if code exists
  let query = Group.findOne({"code":code});
  query.exec(function(err, group) {
    
    if(group == null)
      return code
    return generateCode()
  })
  
}

module.exports = router;
