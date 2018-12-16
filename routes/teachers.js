var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Question = mongoose.model('Question');
let Group = mongoose.model('Group');
let Answer = mongoose.model('Answer');
var path = require('path');
var ObjectId = require('mongoose').Types.ObjectId; 
/* GET home page. */
router.get('/codes', function (req, res, next) {
  //GET TEACHER ID FROM INJECTION AUTH SERVICE
  console.log(mongoose.Types.ObjectId(req.user._id))
  let query = Group.find({ "teacherId": req.user._id }).select({ "code": 1, "name":1,"imageString":1,"description":1});
  query.exec(function (err, codes) {
    if (err)
      return next(new Error("No codes found"));
      console.log(codes)
    res.json(codes);
  });
});

/* GET all questions with possible answers. */
router.get('/questions', function (req, res, next) {
  let query = Question.find({}).populate("exhibitor");
  query.exec(function (err, questions) {
    if (err || questions.length == 0)
      return next(new Error("No questions found"));
      console.log(questions)
    res.json(questions);
  });
});

/* GET all questions with answers from groups from the given . */
router.get('/groupquestions', function (req, res, next) {
  //GET TEACHER FROM AUTH
  //TO DO Filter out non answered questions (or not?)
  let query = Group.find({ "teacherId": req.user._id }, "name imageString answers.answer").populate({path: "answers.question", populate: {path: "exhibitor"}});
  query.exec(function (err, groups) {
    if (err || groups.length == 0)
      return next(new Error("No questions found"));
    let questionArray = [];
    groups.forEach(group => {
     
      group.answers.forEach(answer => {
        console.log(answer)
        //Check if its possible to change answer.question instead of creating new object
       let question = answer.question.toObject();
        question.group = {name: group.name};
        question.answer = {answer: answer.answer};
        questionArray.push(question)
      })

    });
    //console.log(questionArray)
    res.json(questionArray);
  });
});

/*GET Single group*/
router.get("/group/:group", function(req,res,next){
 Group.populate(req.group,{path: "answers.question", populate: {path:"exhibitor"}},function(err, group) {
  console.log(group)
  res.json(group);
 });
});

/*GET image*/ 
router.get("/image/:imageString", function(req, res,next) {
  res.sendFile(path.resolve("uploads/"+req.params.imageString));
});

router.post('/makegroups', function (req, res, next) {
  let amount = req.body.amount;
  console.log(amount)
  if(amount > 0) {
  //TODO Get teacher id from auth method
  let groups = [];
  //Vraag voor async code te checken
  //TEST ASYNC
 let counter = {counter:5};
 let promiseArray = [];

let codesObject = [];  
  Group.find({}, {_id: 0,code :1}).exec(function(err, codes){
  Object.keys(codes).map(function(key) {  
    codesObject[codes[key].code]=1;;
  });
  
    for(let i = 0; i < amount;i++) {
     let group = new Group({ teacherId: req.user._id });
     let code = generateCode(codesObject);
    
  
      
      groups.push(new Group({ teacherId: req.user._id, code: code, answers: [] }));
    }
    console.log(groups.length)
    Group.insertMany(groups, () => res.json(groups));
  })      
} else {
  res.status(400);
  res.send("Aantal moet meer dan 0 zijn")
}
  
  /*for (var i = 0; i < amount; i++) {
    var test = generateCode();
    test.then(function(codeR)  {
      groups.push(new Group({ teacherId: 0, code: codeR }));
      if(i == amount-1) 
        Group.insertMany(groups, () => res.send(groups));
    })
    console.log(test)
   
  }

  Group.insertMany(groups, () => res.send(groups));*/
  


});

router.delete("/removegroups", function (req, res, next) {
  Group.deleteMany({ teacherId: req.user._id }, function (err, response) {
    res.status(204);
    res.send("Codes deleted")
  })
})

router.delete("/removegroup/:group", function (req, res, next) {
  let group = req.group;
    console.log(group)
    if (group == null) {
      return next(new Error(""))
    }
   
      group.remove(function (err) {
        if (err) {
          return next(err)
        }
        res.status(204)
        res.send("Group deleted")
      })
  
  
  //VRAGEN WELKE BETER IS
  /* if(req.group == null) {
     return next(new Error(""))
   }
   if(!(req.group.name != undefined)) {
     req.group.remove(function(err) {
         if(err) {
           return next(err)
         }
         res.status(204)
         res.send("Group deleted")
     }) 
   } else {
     res.status(400)
     res.send("Group has been chosen")
   }*/
})
//Get group
router.param("group", function (req, res, next, id) {
  console.log(id);
  let query = Group.findById(id).select({}).exec(function (err, group) {
    if (err) {
      return next(new Error("Group not found"));
    }
    console.log(group)
    req.group = group;
    return next();
  });

})

function generateCode(codes) {
  let code = Math.random().toString(36).substring(2, 7);
  
  if (code.length < 5)
    return generateCode(codes);
  //Check if code exists
  if(codes[code]==1)
    return generateCode(codes)
   codes[code]=1; 
  return code;
 /* let query = Group.findOne({ "code": code });
  return query.exec(function (err, group) {

    if (group == null)
      return code
    return generateCode()
  })*/

}

module.exports = router;
