var _ = require('lodash/dist/lodash.underscore');

exports.Config = {
    config : {
	env: 'test',
	mongodb_server: 'mongodb://sjh/wisdom',
	region : 'cn-north-1',
	tmpdir : '/Users/haoliu/tmp/',
	bucket_thumb : 'thumb',
	bucket_statics : 'statics', 
	bucket_lesschat : 'lctmp',
	logger         : {
	    level  : "info",
	    filename: "lc_box.log",
            dirname: "/Users/haoliu/tmp/log/", // e.g. /mnt/wtlog/nodejs/web
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
