var util = require("util"),
    fs = require("fs"),
    data = require("../data"),
    formidable = require('formidable'),
    config = require("../config").Config,
    logger = require('../logger')(config.get('env'), config.get('logger'));
    CSV = require('../csv'),
    status = require('../status'),
    _ = require("lodash");

function AdminApi(){

};

function parseForm(req, cb){
    var form = new formidable.IncomingForm();
    form.on('error', function (error) {
	logger.error("Paper add: parse form err...");
    });
    form.parse(req, function(err, fields, files){
	var qf = files.questionfile;
	fs.readFile(qf.path, "utf8", function(err, res) {
	    var data = new CSV(res).parse();
	    var ques = [];
	    data.forEach(function(record){
		ques.push(record[0]);
	    });
	    var opts = fields.options.split(";");
	    console.log("dimstring:" + fields.dimstring);
	    var dims = new CSV(fields.dimstring).parse();
	    var dimensions = [];
	    dims.forEach(function(dim){
		dimensions.push({name:dim[0], exp:dim[1]});
	    });
	    console.log("dims:" + util.inspect(dimensions));
	    cb(fields.title, opts, ques, fields.rv, fields.u, fields.v, dimensions);
	});
    });
};

AdminApi.prototype.addpaper = function(req, res, next){
    var _this = this;
    console.log("add ....");
    parseForm(req, function(title, opts, questions, rv, u, v, dims){
	data.paper.addPaper(title, opts, rv,u,v,dims, questions, function(err, paper){
	    if(err){
		res.status(404);
	    }else{
		res.redirect('/console/listpaper');
	    }
	});
    });
};

AdminApi.prototype.listpaper = function(req, res, next){
    var _this = this;
    data.paper.getPapers(function(err, data){
	logger.info("paper list: %s", util.inspect(data));
	res.status(200).json(data);
    });
};

exports.AdminApi = AdminApi;
