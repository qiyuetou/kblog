var querystring = require('querystring');
var url = require('url');
var render = require('../../views/readen.js');

function* index() {
    var self = this;
    // console.log(self.req)

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

    function insertBlog(arg) {
        return function(callback) {
            self.mongo(function(db) {
                db.createCollection('blog', function(err, collection) {
                    var classid = arg.blogclass;
                    var blogIntro = arg.introduce;

                    collection.insert({
                        'title': arg.blogtitle,
                        'classid': classid,
                        'content': arg.blogtext,
                        'visited': 0,
                        'comment': 0,
                        'pubtime': new Date()
                    }, function(err, result) {
                        callback(null, result)
                    });
                })
            })

        }
    }

    function updateCount(classid) {
        return function(callback) {
            self.mongo(function(db) {
                db.createCollection('blog', function(err, collection) {
                    collection.count({
                        'classid': classid.toString()
                    }, function(err, count) {
                        db.createCollection('blogclass', function(err, collection) {
                            collection.update({
                                'classid': classid.toString()
                            }, {
                                $set: {
                                    'classcount': count
                                }
                            }, function(err, result) {
                                callback(null, {})
                            });
                        });
                    });
                });
            });
        }
    }

    function postToWeibo(arg) {
        return function(callback) {
            self.mongo(function(db) {
                db.createCollection('user', function(err, collection) {
                    var userid = self.session.get('userid');

                    if (userid) {
                        var ObjectId = require('mongodb').ObjectID;
                        var id = new ObjectId(userid.toString());
                        collection.find({
                            '_id': id
                        }).toArray(function(err, result) {
                            var weiboTokie = result[0]['weiboToken'];

                            var postData = querystring.stringify({
                                'access_token': weiboTokie,
                                'status': arg.blogIntro + '（分享自 @Z_Mofei） http://www.zhuwenlong.com/blog/' + arg.blogId,
                            });

                            var options = {
                                hostname: 'api.weibo.com',
                                port: 443,
                                path: '/2/statuses/update.json',
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Content-Length': postData.length
                                }
                            };

                            var reqHttp = https.request(options, function(resHttp) {
                                console.log("statusCode: ", resHttp.statusCode);
                                console.log("headers: ", resHttp.headers);
                                var returnDate = '';
                                resHttp.on('data', function(d) {
                                    returnDate = d;
                                }).on('end', function() {
                                    callback(null, {})
                                });
                            });
                            reqHttp.write(postData);
                            reqHttp.end();
                        });
                    } else {
                        callback(null, {})
                    }

                });
            });
        }
    }

    function updateBlog(arg) {
        return function(callback) {

            self.mongo(function(db) {
                db.createCollection('blog', function(err, collection) {
                    var ObjectId = require('mongodb').ObjectID;
                    var id = new ObjectId(arg.blogid);
                    //get old class
                    var oldClass = '';
                    collection.find({
                        '_id': id
                    }).toArray(function(err, result) {
                        oldClass = result[0]['classid'];
                        _updateBlog();
                    });

                    function _updateBlog() {
                        collection.update({
                            '_id': id
                        }, {
                            $set: {
                                'title': arg.blogtitle,
                                'classid': arg.blogclass,
                                'content': arg.blogtext
                            }
                        }, function(err, result) {
                            if (err) {
                                callback(null, {
                                    text: '博客修改失败'
                                });
                            } else {
                                callback(null, {
                                    text: '博客修改成功',
                                    oldClass: oldClass,
                                    newClass: arg.blogclass
                                });
                            }
                        });
                    };
                })
            })

        }
    }

    var arg = yield getArguments();

    if (arg.blogid) {
        var updateBlog = yield updateBlog(arg);
        //update
        if (updateBlog.oldClass == updateBlog.blogclass) {
            yield updateCount(updateBlog.oldClass);
        } else {
            yield updateCount(updateBlog.oldClass)
            yield updateCount(updateBlog.newClass)
        }
        this.body = updateBlog.text;
    } else {
        //savenew
        var newBlog = yield insertBlog(arg);

        arg.blogId = newBlog.ops[0]['_id'];
        arg.blogClass = newBlog.ops[0]['classid'];

        yield updateCount(arg.blogClass);

        yield postToWeibo(arg)
        this.body = "new blog successed"
    }


}

module.exports = index;
