var querystring = require('querystring');
var url = require('url');
var render = require('../../views/readen.js');

function* index() {
    var self = this;

    function getBlogClass() {
        return function(callback) {
            self.mongo(function(db) {
                db.createCollection('blogclass', function(err, collection) {
                    collection.find().sort({
                        'classid': 1
                    }).toArray(function(err, result) {
                        var len = result.length;
                        var returnData = {};
                        returnData.list = [];

                        for (var i = 0; i < len; i++) {
                            returnData.list.push(result[i]);
                        }
                        callback(null, returnData);
                    });
                })
            })
        }
    }

    var blogClass = yield getBlogClass();
    console.log(blogClass)
    this.body = yield render('admin/blogclass.jade', blogClass);

}

module.exports = index;
