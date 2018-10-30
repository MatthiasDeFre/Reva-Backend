var mongoose = require('mongoose');

var ExhibitorSchema = mongoose.Schema({
    name: String,
    score : Number,
    category : {type: String, index: true, default: "Andere"},
})

mongoose.model('Exhibitor', ExhibitorSchema);