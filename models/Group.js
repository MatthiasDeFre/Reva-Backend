var mongoose = require('mongoose');

var AnswerSchema = mongoose.Schema({
    answer: String,
    question: {type: mongoose.Schema.Types.ObjectId, ref: "Question"},
})

var GroupSchema = mongoose.Schema({
    //Change to objectId later
    teacherId: Number,
    name: String,
    code : String,
    imageString: String,
    answers: [AnswerSchema]
})

mongoose.model('Group', GroupSchema);
mongoose.model('Answer', AnswerSchema);