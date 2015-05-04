var querystring = require('querystring');
var mongodb = require('myblog/db/mongodb.js');
var url = require('url');


exports.getData = function(callback, req, res) {
    var query = querystring.parse(url.parse(req.url).query);
    mongodb.open(function(mongo, db) {
        mongo.createCollection('blogclass', function(err, collection) {
            if (err) {
                console.log('mongodb createCollection error');
            } else {
                collection.find({}).toArray(function(err, result) {
                    //
                    var blogClassHtml = "";
                    for (i in result) {
                        var blogClass = result[i];
                        blogClassHtml += "<option value=" + blogClass['classid'] + ">" + blogClass['classname'] + "</option>";
                    }

                    //if edit
                    if (!query.id) {
                        callback({
                            'blogClassHtml' : blogClassHtml
                        });
                        return false;
                    } else {
                        mongo.createCollection('blog', function(err, collection) {
                            if (err) {
                                console.log('mongodb createCollection error');
                            } else {
                                var ObjectId = require('mongodb').ObjectID;
                                collection.find({
                                    '_id' : new ObjectId(query.id)
                                }).toArray(function(err, result) {
                                    callback({
                                        'blogid' : query.id,
                                        'blogT' : result[0].title,
                                        'blogC' : result[0].content,
                                        'blogClassHtml' : blogClassHtml
                                    });
                                });
                            }
                        });
                    }

                });
            }
        });
    });
};
