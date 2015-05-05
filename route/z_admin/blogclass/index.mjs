var mongodb = require('myblog/db/mongodb.js');
var querystring = require('querystring');

exports.getData = function(callback, req, res) {
    mongodb.open(function(mongo, db) {
        mongo.createCollection('blogclass', function(err, collection) {
            if (err) {
                console.log('mongodb createCollection error:blog class');
            } else {
                collection.find().sort({'classid':1}).toArray(function(err, result) {
                    var len = result.length;
                    var returnData = {};
                    returnData.list = [];
                    
                    for (var i = 0; i < len; i++) {
                        returnData.list.push(result[i]);
                    }
                    mongo.close();
                    callback(returnData);
                });
            }
        });
    });

};
