var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require("lodash");

var UserSchema = new Schema({
    uid       : {type: String},
    phone     : {type: String},
    pwd       : {type: String},
    nick      : {type: String},
    sex       : {type: Number},
    born      : {type: Number},
    height    : {type: Number},
    weight    : {type: Number},
    city      : {type: Number},
    relation  : {type: Number},
    degree    : {type: Number}
});

exports = module.exports = mongoose.model("user", UserSchema);
