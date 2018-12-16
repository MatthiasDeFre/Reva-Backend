var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Group = mongoose.model('Group');
let Exhibtor = mongoose.model('Exhibitor');
let Question = mongoose.model('Question');
let Answer = mongoose.model('Answer');
let CategoryEx = mongoose.model('CategoryEx');
//Multer setup
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    console.log("changen names");
    console.log("name" + file.originalname);
    if(!file.originalname.match(/\.(jpeg|png|jpg|wav)$/)) {
      console.log("error");
      var err = new Error();
      err.code = 'filetype';
      return cb(err);
    } else  {
      console.log("done") 
      cb(null, + Date.now() + "_" + file.originalname);
    }
   }
});
var upload = multer({ 
  storage: storage,
  limits: {fileSize: 10000000}
});


//GET Group
router.get('/group/:code', function(req, res, next) {
  let query = Group.findOne({code: req.params.code},function(err, group){
 
    if(err || group == null) {
      res.status(404)
      res.json("Not found")
    } else {
      res.json(group)
    }
  })
});

/*GET Existing categories*/ 
router.get("/categories", function(req, res, next) {
  let query = Exhibtor.find().distinct("category", function(err, categories){
    res.json(categories);
  });
})

//GET the next exhibitor with questions
router.post("/exhibitor/:group", function(req, res, next) {
  let group = req.group;
  console.log(group)
  //Check if previous answer has been filled in => 
  //if not resend last retrieved exhibitor
  if(group.answers.length > 0 && !group.answers[group.answers.length-1].answer) {
    console.log("has open question")
    //SINGLE QUESTION
    Answer.populate(group.answers[group.answers.length-1], {select: "body type counter category", path: "question", populate: {path: "exhibitor"}}, function(err, answerpop){
      let exhibitorObject = answerpop.question.exhibitor.toObject();
      exhibitorObject.question = {_id:answerpop.question._id, body: answerpop.question.body, counter: answerpop.counter, type: answerpop.question.type};
      answerpop.question.exhibitor.visits++;
      console.log(answerpop)
      exhibitorObject.category = answerpop.question.category 
      console.log(exhibitorObject)
      answerpop.question.exhibitor.save(() => {
        res.json(exhibitorObject);
      });
    })
    //MULTIPLE QUESTIONS
    /*Group.populate(group, {select: "body", path: "answers.question", populate: {path: "exhibitor",}}, function(err, questions) {
      //TO DO Check if all exhibitor share the same id, if not data model is broken and group should be removed
      let exhibitorObject = questions.answers[questions.answers.length-1].question.exhibitor.toObject();
     exhibitorObject.questions = [];
     let tempQuestions = questions.answers.filter(value => {
       return !value.answer
     })
     tempQuestions.forEach(question =>{
      console.log(questions)
      exhibitorObject.questions.push({_id: question.question._id, body: question.question.body})
     }); 
      res.json(exhibitorObject);
    })*/
  } else {
  //TODO Check if all previous answers have been filled in
  var categories = []
  var exhibitors = []
  group.categories.forEach(c => {
    categories.push(c.name)
    if(c.exhibitor)
      exhibitors.push(c.exhibitor)
  })

  Exhibtor.findOne({category: {$in: categories}, _id:{$nin: exhibitors}}).sort({visits: -1}).limit(1).exec(function(err, exhibitor) {
    //If exhibitor => undefined (loosen query  => only exhibitor not categories))
    //Filter out all fields except body => PossibleAnswers = PossibleCheating
    console.log(categories)
    Question.find({exhibitor: exhibitor._id}, {}).exec(function(err, questions) {
      let exhibitorObject = exhibitor.toObject()
      exhibitor.visits++;
      //SINGLE QUESTION
      let question = questions[Math.floor(Math.random()*questions.length)].toObject();
      question.counter = group.answers.length+1
      exhibitorObject.question= question;
      
      exhibitorObject.category = question.category 
      for(var i=0; i< categories.length;i++) {
        if(categories[i]==question.category)
        group.categories[i].exhibitor = exhibitorObject._id
      }
      group.answers.push(new Answer({question: question._id, counter: group.answers.length+1}))
      //MULTIPLE QUESTIONS
     /* exhibitorObject.questions= questions;
      questions.forEach(question => {
        group.answers.push(new Answer({question: question._id}))
      })*/
      console.log(exhibitorObject)
      group.save(function(err) {
        exhibitor.score += 1
        exhibitor.save(err => {
          res.json(exhibitorObject)
        })
      })
    })
  })
}
});

//Set name, body, img, categories of a group
router.post('/register/:group', upload.single('groupImage'), function(req, res, next) {
  console.log(req.body)
  if(!(req.file && req.body.name && req.body.categories)) {
    res.status(400)
    res.send("Er zijn lege velden") 
  } else {
  let group = req.group;

 group.imageString = req.file.filename; 
 group.name = req.body.name;
 group.description = req.body.description;
 console.log("body")
 console.log( req.body.categories)
 group.categories = req.body.categories.map(c => new CategoryEx({name: c.toString()}))
 
  group.save((err, group) => {
    if(err)
      return next(err)
    res.json(group)
  })     
 }
 });
 
//Answer a question for the given group
//Method gets the group and then appends the answer to the answerstring property of the last answer object
router.post('/answer/:group', function(req, res, next) {
 let group = req.group;
//SINGLE QUESTION
console.log(req.group)
let answer = req.body.answer;
group.answers[group.answers.length-1].answer=answer;
 group.save(function(err, group) {
  if (err) { return next(err); }   
  //check what to return
  res.json(group);
});
 //MULTIPLE QUESTIONS
 /*let answers = req.body.answers;
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
});*/
});
router.post('/answerPhoto/:group',upload.single("photo"), function(req, res, next) {
  let group = req.group;
 //SINGLE QUESTION
 console.log(req.group)
 let answer = req.file.filename;
 group.answers[group.answers.length-1].answer=answer;
  group.save(function(err, group) {
   if (err) { return next(err); }   
   res.json(group);
 });
 });
//Get group
router.param("group", function(req, res, next, id) {
  
  let query = Group.findById(id).select("answers categories").exec(function(err, group) {
    if(err) {
      return next(new Error("Group not found"));
    }
    req.group = group;
    return next();
  });
 
})


module.exports = router;
