var util = require("util"),
    fs = require("fs"),
    data = require("../data"),
    formidable = require('formidable'),
    config = require("../config").Config,
    logger = require('../logger')(config.get('env'), config.get('logger'));
    CSV = require('../csv'),
    status = require('../status'),
    _ = require("lodash");

function PaperApi(){

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

PaperApi.prototype.add = function(req, res, next){
    var _this = this;
    console.log("add ....");
    parseForm(req, function(title, opts, questions, rv, u, v, dims){
	data.paper.addPaper(title, opts, rv,u,v,dims, questions, function(err, paper){
	    if(err){
		res.status(200).json({code:status.error.addpaper});
	    }else{
		res.status(200).json({code:status.ok, data:paper});
	    }
	});
    });
};

PaperApi.prototype.list = function(req, res, next){
    var _this = this;
    data.paper.getPapers(function(err, data){
	logger.info("paper list: %s", util.inspect(data));
	res.status(200).json(data);
    });
};

PaperApi.prototype.getPaper = function(req, res, next){
    var _this = this;
    var paperId = req.param("id");
    data.paper.getPaper(paperId, function(err, data){
	logger.info("paper list: %s", util.inspect(data));
	res.status(200).json(data);
    });
};


PaperApi.prototype.submitPaper = function(req, res, next){
    var _this = this;
    var paperId = req.param("id");
    var answers = req.body.answers;
    var token = req.body.token;
    var uid = req.body.uid;
    redis.get("sid:" + token, function(err, session){
	if(err){
	    res.status(200).json({code:1001});
	}else if(uid == session){
	    data.answer.add(paperId, uid, answers, function(err, data){
		res.status(200).json(data);
	    });
	}else{
	    res.status(200).json({code:1001});
	}
    });
};

exports.PaperApi = PaperApi;
