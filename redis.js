var redis = require('redis'),
    config = require("./config").Config,
    grcli = null,
    logger = require('./logger')(config.get('env'), config.get('logger'));

function newClient() {
    if (!grcli) {
        grcli = redis.createClient(config.get('redis_port'), config.get('redis_server'));  // with auth
        grcli.on("error", function (err) {
            logger.error(err, "Redis Error");
        });
    }
    return grcli;
}

exports.createClient = function () {
    return newClient();
};

exports.del = function (key, fn) {
    var rc = newClient();
    rc.del(key, fn);
};

exports.set = function (key, value, fn) {
    var rc = newClient();
    rc.set(key, value, fn);
};

exports.expire = function (key, seconds, fn) {
    var rc = newClient();
    rc.expire(key, seconds, fn);
};

exports.rpush = function (key, value, fn) {
    var rc = newClient();
    rc.rpush(key, value, fn);
};

exports.sadd = function (key, value, fn) {
    var rc = newClient();
    rc.sadd(key, value, fn);
};

exports.srem = function (key, value, fn) {
    var rc = newClient();
    rc.srem(key, value, fn);
};

exports.hset = function (key, filed, value, fn) {
    var rc = newClient();
    rc.hset(key, filed, value, fn);
};

exports.keys = function (key, fn) {
    var rc = newClient();
    rc.keys(key, fn);
};

exports.hkeys = function (key, fn) {
    var rc = newClient();
    rc.hkeys(key, fn);
};

exports.hget = function (key, filed, fn) {
    var rc = newClient();
    rc.hget(key, filed, fn);
};

exports.hdel = function (key, filed, fn) {
    var rc = newClient();
    rc.hdel(key, filed, fn);
};

exports.hgetall = function (key, fn) {
    var rc = newClient();
    rc.hgetall(key, fn);
};

exports.get = function (key, fn) {
    var rc = newClient();
    rc.get(key, fn);
};

exports.publish = function (key, data, fn) {
    var rc = newClient();
    rc.publish(key, data, fn);
};

exports.mget = function (keys, fn) {
    var client = newClient();
    client.mget(keys, fn);
};

exports.lpush = function (key, value, fn) {
    var rc = newClient();
    rc.lpush(key, value, fn);
};

exports.rpop = function (key, fn) {
    var rc = newClient();
    rc.rpop(key, fn);
};
