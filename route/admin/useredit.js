var render = require('../../views/readen.js');
var querystring = require('querystring');
var crypto = require('crypto');

function* index() {

    var self = this;

    function getArguments() {
        return function(callback) {
            var data = '';

            self.req.on('data', function(chunk) {
                data += chunk;
            }).on('end', function() {
                callback(null, querystring.parse(data))
            })
        }
    }

    function user(data) {
        return function(callback) {
            var dataObj = data;
            if (data._id.length != 24) {
                callback(null, {
                    text: '修改失败'
                });
                return false;
            }
            var ObjectId = require('mongodb').ObjectID;
            var id = new ObjectId(dataObj._id);
            var username = dataObj.username;
            var password = crypto.createHash('md5').update(dataObj.password).digest('hex');


            self.mongo(function(db) {
                db.createCollection('user', function(err, collection) {
                    collection.update({
                        '_id': id
                    }, {
                        $set: {
                            username: username,
                            password: password
                        }
                    }, function(err, result) {
                        callback(null, {
                            text: '修改成功'
                        });
                    });
                })
            })
        }
    }

    var param = yield getArguments();
    var returnData = yield user(param);
    this.body = returnData.text
}

module.exports = index;
