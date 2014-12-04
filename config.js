var _ = require('lodash/dist/lodash.underscore');

exports.Config = {
    config : {
	env: 'test',
	mongodb_server: 'mongodb://sjh/wisdom',
	redis_server: 'sjh',
	redis_port: 6379,
	region : 'cn-north-1',
	tmpdir : '/var/boxtmp/',
	bucket_thumb : 'thumb',
	bucket_statics : 'statics', 
	bucket_lesschat : 'lctmp',
	logger         : {
	    level  : "info",
	    filename: "box.log",
            dirname: "/var/log/box/", // e.g. /mnt/wtlog/nodejs/web
            maxsize: 1024 * 1024 * 10
	},
	convertcmd : 'convert'
    },

    extend: function (opts) {
        this.config = _.extend(this.config, opts);
	return this;
    },

    all: function () {
        return this.config;
    },
    get: function (name) {
	if (this.config[name] !== undefined) return this.config[name];
	return null;
    }
};
