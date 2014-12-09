var util = require("util"),
    fs = require("fs"),
    data = require("../data"),
    formidable = require('formidable'),
    config = require("../config").Config,
    logger = require('../logger')(config.get('env'), config.get('logger'));
    CSV = require('../csv'),
    status = require('../status'),
    _ = require("lodash");

function MessageApi(){

};

function parseForm(req, cb){
    var form = new formidable.IncomingForm();
    form.on('error', function (error) {
	logger.error("Paper add: parse form err..." + util.inspect(error));
    });
    form.parse(req, function(err, fields, files){
	cb(err, fields, files);
    });
};

MessageApi.prototype.add = function(req, res, next){
    parseForm(req, function(err, params, files){
	var type = params.type;
	var desc = params.desc;
	var content = params.content;
	var title = params.title;
	console.log("type:" + type + ", desc:" + desc + ", content:" + content);
	if(type == 1){
	    data.growth.add(title,desc,content, function(err, growth){
		if(err){
		    res.status(200).json({code:status.error.addpaper});
		}else{
		    res.status(200).json({code:status.ok, data:growth});
		}
	    });
	}else if(type == 2){
	    data.dependency.add(title,desc,content, function(err, dependency){
		if(err){
		    res.status(200).json({code:status.error.addpaper});
		}else{
		    res.status(200).json({code:status.ok, data:dependency});
		}
	    });
	}else if(type ==3){
	    data.readings.add(title,desc,content, function(err, readings){
		if(err){
		    res.status(200).json({code:status.error.addpaper});
		}else{
		    res.status(200).json({code:status.ok, data:readings});
		}
	    });
	}
    });
};

MessageApi.prototype.list = function(req, res, next){
    var _this = this;
    data.paper.getPapers(function(err, data){
	logger.info("paper list: %s", util.inspect(data));
	res.status(200).json(data);
    });
};

MessageApi.prototype.getMessage = function(req, res, next){
    var _this = this;
    var paperId = req.param("id");
    data.paper.getPaper(paperId, function(err, data){
	logger.info("paper list: %s", util.inspect(data));
	res.status(200).json(data);
    });
};


MessageApi.prototype.submitPaper = function(req, res, next){
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

exports.MessageApi = MessageApi;
