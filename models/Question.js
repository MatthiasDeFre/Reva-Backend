var mongoose = require('mongoose');

var QuestionSchema = mongoose.Schema({
    body: String,
    posted: Date
})

mongoose.model('Question', QuestionSchema);