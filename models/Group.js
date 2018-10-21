var mongoose = require('mongoose');

var AnswerSchema = mongoose.Schema({
    answer: String,
    question: {type: mongoose.Schema.Types.ObjectId, ref: "Question"},
})



var GroupSchema = mongoose.Schema({
    //Change to objectId later
    teacherId: {type: Number, index: true},
    name: String,
    code : String,
    imageString: String,
    answers: [AnswerSchema]
})

GroupSchema.methods.isChosen = function(toCheck, cb) {
    let group = this.model("Group").find({code: toCheck}, )
}
mongoose.model('Group', GroupSchema);
mongoose.model('Answer', AnswerSchema);