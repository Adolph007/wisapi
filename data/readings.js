var mongoose = require("mongoose"),
    models = require("./model"),
    _ = require('lodash');

function ReadingData(){
    this.model = models.reading;
}

ReadingData.prototype.add = function(title, desc, content, callback){
    var _this = this;
    var reading  = new this.model({
	title: title,
	desc: desc,
	content: content
    });
    reading.save(function(err){
	callback(err, reading);
    });
};

ReadingData.prototype.getLatest = function(callback){
    var _this = this;
    var criteria = {created_at: {$lt: Date.now()}};

    this.model.find(criteria, 'title created_at').sort({'created_at': -1}).limit(1).exec(function(err, readings){
	callback(err, readings[0]);
    });
};


ReadingData.prototype.getReading = function(readingId, callback){
    var _this = this;
    var criteria = {'_id': readingId};

    this.model.findOne(criteria, function(err, reading){
	callback(err, reading);
    });
};

exports.ReadingData = ReadingData;
