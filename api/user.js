var util = require("util"),
    fs = require("fs"),
    data = require("../data"),
    redis = require("../redis"),
    formidable = require('formidable'),
    config = require("../config").Config,
    logger = require('../logger')(config.get('env'), config.get('logger'));
    CSV = require('../csv'),
    status = require('../status'),
    crypto = require('crypto'),
    _ = require("lodash");

var shasum = crypto.createHash('sha1'); 

function UserApi(){

};

UserApi.prototype.register = function(req, res, next){
    console.log("phone:" + req.body.phone);
    var phone = req.body.phone;
    var pwd = req.body.pwd;
    var code = req.body.code;
    redis.get("vcode:" + phone, function(err, vcode){
	if(err){
	    res.status(200).json({code:1001});
	}else{
	    if(!code && code.trim().length ==4 && code == vcode ){
		shasum.update(pwd); 
		var d = shasum.digest('hex');
		data.user.add(phone, d, function(err, result){
		    if(err){
			res.status(200).json({code:1001});
		    }else{
			res.status(200).json({code:0, data:result});
		    }
		});
	    }else{
		res.status(200).json({code:417});
	    }
	}
    });
};


UserApi.prototype.genvcode = function(req, res, next){
    var phone = req.body.phone;
    var code = "6543";
    console.log("gen vcode for:" + phone);
    redis.set("vcode:" + phone, code, function(err){
	if(err){
	    res.status(200).json({code:1001});
	}else{
	    res.status(200).json({code:0});
	}
    });
};

UserApi.prototype.sigin = function(req, res, next){
    var phone = req.body.phone;
    var pwd = req.body.pwd;
    // var code = req.body.code;
    if(!phone && phone.trim().length > 11){
	data.user.findByPhone(phone, function(err, result){
	    if(err){
		res.status(200).json({code:1001});
	    }else{
		if(pwd == result.pwd){
		    res.status(200).json({code:0, data:result});
		    return;
		}
		res.status(200).json({code:417});
	    }
	});
    }else{
	res.status(200).json({code:417});
    }
};

exports.UserApi = UserApi;
