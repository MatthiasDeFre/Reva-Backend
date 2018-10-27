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
  let query = Group.find({ "teacherId": 0 }, "name imageString answers.answer").populate({path: "answers.question", populate: {path: "exhibitor"}});
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

  
  Group.find({}, {_id: 0,code :1}).exec(function(err, codes){
   var codes = Object.keys(codes).map(function(key) {
    return codes[key].code;
  });
    for(let i = 0; i < amount;i++) {
     let group = new Group({ teacherId: 0 });
     let codeObject = generateCode(codes);
    
      codes = codeObject.codes;
      
      groups.push(new Group({ teacherId: 0, code: codeObject.code }));
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
  Group.deleteMany({ teacherId: 0 }, function (err, response) {
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
  let query = Group.findById(id).select({ "code": 1, "name": 1 }).exec(function (err, group) {
    if (err) {
      return next(new Error("Group not found"));
    }
    console.log(group)
    req.group = group;
    return next();
  });

})
function generateGroupLoop(counterObject) {
  
  findGroupAsync().then(generateCodeAsync().then(function(code) {
    let group = new Group({teacherId:0, code: code});
    group.save((err)=> {
      counter.counter--;
      if(counter.counter!=0) {
        //Keep going with loop
        generateGroupLoop(counterObject);
      }
    });
  }))
}
function generateCodeAsync() {
  let unique = false;
  let code;
  return findGroupAsync().then((group) => {
    if(group == null)
      generateCodeAsync().then(function(codeR) {
        code = codeR;
      });
    else
      return code;
  })   
}
function testAsync() {
  return findGroupAsync().then((response) => {
    if(response.response == null)
      return findGroupAsync();
    else
      return new Group({teacherId: 0, code: response.code}).save();
  })
}
function findGroupAsync(code) {
  
  return Group.find({code: code}).exec(function(response) {
      return {response: response, code: code};
  })
}
function generateCode(codes) {
  let code = Math.random().toString(36).substring(2, 7);

  if (code.length < 5)
    return generateCode(codes);
  //Check if code exists
  if(codes.includes(code))
    return generateCode(codes)
   codes.push(code); 
  return {code: code, codes: codes};
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
