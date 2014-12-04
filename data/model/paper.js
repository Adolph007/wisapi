var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require("lodash");

var Dim = {
	name  : {type: String},
	exp   : {type: String}
    };

var PaperSchema = new Schema({
    title     : {type: String },
    opts      : [String],
    qs        : [String],
    dims      : [Dim],
    u         : {type: Number, default: 1}, 
    v         : {type: Number, default: 1}, 
    rv        : {type: Number, default: 5},
    disable   : {type: Number, default: 1},
    created_at: {type: Number, default: Date.now},
    created_by: {type: String, default: ""},
    updated_at: {type: Number, default: Date.now},
    updated_by: {type: String, default: ""}
});

exports = module.exports = mongoose.model("paper", PaperSchema);
