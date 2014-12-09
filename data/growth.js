var mongoose = require("mongoose"),
    models = require("./model"),
    _ = require('lodash');

function GrowthData(){
    this.model = models.growth;
}

GrowthData.prototype.add = function(title, desc, content, callback){
    var _this = this;
    var growth  = new this.model({
	title: title,
	desc: desc,
	content: content
    });
    growth.save(function(err){
	callback(err, growth);
    });
};

GrowthData.prototype.getLatest = function(callback){
    var _this = this;
    var criteria = {created_at: {$lt: Date.now()}};

    this.model.find(criteria, 'title created_at').sort({'created_at': -1}).limit(1).exec(function(err, growths){
	callback(err, growths[0]);
    });
};


GrowthData.prototype.getGrowth = function(growthId, callback){
    var _this = this;
    var criteria = {'_id': growthId};

    this.model.findOne(criteria, function(err, growth){
	callback(err, growth);
    });
};

exports.GrowthData = GrowthData;
