var mongoose = require('mongoose');

var AnswerSchema = mongoose.Schema({
    answer: String,
    question: {type: mongoose.Schema.Types.ObjectId, ref: "Question"},
    counter: Number
})

var CategorySchema = mongoose.Schema({
    name: String,
    exhibitor: {type: mongoose.Schema.Types.ObjectId, ref: "Exhibitor"}
})


var GroupSchema = mongoose.Schema({
    //Change to objectId later
    teacherId: {type: mongoose.Schema.Types.ObjectId, ref: "User", index: true},
    name: String,
    code : {type: String, unique: true},
    imageString: String,
    description: String,
    categories: [CategorySchema],
    answers: [AnswerSchema]
})

GroupSchema.methods.isChosen = function(toCheck, cb) {
    let group = this.model("Group").find({code: toCheck}, )
}
mongoose.model('Group', GroupSchema);
mongoose.model('Answer', AnswerSchema);
mongoose.model("CategoryEx", CategorySchema)
