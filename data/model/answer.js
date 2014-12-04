var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require("lodash");

var AnswerSchema = new Schema({
    uid       : {type: String },
    qid       : {type: String },
    ans       : [Number]
});

exports = module.exports = mongoose.model("answer", AnswerSchema);
