var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let ObjectID = require('mongodb').ObjectID;

let Question = mongoose.model('Question');
let Group = mongoose.model("Group");
let Answer = mongoose.model("Answer")
let Exhibitor = mongoose.model("Exhibitor")
let Category = mongoose.model("Category")
router.get('/reset', function(req, res, next) {
  mongoose.connection.db.dropDatabase()
  res.send("ok");
});

//Method to seed database
router.get('/seed', function(req, res, next) { 
  let exhibitor = new Exhibitor({name: "RolStoel Inc", category:"Rolstoelen", coordinates: {xCo: 600, yCo: 600}});
  let exhibitor2 = new Exhibitor({name: "Sport & Co.", category:"Sport", coordinates: {xCo: 600, yCo: 600}});
  let exhibitor3 = new Exhibitor({name: "Hulpmiddel.com", category:"Hulpmiddelen", coordinates: {xCo: 600, yCo: 600}});

  let quest = new Question({body: "Uit welk materiaal wordt een rolstoel gemaakt?", posted: new Date(), possibleAnswers: ["Aluminium", "Titanium"], exhibitor: exhibitor._id, type: "TEXT"});
  let quest2 = new Question({body: "Met hoeveel wordt een match van rolstoel voetbal gespeeld?", posted: new Date(),exhibitor: exhibitor3._id,type:"PHOTO"});
  
  let group = new Group({teacherId: 0, name: "Groep 1", code: "1234",imageString: "/tijdCodeVoorUniek",answers:[{answer:"een antwoord", question: quest._id, counter: 1}] })
  
  let category = new Category({name: "Rolstoelen"});
  let category2 = new Category({name: "Hulpmiddellen"});
  let category3 = new Category({name: "Sport"});

  let query = Question.insertMany([quest, quest2]);
  let query2 = Exhibitor.insertMany([exhibitor, exhibitor2, exhibitor3])
  let query3 = Group.insertMany([group])
  let query4 = Category.insertMany([category, category2, category3])
  query2.then(() => query.then(() =>query3.then(() =>query4.then(() =>res.send("seeding ok")))));
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
