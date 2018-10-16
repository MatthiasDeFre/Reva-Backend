var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Group = mongoose.model('Group');
/* GET home page. */
router.get('/codes', function(req, res, next) {
  let query = group.
  res.send([{code: "code"},{code:"code1"}, {code:"code2"}]);
});

//Answer a question for the given group
//Method gets the group and then appends the answer to the answerstring property of the last answer object
router.post('/answer/:group', function(req, res, next) {
 let group = req.group;
 console.log(group.answers[group.answers.length-1]);
 group.answers[group.answers.length-1].answer = req.body.answer;
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
