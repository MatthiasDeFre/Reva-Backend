var mongoose = require('mongoose');

var QuestionSchema = mongoose.Schema({
    body: String,
    posted: Date,
    possibleAnswers: [String]
})

mongoose.model('Question', QuestionSchema);