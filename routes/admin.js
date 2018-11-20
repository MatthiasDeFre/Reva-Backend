var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Exhibitor = mongoose.model('Exhibitor');
let Category = mongoose.model('Category');
/* GET home page. */
router.get('/exhibitors', function(req, res, next) {
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
router.get('/categories', function(req, res, next) {
  //FILTER FOR STUDENTNUMBER
  let query = Category.find({});
  query.exec(function (err, categories) {
    if (err || categories.length == 0)
      return next(new Error("No categories found"));
      categories = categories.map(c => c.name)
    res.json(categories);
  });
}); 
/* GET home page. */
router.post('/exhibitor/', function(req, res, next) {
  console.log(req.body)
  let exhibitor = new Exhibitor({name: req.body._name, category: req.body._category});
  exhibitor.save(function(err, exhibitor){
    if(err)
      return next(err)
    res.json(exhibitor);
  })
});
router.put('/exhibitor/:exhibitor', function(req, res, next) {
  let exhibitor = req.exhibitor;
  exhibitor.name = req.body.name;
  exhibitor.category = req.body.category;
  exhibitor.coordinates = req.body.coordinates
  res.send(exhibitor);
});
router.delete('/exhibitor/:exhibitor', function(req, res, next) {
  let exhibitor = req.exhibitor;
  exhibitor.remove(function(err){
    if(err)
      return next(err);
    res.json(exhibitor)
  })
});
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
module.exports = router;
