var MongoClient = require('mongodb').MongoClient;

module.exports = mongo;

function mongo(options) {
    options = options || {};
    var host = options.host || 'localhost';
    var port = options.port || 27017;
    var user = options.user || null;
    var pwd = options.pwd || null;
    var db = options.db || '';

    var user = options.user;
    var pwd = options.pwd;

    var mongoConnect;
    var stack = [];

    var url = 'mongodb://' + host + ':' + port + '/' + db;

    MongoClient.connect(url, function(err, db) {
        if (user && pwd) {
            db.authenticate(user, pwd, function(err, res) {
                mongoConnect = db;
                doStack();
            })
        } else {
            mongoConnect = db;
            doStack()
        }
    });

    function doStack() {
        for (var i = 0; i < stack.length; i++) {
            stack[i] && stack[i](mongoConnect);
        }
    }

    return function* mongo(next) {

        this.mongo = function(callback) {
            if (mongoConnect) {
                callback && callback(mongoConnect);
            } else {
                stack.push(callback)
            }
        };

        yield * next;
    }

}
