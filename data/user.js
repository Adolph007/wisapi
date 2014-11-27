var mongoose = require("mongoose"),
    models = require("./model"),
    _ = require('lodash');

function UserData(){
    this.model = models.user;
}

UserData.prototype.add = function(phone, pwd, callback){
    var _this = this;
    var user = new this.model({
	phone: phone,
	pwd: pwd,
    });
    user.save(function(err){
	callback(err, paper);
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
