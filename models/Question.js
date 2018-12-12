var mongoose = require('mongoose');

var QuestionSchema = mongoose.Schema({
    body: String,
    posted: Date,
    possibleAnswers: [String],
    type : String,
    exhibitor: {type: mongoose.Schema.Types.ObjectId, ref: "Exhibitor"},
    category: String
})

mongoose.model('Question', QuestionSchema);


//Answers : exhibitors, 
//