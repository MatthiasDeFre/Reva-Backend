var mongoose = require('mongoose');
var CoordinateSchema = mongoose.Schema({
    xCo : Number,
    yCo : Number
 })
var ExhibitorSchema = mongoose.Schema({
    name: String,
    score : Number,
    category : {type: String, index: true, default: "Andere"},
    coordinates: CoordinateSchema 
})



mongoose.model('Exhibitor', ExhibitorSchema);