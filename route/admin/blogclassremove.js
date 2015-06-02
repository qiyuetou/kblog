var querystring = require('querystring');
var url = require('url');
var render = require('../../views/readen.js');

function* index() {
    var self = this;

    function removeClass() {
        return function(callback) {
            var query = querystring.parse(url.parse(self.req.url).query);
            if (!query._id || query._id.length != 24) {
                this.body = 'illegality'
                return false;
            }
            var ObjectId = require('mongodb').ObjectID;
            var _id = new ObjectId(query._id);
            if (_id) {
                self.mongo(function(db) {
                    db.createCollection('blogclass', function(err, collection) {
                        collection.remove({
                            '_id': _id
                        }, function(err, result) {
                            if (err) {
                                self.body = 'remove error'
                            } else {
                                self.body = 'delete ok'
                            }
                            callback(null,{})
                        });
                    })
                })
            } else {
                self.body = 'no id'
                callback(null,{})
            }
        }

    }

    var classArg = yield removeClass();

}

module.exports = index;
