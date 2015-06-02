var render = require('../../views/readen.js');

function* index() {
    var self = this;

    function getBlogList() {
        return function(callback) {
            self.mongo(function(db) {
                db.createCollection('blog', function(err, collection) {
                    if (err) {
                        console.log('mongodb createCollection error');
                    } else {
                        collection.find().sort({
                            '_id': -1
                        }).toArray(function(err, result) {
                            var resultHtml = [];
                            var length = result.length;
                            for (var i = 0; i < length; i++) {
                                resultHtml.push([
                                	result[i]._id, 
                                	result[i].title, 
                                	result[i].visited, 
                                	result[i].comment, 
                                	result[i].pubtime.getFullYear(),
                                	result[i].classid
                            	])
                            }
                            callback(null, resultHtml);
                        });
                    }
                });
            })
        }
    }

    var blogHTML = yield getBlogList();


    this.body = yield render('admin/blog.jade', {
        sys: {
            url: self.request.url,
        },
        bloglist: blogHTML
    });
}

module.exports = index;
