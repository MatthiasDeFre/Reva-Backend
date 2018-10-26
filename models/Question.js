var mongoose = require('mongoose');

var QuestionSchema = mongoose.Schema({
    body: String,
    posted: Date,
    possibleAnswers: [String],
    exhibitor: {type: mongoose.Schema.Types.ObjectId, ref: "Exhibitor"}

})

mongoose.model('Question', QuestionSchema);


//Answers : exhibitors, 
//