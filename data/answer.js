var mongoose = require("mongoose"),
    models = require("./model"),
    _ = require('lodash');

function AnswerData(){
    this.model = models.answer;
};


AnswerData.prototype.add = function(pid, uid, ans, callback){
    var _this = this;
    var answer = new this.model({
	uid : uid,
	qid: pid,
	ans: ans
    });
    answer.save(function(err){
	callback(err, answer);
    });
};


exports.AnswerData = AnswerData;
