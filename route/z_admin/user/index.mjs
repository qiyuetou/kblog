var mongodb = require('myblog/db/mongodb.js');

exports.getData = function(callback, req, res) {
    mongodb.open(function(mongo,db){
        mongo.createCollection('user',function(err, collection){
            collection.find({}).toArray(function(err, result){
                var returnData={};
                returnData.data=result;
                callback(returnData);
            });
        });
    });
};

//crypto.createHash('md5').update(text).digest('hex');
