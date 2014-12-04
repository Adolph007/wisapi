var util = require("util"),
    fs = require("fs"),
    data = require("../data"),
    redis = require("../redis"),
    formidable = require('formidable'),
    config = require("../config").Config,
    logger = require('../logger')(config.get('env'), config.get('logger'));
    CSV = require('../csv'),
    status = require('../status'),
    _ = require("lodash");

function LocationApi(){

};

LocationApi.prototype.getCity = function(req, res, next){
    var City = [{code:1001, name:"北京"}];
    res.status(200).json(City);
};

exports.LocationApi = LocationApi;
