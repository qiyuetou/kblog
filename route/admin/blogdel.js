var querystring = require('querystring');
var url = require('url');
var render = require('../../views/readen.js');

function* index() {
    var self = this;
    // console.log(self.req)
    // 
    var query = querystring.parse(url.parse(self.req.url).query);
    if (query.id.length != 24) {
        self.body = "非法操作"
        return false;
    }

    function deleteBlog() {
        return function(callback) {
            self.mongo(function(db) {
                db.createCollection('blog', function(err, collection) {
                    var ObjectId = require('mongodb').ObjectID;
                    var blogClass;
                    collection.find({
                        '_id': new ObjectId(query.id)
                    }).toArray(function(err, result) {
                        blogClass = result[0]['classid'];
                        removeBlog(blogClass);
                    });

                    function removeBlog(blogClass) {
                        collection.remove({
                            '_id': new ObjectId(query.id)
                        }, function(err, result) {
                            if (err) {
                                callback(null, {
                                    'ret': '删除失败'
                                });

                            } else {
                                callback(null, {
                                    'ret': '删除成功',
                                    'blogClass': blogClass
                                });

                            }
                        });
                    }
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

    var blogDel = yield deleteBlog();
    if(blogDel.blogClass){
    	yield updateCount(blogDel.blogClass);
    	this.body = " blog del successed"
    }else{
    	this.body = "blog del fail"
    }

}

module.exports = index;
