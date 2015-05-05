var mongodb = require('myblog/db/mongodb.js');
var querystring = require('querystring');

exports.getData = function(callback, req, res) {
    var data = '';
    req.addListener('data', function(chunk) {
        data += chunk;
    }).addListener('end', function() {
        var ObjectId = require('mongodb').ObjectID;
        var dataObj = querystring.parse(data);
        var classname = dataObj.classname;
        var classid = dataObj.classid;
        var _id = dataObj._id && new ObjectId(dataObj._id);
        if (_id) {
            var type = 'edit';
        } else {
            var type = 'new';
        }

        mongodb.open(function(mongo, db) {
            mongo.createCollection('blogclass', function(err, collection) {
                if (err) {
                    console.log(err);
                } else {
                    if (type == 'new') {
                        collection.insert({
                            'classid' : classid,
                            'classname' : classname,
                            'classcount' : 0
                        }, function(err, docs) {
                            if (err) {
                                console.log(err);
                                res.end('新建出错');
                            } else {
                                res.writeHead(301, {
                                    'location' : '/z_admin/blogclass'
                                });
                                res.end();
                            }
                        });
                    } else {
                        collection.update({
                            '_id' : _id
                        }, {
                            $set : {
                                'classid' : classid,
                                'classname' : classname
                            }
                        }, function(err, result) {
                            if (err) {
                                console.log(err);
                                res.end('修改错误');
                            }else{
                                res.writeHead(301, {
                                    'location' : '/z_admin/blogclass'
                                });
                                res.end();
                            }
                        });
                    }
                }
            });
        });
    });
};
