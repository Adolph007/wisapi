var util = require("util"),
    data = require("../data"),
    formidable = require('formidable'),
    config = require("../config").Config,
    logger = require('../logger')(config.get('env'), config.get('logger'));
    csv = require('ya-csv'),
    util = require('util'),
    _ = require("lodash");

function PaperApi(){

};

PaperApi.prototype.add = function(req, res, next){
    var fields = {};
    var form = new formidable.IncomingForm();
    // form.onPart = function (part) {
    //     if (part.filename) {
    //         fields['filename'] = part.filename;
    // 	    var reader = csv.createCsvFileReader({'comment': '#'});
    // 	    reader.addListener('data', function(data) {
    // 		console.log("data:"+ data);
    // 	    });

    // 	    part.on('data', function(buffer) {
    // 		// Pipe incoming data into the reader.
    // 		reader.parse(buffer);
    // 	    });
    // 	    part.on('end', function() {
    // 		reader.end();
    // 	    });
    //     }
    //     else {
    //         form.handlePart(part);
    //     }
    // };
    // form.on('field', function (name, value) {
    //     fields[name] = value;
    // });
    form.on('error', function (error) {
	logger.error("Paper add: parse form err...");
    });
    form.parse(req, function(err, fields, files){
	// logger.info("Paper add: after parse...%s, keys: %s", util.inspect(fields), util.inspect(files));	
	var qf = files.questionfile;
	var reader = csv.createCsvFileReader(qf.path, {'comment': '#'});	
	reader.addListener('data', function(data) {
	    console.log("data:" + util.inspect(data));
	});
    });

};

exports.PaperApi = PaperApi;;
