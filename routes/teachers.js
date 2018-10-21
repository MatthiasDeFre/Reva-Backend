var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Question = mongoose.model('Question');
let Group = mongoose.model('Group');
let Answer = mongoose.model('Answer');
/* GET home page. */
router.get('/codes', function (req, res, next) {
  //GET TEACHER ID FROM INJECTION AUTH SERVICE
  let query = Group.find({ "teacherId": 0 }).select({ "code": 1, "name":1});
  query.exec(function (err, codes) {
    if (err)
      return next(new Error("No codes found"));
    res.json(codes);
  });
});

/* GET all questions with possible answers. */
router.get('/questions', function (req, res, next) {
  let query = Question.find({});
  query.exec(function (err, questions) {
    if (err || questions.length == 0)
      return next(new Error("No questions found"));
      console.log(questions)
    res.json(questions);
  });
});

/* GET all questions with answers from groups from the given . */
router.get('/groupquestions', function (req, res, next) {
  let query = Group.find({ "teacherId": req.query.teacherId }).populate("answers.question");
  query.exec(function (err, groups) {
    if (err || groups.length == 0)
      return next(new Error("No questions found"));
    let questionArray = [];
    groups.forEach(group => {
      group.answers.forEach(answer => {
        //Check if its possible to change answer.question instead of creating new object
        answer.question = "test"
        let test = {
          group: { name: group.name, image: group.imageString },
          //question: {body: answer.question.body, possibleAnswers: answer.question.possibleAnswers},
          question: answer.question,
          answer: answer.answer
        }
        questionArray.push(test)
      })

    });
    //console.log(questionArray)
    res.json(questionArray);
  });
});

router.post('/makegroups', function (req, res, next) {
  let amount = req.query.amount;

  //TODO Get teacher id from auth method
  let groups = [];
  //Vraag voor async code te checken
  Group.find({}, {_id: -1,code :1}).exec(function(err, codes){
    for(let i = 0; i < amount;i++) {
     
      groups.push(new Group({ teacherId: 0, code: generateCode(codes) }));
    }
    Group.insertMany(groups, () => res.send(groups));
  }) 
  
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
  Group.deleteMany({ teacherId: 0 }, function (err, response) {
    res.status(204);
    res.send("Codes deleted")
  })
})

router.delete("/removegroup/", function (req, res, next) {
  Group.findById(req.query.group).select({"name": 1}).exec(function (err, group) {
    console.log(group)
    if (err)
      next(new Error("error"))
    if (group == null) {
      return next(new Error(""))
    }
    if (!(group.name != undefined)) {
      group.remove(function (err) {
        if (err) {
          return next(err)
        }
        res.status(204)
        res.send("Group deleted")
      })
    } else {
      res.status(400)
      res.send("Group has been chosen")
    }
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
  let query = Group.findById(id).select({ "code": 1, "name": 1 }).exec(function (err, group) {
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
  if(codes.includes(code))
    return generateCode(codes)
  return code;
 /* let query = Group.findOne({ "code": code });
  return query.exec(function (err, group) {

    if (group == null)
      return code
    return generateCode()
  })*/

}
async function loop(amount, groups) {
  for (let i = 0; i < amount; i++) {
    let coder;  
    coder = await generateCode();
   console.log(coder)
    groups.push(new Group({ teacherId: 0, code: coder }));
  }
}
module.exports = router;
