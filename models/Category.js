var mongoose = require('mongoose');

var CategorySchema = mongoose.Schema({
    name: String
})

mongoose.model('Category', CategorySchema);