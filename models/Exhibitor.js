var mongoose = require('mongoose');

var ExhibitorSchema = mongoose.Schema({
    name: String,
    visits : Number,
    category : {type: String, index: true, default: "Andere"}
})

mongoose.model('Exhibitor', ExhibitorSchema);