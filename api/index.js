/*global module*/

var PaperApi = require("./paper").PaperApi;
var AdminApi = require("./admin").AdminApi;
var UserApi = require("./user").UserApi;
var LocationApi = require("./location").LocationApi;

module.exports = {
    paper      : new PaperApi(),
    admin      : new AdminApi(),
    user       : new UserApi(),
    location   : new LocationApi()
};

exports = module.exports;
