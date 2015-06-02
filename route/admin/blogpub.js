var querystring = require('querystring');
var url = require('url') ;
var render = require('../../views/readen.js');

function* index() {
    var self = this;

   	console.log('****')

    function getBlogInfo() {
        return function(callback) {
            var query = querystring.parse(url.parse(self.request.url).query);
            console.log(query)
            self.mongo(function(db) {
                db.createCollection('blogclass', function(err, collection) {
                    if (err) {
                        console.log('mongodb createCollection error');
                    } else {
                        collection.find({}).toArray(function(err, result) {
                            //
                            var blogClassHtml = [];
                            for (i in result) {
                                var blogClass = result[i];
                                blogClassHtml.push(blogClass)
                                
                            }
                            // console.log('.//.')
                            //if edit
                            if (!query.id) {
                                callback(null,{
                                    'blogClassHtml': blogClassHtml
                                });
                                // callback(null, {})
                            } else {
                                db.createCollection('blog', function(err, collection) {
                                    if (err) {
                                        console.log('mongodb createCollection error');
                                    } else {
                                        var ObjectId = require('mongodb').ObjectID;
                                        collection.find({
                                            '_id': new ObjectId(query.id)
                                        }).toArray(function(err, result) {
                                            callback(null, {
                                                'blogid': query.id,
                                                'blogT': result[0].title,
                                                'blogC': result[0].content,
                                                'blogClassHtml': blogClassHtml,
                                                'url':self.request.url
                                            });
                                        });
                                    }
                                });
                            }

                        });
                    }
                });
            })
        }
    }

    var blogInfo = yield getBlogInfo();

    this.body = yield render('admin/blogpub.jade', blogInfo);
}

module.exports = index;
