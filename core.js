var fs = require('fs'),
    request = require('request'),
    path = require('path'),
    formidable = require('formidable'),
    https = require('https'),
    http = require('http'),
    querystring = require("querystring"),
    uuid = require('node-uuid'),
    AWS = require('aws-sdk'),
    status = require('./status'),
    async = require('async'),
    Thumbnailer = require('./thumbnailer').Thumbnailer,
    config = require('./config').Config;

AWS.config.region = config.get('region');
var s3 = new AWS.S3();

var parseStream = function (req, fileId,  callback) {
    var form = new formidable.IncomingForm();
    // form.uploadDir = config.tmpdir;
    form.on('fileBegin', function(name, file) {
	file.path = config.get('tmpdir') + fileId;
    });
    form.on('file', function(name, file){
	callback(null, file); 
    });
    form.on('error', function (error) {
        callback(error,  null);
    });
    form.parse(req);
};

var validateForm = function(target, callback){
    callback(null);
};


var createThumb = function(w, h, partfile, fileSuffix, cb){
    var thumbnailer = new Thumbnailer();
    var description = {width:w, height:h, format:fileSuffix};
    var work = [];
    work.push(function(done){
	thumbnailer.execute(description, partfile.path, function(err, convertedImagePath, stat) {
	    if (err) {
		cb(err, null);
	    }else{
		console.log("converted path: " + convertedImagePath);
		cb(null, convertedImagePath, stat);
	    }
	});
    });
    async.parallel(work);
};

var saveThumb = function(thumbpath, format, rawid, rawname, stat){
    var uploadstream = fs.createReadStream(thumbpath);
    var fileSuffix = path.extname(thumbpath);
    var thumbname = path.basename(rawname, fileSuffix) + format + fileSuffix;
    var thumbkey = getPrefix(thumbpath) + rawid + format+ fileSuffix;
    var metainfo = {filename: thumbname, orgfileid: rawid};
    var data = {Bucket:config.get('bucket_thumb'), Key: thumbkey, Body: uploadstream, ContentLength:stat.size,  Metadata:metainfo};
    s3.putObject(data, function(err, data) {
	if (err) {
	    console.log("error occurred when upload thumb to s3: " + err);
	} else {

	}
    });
	    
};

exports.upload = function(req, res){
    var fileId = uuid.v4();
    parseStream(req, fileId, function (error, partfile) {
	if (error) {
            console.log("parse form streaming error!");
	}
 	var uploadstream = fs.createReadStream(partfile.path);
	var fileSuffix = path.extname(partfile.name);
	var k = getPrefix(partfile.name) + fileId + fileSuffix;
	var metainfo = {filename: partfile.name};
	var data = {Bucket:config.get('bucket_lesschat'), Key: k, Body: uploadstream, ContentLength:partfile.size,  Metadata:metainfo};
	if(partfile.type){
	    data.ContentType = partfile.type;
	}else{
	    data.ContentType = getContentTypeByFile(partfile.name);
	}
	console.log("start uploading ..." + data.Key + "    Body: "+ data.Body);
	s3.putObject(data, function(err, data) {
	    if (err) {
		console.log("error occurred when upload to s3: " + err);
		res.status(200).json({code:status.error.putobjectfailed, file:partfile});
	    } else {
		var result = {id:fileId, size:partfile.size, type:partfile.type, name:partfile.name};
		res.status(200).json({code:status.ok, data:result});
		if(isPicture(partfile.name)){
		    var w = 110, h = 120;
		    var format = w + "x" + h;
		    console.log("creating thumb ....");
		    createThumb(w, h, partfile, fileSuffix, function(err, thumbpath, stat){
			console.log("path is: " + thumbpath);
			saveThumb(thumbpath, format, fileId, partfile.name, stat);
		    });
		}
	    }
	});
	
    });
};

exports.getFile = function(req, res){
    downloadFromS3(req, res, config.get('bucket_lesschat'));
};

exports.getThumb = function(req, res){
    downloadFromS3(req, res, config.get('bucket_thumb'));
};

function downloadFromS3(req, res, bucketname){
    var fileId = req.param("fid");
    var k = getPrefix(fileId) + fileId;
    var params = {Bucket: bucketname, Key: k};
    s3.getObject(params, function(err, data){
	if (err) {
	    console.log(err, err.stack); 
	}
	else{
	    var fileName = encodeURIComponent(data.Metadata.filename);
	    res.set({
		'Content-Type': data.ContentType,
		'Content-Length': data.ContentLength,
		'Content-Disposition': 'attachment; filename=' + fileName
	    });
	    res.send(data.Body);
	}
    });
};


function isPicture(fileName){
    return (/([^\\s]+(\.(jpg|png|gif|bmp))$)/i.test(fileName));
}

function getPrefix(fileName){
    if(/([^\\s]+(\.(jpg|png|gif|bmp))$)/i.test(fileName)){
	return 'images/';
    }else{
	return '';
    }
}

function getContentTypeByFile(fileName) {
    var rc = 'application/octet-stream';
    var fn = fileName.toLowerCase();

    if (fn.indexOf('.html') >= 0) rc = 'text/html';
    else if (fn.indexOf('.css') >= 0) rc = 'text/css';
    else if (fn.indexOf('.json') >= 0) rc = 'application/json';
    else if (fn.indexOf('.js') >= 0) rc = 'application/x-javascript';
    else if (fn.indexOf('.png') >= 0) rc = 'image/png';
    else if (fn.indexOf('.jpg') >= 0) rc = 'image/jpg';

    return rc;
}
