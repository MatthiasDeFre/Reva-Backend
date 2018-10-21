var mongoose = require('mongoose');

var ExhibitorSchema = mongoose.Schema({
    name: String,
    visits : Number
})

mongoose.model('Question', ExhibitorSchema);