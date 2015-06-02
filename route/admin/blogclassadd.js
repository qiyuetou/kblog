var querystring = require('querystring');
var url = require('url');
var render = require('../../views/readen.js');

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

    function newClass(classArg) {
        return function(callback) {
            console.log(classArg)
            var ObjectId = require('mongodb').ObjectID;
            var dataObj = classArg
            var classname = dataObj.classname;
            var classid = dataObj.classid;
            var _id = dataObj._id && new ObjectId(dataObj._id);
            if (_id) {
                var type = 'edit';
            } else {
                var type = 'new';
            }

            self.mongo(function(db) {
                db.createCollection('blogclass', function(err, collection) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (type == 'new') {
                            collection.insert({
                                'classid': classid,
                                'classname': classname,
                                'classcount': 0
                            }, function(err, docs) {
                                if (err) {
                                    self.body='新建出错'
                                    callback(null, {})
                                } else {
                                    self.body='新建OK'
                                    callback(null, {})
                                }
                            });
                        } else {
                            collection.update({
                                '_id': _id
                            }, {
                                $set: {
                                    'classid': classid,
                                    'classname': classname
                                }
                            }, function(err, result) {
                                if (err) {
                                    self.body='修改错误'
                                    callback(null, {})
                                } else {
                                    self.body='修改OK'
                                    callback(null, {})
                                }
                            });
                        }
                    }
                })
            })
        }

    }

    var classArg = yield getArguments();
    yield newClass(classArg);

}

module.exports = index;
