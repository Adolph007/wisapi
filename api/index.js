/*global module*/

var PaperApi = require("./paper").PaperApi;
var AdminApi = require("./admin").AdminApi;
var UserApi = require("./user").UserApi;

module.exports = {
    paper      : new PaperApi(),
    admin      : new AdminApi(),
    user       : new UserApi()
};

exports = module.exports;
