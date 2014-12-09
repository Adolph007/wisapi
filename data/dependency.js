var mongoose = require("mongoose"),
    models = require("./model"),
    _ = require('lodash');

function DependencyData(){
    this.model = models.dependency;
}

DependencyData.prototype.add = function(title, desc, content, callback){
    var _this = this;
    var dependency  = new this.model({
	title: title,
	desc: desc,
	content: content
    });
    dependency.save(function(err){
	callback(err, dependency);
    });
};

DependencyData.prototype.getLatest = function(callback){
    var _this = this;
    var criteria = {created_at: {$lt: Date.now()}};

    this.model.find(criteria, 'title created_at').sort({'created_at': -1}).limit(1).exec(function(err, dependencys){
	callback(err, dependencys[0]);
    });
};


DependencyData.prototype.getDependency = function(dependencyId, callback){
    var _this = this;
    var criteria = {'_id': dependencyId};

    this.model.findOne(criteria, function(err, dependency){
	callback(err, dependency);
    });
};

exports.DependencyData = DependencyData;
