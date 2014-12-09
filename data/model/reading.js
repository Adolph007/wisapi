var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require("lodash");

var ReadingSchema = new Schema({
    title     : {type: String },
    desc      : {type: String },
    content   : {type: String },
    disable   : {type: Number, default: 1},
    created_at: {type: Number, default: Date.now()},
    created_by: {type: String, default: ""},
    updated_at: {type: Number, default: Date.now()},
    updated_by: {type: String, default: ""}
});

exports = module.exports = mongoose.model("reading", ReadingSchema);
