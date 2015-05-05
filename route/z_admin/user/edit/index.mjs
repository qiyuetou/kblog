var mongodb = require('myblog/db/mongodb.js');
var querystring = require('querystring');
var crypto = require('crypto');

exports.getData = function(callback, req, res) {
    var data = '';
    req.addListener('data', function(chunk) {
        data += chunk;
    }).addListener('end', function() {
        var dataObj = querystring.parse(data);
        var ObjectId = require('mongodb').ObjectID;
        var id = new ObjectId(dataObj._id);
        var username = dataObj.username;
        var password = crypto.createHash('md5').update(dataObj.password).digest('hex');

        if (id.length != 24) {
            res.writeHead(302, {
                'location' : '/z_admin/user'
            });
            res.end('修改失败');
        }

        mongodb.open(function(mongo, db) {
            mongo.createCollection('user', function(err, collection) {
                collection.update({
                    '_id' : id
                }, {
                    $set : {
                        username : username,
                        password : password
                    }
                }, function(err, result) {
                    res.writeHead(302, {
                        'location' : '/z_admin/user'
                    });
                    res.end('修改成功');
                });
            });
        });
    });

};

//crypto.createHash('md5').update(text).digest('hex');
