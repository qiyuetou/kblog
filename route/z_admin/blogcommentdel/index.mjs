var mongodb = require('myblog/db/mongodb.js');
var querystring = require('querystring');

exports.getData = function(callback, req, res) {
    var data = '';
    req.addListener('data', function(chu) {
        data += chu;
    }).addListener('end', function() {
        var dataObj = querystring.parse(data);
        mongodb.open(function(mongo) {
            var ObjectId = require('mongodb').ObjectID;
            var blogList = {};

            var blogcommentColl = mongo.collection('blogcomment');
            var blogColl = mongo.collection('blog');
            var ObjectId = require('mongodb').ObjectID;

            for (i in dataObj) {
                (function(i) {
                    var commentId = new ObjectId(i);
                    blogcommentColl.find({
                        '_id' : commentId
                    }).toArray(function(err, data) {
                        var id = data[0]['blogid'];
                        var blogid = new ObjectId(id.toString());
                        blogColl.update({
                            '_id' : blogid
                        }, {
                            $inc : {
                                comment : -1
                            }
                        }, {
                            w : 1
                        }, function() {
                            blogcommentColl.remove({
                                '_id' : commentId
                            }, function() {
                                console.log('删除成功', commentId);
                            });
                        });
                    });
                })(i);
            }
            res.writeHead(302, {
                            'location' : '/z_admin/blogcomment'
                        });
            res.end('删除成功');
        });
    });
    callback({});
};

