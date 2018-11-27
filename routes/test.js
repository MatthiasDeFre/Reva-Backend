var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let ObjectID = require('mongodb').ObjectID;

let Question = mongoose.model('Question');
let Group = mongoose.model("Group");
let Answer = mongoose.model("Answer")
let Exhibitor = mongoose.model("Exhibitor")
let Category = mongoose.model("Category")
let User = mongoose.model("User")
router.get('/reset', function(req, res, next) {
  mongoose.connection.db.dropDatabase()
  res.send("ok");
});

//Method to seed database
router.get('/seed', function(req, res, next) { 
  
  let user = new User({name: "Matthias De Fré", email:"matthiasdefre@hotmail.com", hash: "a05f30cd9a3098a0a0f2a15f3d1c2b0976dcc04a2079e55fa0331e3dbf4a2f6d180affa03253fc304a365714d6ae1ceff0aace878d99f7b8c6af30bace991a92", salt: "5767c251aa5922f9721f9bc19a490b566d04802dce22ce4ae1dd5fb81e7f189c", role : "ERGO"})
  let user2 = new User({name: "Matthias De Fré", email:"matthiasdefre2@hotmail.com", hash: "a05f30cd9a3098a0a0f2a15f3d1c2b0976dcc04a2079e55fa0331e3dbf4a2f6d180affa03253fc304a365714d6ae1ceff0aace878d99f7b8c6af30bace991a92", salt: "5767c251aa5922f9721f9bc19a490b566d04802dce22ce4ae1dd5fb81e7f189c", role : "TEACHER"})
  let user3 = new User({name: "Matthias De Fré", email:"matthiasdefre3@hotmail.com", hash: "a05f30cd9a3098a0a0f2a15f3d1c2b0976dcc04a2079e55fa0331e3dbf4a2f6d180affa03253fc304a365714d6ae1ceff0aace878d99f7b8c6af30bace991a92", salt: "5767c251aa5922f9721f9bc19a490b566d04802dce22ce4ae1dd5fb81e7f189c", role : "ADMIN"})

  let exhibitor = new Exhibitor({name: "RolStoel Inc", category:"Rolstoelen", coordinates: {xCo: 600, yCo: 600}});
  let exhibitor2 = new Exhibitor({name: "Sport & Co.", category:"Sport", coordinates: {xCo: 600, yCo: 600}});
  let exhibitor3 = new Exhibitor({name: "Hulpmiddel.com", category:"Hulpmiddelen", coordinates: {xCo: 600, yCo: 600}});
  let exhibitor4 = new Exhibitor({name: "Scoot Scoot", category:"Scooters", coordinates: {xCo: 600, yCo: 600}});
  let exhibitor5 = new Exhibitor({name: "Tiller", category:"Tilhulpmiddelen", coordinates: {xCo: 600, yCo: 600}});
  let exhibitor6 = new Exhibitor({name: "Loophul", category:"Loophulpmiddelen", coordinates: {xCo: 600, yCo: 600}});
  let exhibitor7 = new Exhibitor({name: "Domonica", category:"Domotica", coordinates: {xCo: 600, yCo: 600}});
  let exhibitor8 = new Exhibitor({name: "Lifter", category:"Huislifter", coordinates: {xCo: 600, yCo: 600}});
  let exhibitor9 = new Exhibitor({name: "Neckerman", category:"Vakantie en reizen", coordinates: {xCo: 600, yCo: 600}});
  let exhibitor10 = new Exhibitor({name: "Big Brother Inc", category:"Overheidsdiensten", coordinates: {xCo: 600, yCo: 600}});
  let exhibitor11 = new Exhibitor({name: "Zelfhulp", category:"Zelfhulpgroepen", coordinates: {xCo: 600, yCo: 600}});


  let quest = new Question({body: "Uit welk materiaal wordt een rolstoel gemaakt?", posted: new Date(), possibleAnswers: ["Aluminium", "Titanium"], exhibitor: exhibitor._id, type: "TEXT"});
  let quest2 = new Question({body: "Met hoeveel wordt een match van rolstoel voetbal gespeeld?", posted: new Date(),exhibitor: exhibitor2._id,type:"TEXT"});
  let quest3 = new Question({body: "Geef 3 voorbeelden van vaakgebruikte hulpmiddelen", posted: new Date(),exhibitor: exhibitor3._id,type:"TEXT"});
  let quest4 = new Question({body: "Trek een foto van een loophulpmiddel?", posted: new Date(),exhibitor: exhibitor4._id,type:"PHOTO"});
  let quest5 = new Question({body: "Trek een foto van een scooter?", posted: new Date(),exhibitor: exhibitor5._id,type:"PHOTO"});
  let quest6 = new Question({body: "Trek een foto van een tilhulpmiddel?", posted: new Date(),exhibitor: exhibitor6._id,type:"PHOTO"});
  let quest7 = new Question({body: "Trek een foto van een domitica hulpsysteem?", posted: new Date(),exhibitor: exhibitor7._id,type:"PHOTO"});
  let quest8 = new Question({body: "Trek een foto van een huislift?", posted: new Date(),exhibitor: exhibitor8._id,type:"PHOTO"});
  let quest9 = new Question({body: "Trek een foto van een vakantiebrochure?", posted: new Date(),exhibitor: exhibitor9._id,type:"PHOTO"});
  let quest10 = new Question({body: "Hoe helpt de overheid?", posted: new Date(),exhibitor: exhibitor10._id,type:"TEXT"});
  let quest11 = new Question({body: "Hoe werkt een zelfhulpgroep?", posted: new Date(),exhibitor: exhibitor11._id,type:"PHOTO"});

  let group = new Group({teacherId: 0, code: "1234",imageString: "/tijdCodeVoorUniek" })
  
  let category = new Category({name: "Rolstoelen"});
  let category2 = new Category({name: "Hulpmiddellen"});
  let category3 = new Category({name: "Sport"});

  let query = Question.insertMany([quest, quest2,quest3,quest4,quest5,quest6,quest7,quest8,quest9,quest10,quest11]);
  let query2 = Exhibitor.insertMany([exhibitor, exhibitor2, exhibitor3,exhibitor4,exhibitor5,exhibitor6,exhibitor7,exhibitor8,exhibitor9,exhibitor10,exhibitor11])
  let query3 = Group.insertMany([group])
  let query4 = Category.insertMany([category, category2, category3])
  let query5 = User.insertMany([user, user2, user3])
  query2.then(() => query.then(() =>query3.then(() =>query4.then(() => query5.then(()=> res.send("seeding ok"))))));
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
