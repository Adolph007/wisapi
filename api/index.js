/*global module*/

var PaperApi = require("./paper").PaperApi;

module.exports = {
    paper      : new PaperApi()
};

exports = module.exports;
