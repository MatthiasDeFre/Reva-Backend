var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Exhibitor = mongoose.model('Exhibitor');
let Category = mongoose.model('Category');
let Coordinate = mongoose.model('Coordinate');
let Settings = mongoose.model('Settings');
/* GET home page. */
router.get('/exhibitors', function (req, res, next) {
  //FILTER FOR STUDENTNUMBER
  let query = Exhibitor.find({});
  query.exec(function (err, exhibitors) {
    if (err || exhibitors.length == 0)
      return next(new Error("No exhibitors found"));
    console.log(exhibitors)
    res.json(exhibitors);
  });
});
/*GET All categories*/
/* GET home page. */
router.get('/categories', function (req, res, next) {
  //FILTER FOR STUDENTNUMBER
  let query = Category.find({});
  query.exec(function (err, categories) {
    if (err || categories.length == 0)
      return next(new Error("No categories found"));
    categories = categories.map(c => c.name)
    res.json(categories);
  });
});

router.get("/category/:category", function(req, res, next) {
  
  res.json(req.category);
})
/* GET home page. */
router.post('/exhibitor/', function (req, res, next) {
  console.log(req)
  let exhibitor = new Exhibitor({ name: req.body._name, category: req.body._category });
  exhibitor.save(function (err, exhibitor) {
    if (err)
      return next(err)
    res.json(exhibitor);
  })
});
router.post("/category/", function(req, res, next) {
  console.log(req.headers)
  let category = new Category({name: req.body.name});
  category.save(function(err, category) {
    if(err)
      return next(err)
    res.status(201)
    res.json(category)
  })
})
router.put('/exhibitor/:exhibitor', function (req, res, next) {

  let exhibitor = req.exhibitor;
  exhibitor.name = req.body._name;
  exhibitor.category = req.body._category;

  exhibitor.coordinates = new Coordinate({ xCo: req.body._coordinates.xCo, yCo: req.body._coordinates.yCo })
  exhibitor.save(function (err, exhibitor) {
    res.json(exhibitor);
  })

});
router.put("/category/:category", function(req, res, next) {
  let category = req.category;
  category.name = req.body.name;
  category.save((err, category) => {
    res.json(category)
  })
})
router.put('/settings/', function (req, res, next) {

  console.log(req.settings)
  Settings.update({}, {$set: {studentCode: req.body._studentCode, teacherCode: req.body._teacherCode,expoDate : req.body._expoDate}}, function(err, settings){
    res.json(settings);

  });
  /*
  let settings = req.settings;
  settings.studentCode = req.body._studentCode;
  settings.teacherCode = req.body._teacherCode;
  settings.expoDate = req.body._expoDate;

  console.log(settings);

  settings.save(function (err, settings) {
    res.json(settings);


  })*/

});

router.get("/settings/", function (req, res, next) {
  let query = Settings.findOne({});
  query.exec(function (err, settings) {
    
    if (err || settings.length == 0)
      return next(new Error("Settings were not found"));
    res.json(settings);

  })
});


router.delete('/exhibitor/:exhibitor', function (req, res, next) {
  let exhibitor = req.exhibitor;
  exhibitor.remove(function (err) {
    if (err)
      return next(err);
    res.json(exhibitor)
  })
});
router.delete("/category/:category", function(req, res, next) {
  req.category.remove(err => {
    if(err)
      return next(err)
    res.json(req.category)
  })
})
router.param("exhibitor", function (req, res, next, id) {
  console.log(id);
  let query = Exhibitor.findById(id).exec(function (err, exhibitor) {
    if (err) {
      return next(new Error("Exhibitor not found"));
    }
    console.log(exhibitor)
    req.exhibitor = exhibitor;
    return next();
  });
})
router.param("settings", function (req, res, next, id) {
  let query = Settings.findById(id).exec(function (err, settings) {
    if (err) {
      return next(new Error("Settings not found"));
    }
    req.settings = settings;
    return next();
  });
})
router.param("category", function (req, res, next, id) {
  console.log(id);
  let query = Category.findById(id).exec(function (err, category) {
    console.log(category)
    if (err) {
      return next(new Error("Category not found"));
    }
    if(!category)
      return res.status(404).send({message: "Categorie niet gevonden"})
    console.log(category)
    req.category = category;
    return next();
  });
})
module.exports = router;
