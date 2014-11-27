var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require("lodash");

var UserSchema = new Schema({
    phone     : {type: String },
    pwd       : {type: String }
});

exports = module.exports = mongoose.model("paper", UserSchema);
