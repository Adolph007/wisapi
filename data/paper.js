var mongoose = require("mongoose"),
    models = require("./model"),
    _ = require('lodash');

function PaperData(){
    this.model = models.paper;
}

PaperData.prototype.addPaper = function(title, opts, rv, u, v, dimensions, qs){
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
};

exports.PaperData = PaperData;
