/*global require,__dirname,module*/

var express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    app = express(),
    route = require("./route"),
    config = require("./config").Config,
    logger = require('./logger')(config.get('env'), config.get('logger'));
    packageJson = require("./package.json");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.disable("x-powered-by");
//启用反向代理
app.enable('trust proxy');

config.version = packageJson.version;
app.locals.config = config;
route(app);
if(config.env !== "test"){
    app.set('port', process.env.PORT || 8200);
    app.listen(app.get('port'), function () {
        logger.info('Wisdom listening on port %s', app.get('port'));
    });
}

if (config.env === 'production') {
    process.on("uncaughtException", function (err) {
        logger.info("process uncaughtException", err);
    });
}else{
    app.set('json spaces',2);
}

module.exports = exports = app;
