var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');

let Question = mongoose.model('Question');

router.get('/reset', function(req, res, next) {
  mongoose.connection.db.dropDatabase()
  res.send("ok");
});

router.get('/seed', function(req, res, next) {
  let quest = new Question({body: "test", posted: new Date(), possibleAnswers: ["Answer 1", "Answer 2"]});
  let quest2 = new Question({body: "test2", posted: new Date(), possibleAnswers: ["Answer 1"]});
 
  let query = Question.insertMany([quest, quest2]);
  query.then(() => res.send("seeding ok"));
  
});
  

module.exports = router;
