var mongodb = require('myblog/db/mongodb.js');
var querystring = require('querystring');
var url = require('url');

exports.getData = function(callback, req, res) {
    var data = '';
    req.addListener('data', function(chunk) {
        data += chunk;
    }).addListener('end', function() {
        var query = querystring.parse(url.parse(req.url).query);
        if (!query._id || query._id.length != 24) {
            res.write('illegality');
            res.end();
            return false;
        }
        var ObjectId = require('mongodb').ObjectID;
        var _id = new ObjectId(query._id);
        if (_id) {
            mongodb.open(function(mongo, db) {
                mongo.createCollection('blogclass', function(err, collection) {
                    if (err) {
                        console.log(err);
                    } else {
                        collection.remove({
                            '_id' : _id
                        }, function(err, result) {
                            if (err) {
                                res.end('remove error');
                            } else {
                                res.writeHead(301, {
                                    'location' : '/z_admin/blogclass'
                                });
                                res.end();
                            }
                        });
                    }
                });
            });
        } else {
            res.end('no id');
        }
    });
};
