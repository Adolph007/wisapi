var mongoose = require("mongoose"),
    models = require("./model"),
    _ = require('lodash');

function UserData(){
    this.model = models.user;
}

UserData.prototype.addBaby = function(uid, nick, sex, born, height, weight, rel, degree,  callback){
    var _this = this;
    var user = new this.model({
	uid  : uid,
	nick : nick,
        sex  : sex,
        born : born,
        height: height,
	weight: weight,
        relation: rel,
        degree:degree
    });
    user.save(function(err){
	callback(err, user);
    });
};

UserData.prototype.add = function(phone, pwd, uid, callback){
    var _this = this;
    var user = new this.model({
	uid  : uid,
	phone: phone,
	pwd: pwd,
    });
    user.save(function(err){
	callback(err, user);
    });
};

UserData.prototype.findByPhone = function(phone, callback){
    var _this = this;
    var criteria = {phone:phone};
    this.model.find(criteria).exec(function(err, user){
	callback(err, user);
    });
};

exports.UserData = UserData;
