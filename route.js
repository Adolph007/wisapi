/*global module,require*/
 // var controller = require("./controller"),
var api = require("./api"),
    config = require("./config").Config,
    logger = require('./logger')(config.get('env'), config.get('logger'));
    box = require("./core"),
    util = require("util");

exports = module.exports = function (app) {

    // app.use(domainMiddleware);
    // app.use(logRequest);
    app.post('/box/upload', box.upload);
    app.get('/box/:fid', box.getFile);
    app.get('/box/thumb/:fid', box.getThumb);
    app.post('/admin/paper', api.admin.addpaper);
    app.post('/api/msg', api.message.add);
    app.get('/admin/papers', api.admin.listpaper);
    app.post('/api/paper', api.paper.add);
    app.get('/api/paper/:id', api.paper.getPaper);
    app.get('/api/papers', api.paper.list);
    app.post('/api/regcode', api.user.genvcode);
    app.post('/api/register', api.user.register);
    app.get('/api/sigin', api.user.sigin);
    app.post('/api/user/babyinfo', api.user.createuser);
    app.get('/api/location/city', api.location.getCity);
    // Error handler
    app.use(errorHandler);

    function domainMiddleware(req, res, next) {
        var d = domain.create();
        d.add(req);
        d.add(res);
        d.on('error', function (err) {
            res.setHeader('Connection', 'close');
            next(err);
        });
        d.run(next);
    };

    function logRequest(req, res, next) {
        req.context = {
            oid: core.util.guid()
        };

        var nowDate = core.util.getNow("YYYY-MM-DD HH:ss:mm");

        var client = req.cookies.sid;
        if (!client) {
            client = req.get('app_key');
            if (!client) {
                client = 'unknown';
            }
            else {
                client = "app_key=" + client;
            }
        }
        else {
            client = "sid=" + client;
        }

        var referer = req.get('Referer');
        if (!referer) {
            referer = "unknown";
        }

        var ua = req.get('User-Agent');
        if (!ua) {
            ua = "unknown";
        }
        var data = {};

        if (req.url !== '/api/user/signin' && req.body) {
            data.body = req.body;
        }
        var reqInfo = {date: nowDate, method: req.method, url: req.url, data: data, ip: req.ip, statusCode: res.statusCode, referer: referer, oid: req.context.oid, client: client, ua: ua};
        reqInfo.uid = req.user ? req.user.uid : "unknown";
        logger.info(reqInfo);
        next();
    };

    function errorHandler(error, req, res, next) {
        if (error && 'number' !== typeof error) {
	    logger.error("error: %s", error);
        }
        if (req.url.indexOf("/api") >= 0) {
            if (error && error.code) {
                return res.send({code: error.code});
            } else if ('number' === typeof error) {
                logger.error("response code is %s",  error);
                return res.send({code: error});
            } else {
                return res.send({code: 500});
            }
        } else {
            return res.render('error.html', { title: '服务器正在着急中'});
        }
    };
};
