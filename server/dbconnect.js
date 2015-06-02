var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/stock-guid';

var dbConnect;


exports.connect = function(callback){
    if(dbConnect){
        callback&&callback(dbConnect);
    }else{
        MongoClient.connect(url,function(err,db){
            if(!err){
		db.authenticate("zhuwenlong", "123123", function() {
			dbConnect=db;
			callback&&callback(db);
		});
            }else{
                callback&&callback('error');
            }
        });
    }
};
