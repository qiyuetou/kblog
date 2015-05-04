var querystring = require('querystring');
var mongodb = require('myblog/db/mongodb.js');
var url = require('url');

exports.getData = function(callback, req, res) {
    res.writeHead(200, {
        "Content-Type" : "text/html;charset=utf-8"
    });
    var query = querystring.parse(url.parse(req.url).query);
    if (query.id.length != 24) {
        res.write('非法操作');
        res.end();
        return false;
    }

    mongodb.open(function(mongo, db) {
        mongo.createCollection('blog', function(err, collection) {
            if (err) {
                console.log('mongodb createCollection error');
            } else {
                var ObjectId = require('mongodb').ObjectID;
                var blogClass;
                collection.find({
                    '_id' : new ObjectId(query.id)
                }).toArray(function(err, result) {
                    blogClass = result[0]['classid'];
                    removeBlog(blogClass);
                });
                function removeBlog(blogClass) {
                    collection.remove({
                        '_id' : new ObjectId(query.id)
                    }, function(err, result) {
                        updatecount(blogClass, function() {
                            mongo.close();
                        });
                        if (err) {
                            res.write('删除失败');
                        } else {
                            res.write('删除成功');
                        }

                        //updatecount()
                        res.end();
                    });
                }

            }
        });

        //update the count
        function updatecount(classid, fn) {
            mongo.createCollection('blog', function(err, collection) {
                collection.count({
                    'classid' : classid.toString()
                }, function(err, count) {
                    mongo.createCollection('blogclass', function(err, collection) {
                        collection.update({
                            'classid' : classid.toString()
                        }, {
                            $set : {
                                'classcount' : count
                            }
                        }, function(err, result) {
                            fn && fn();
                        });
                    });
                });
            });
        }

    });
};
