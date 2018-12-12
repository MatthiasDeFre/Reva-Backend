var mongoose = require('mongoose');
var CoordinateSchema = mongoose.Schema({
    xCo : Number,
    yCo : Number
 },{_id: false})
var ExhibitorSchema = mongoose.Schema({
    name: String,
    score : Number,
    category : [{type: String, index: true}],
    coordinates: CoordinateSchema 
})



mongoose.model('Exhibitor', ExhibitorSchema);
mongoose.model('Coordinate', CoordinateSchema);