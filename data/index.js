/*global process,module*/

var mongoose = require('mongoose'),
    config = require('../config.js').Config,
    connectTimes = 0,
    UserData = require("./user").UserData;
    PaperData = require("./paper").PaperData;


var connect = function () {
    connectTimes++;
    if (connectTimes > 5) {
        return;
    }
    //var options = { server: { socketOptions: { keepAlive: 1 } } };
    mongoose.connect(config.get('mongodb_server'), function (err) {
        if (err) {
            console.log("connect mongodb " + err);
        } else {
            console.log("connect mongodb successfully...");
        }
    });
};

// Error handler
mongoose.connection.on('error', function (err) {
    console.log(err)
});

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
    connect();
});

// Connect mongodb
connect();

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

module.exports = {
    paper      : new PaperData(),
    user      : new UserData()
};
exports = module.exports;
