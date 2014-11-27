var mongoose = require("mongoose"),
    models = require("./model"),
    _ = require('lodash');

function PaperData(){
    this.model = models.paper;
}

PaperData.prototype.addPaper = function(title, opts, rv, u, v, dimensions, qs, callback){
    var _this = this;
    var dims = _.reduce(dimensions, function(result, item, key){
	result.push({
	    name: item.name,
	    exp: item.exp
	});
	return result;
    }, []);
    var paper = new this.model({
	title: title,
	opts: opts,
	rv: rv,
	u: u,
	v: v,
	dims: dims,
	qs:qs
    });
    paper.save(function(err){
	callback(err, paper);
    });
};

PaperData.prototype.getPapers = function(callback){
    var _this = this;
    var criteria = {};

    this.model.find(criteria, 'title created_at').sort({'created_at': -1}).exec(function(err, papers){
	callback(err, papers);
    });
};


exports.PaperData = PaperData;
