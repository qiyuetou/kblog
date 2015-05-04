var mongodb = require('myblog/db/mongodb.js');
var session = require('myblog/plug/session.js');

exports.getData = function(callback, req, res) {

    var sessionM = session.start(req, res);
    if (sessionM.get('power') != 'logined') {
        res.writeHead(302, {
            'location' : '/z_admin/login?check=wrong'
        });
        res.end();
        return false;
    }

    mongodb.open(function(mongo, db) {
        mongo.createCollection('blog', function(err, collection) {
            if (err) {
                console.log('mongodb createCollection error');
            } else {
                collection.find().sort({
                    '_id' : -1
                }).toArray(function(err, result) {
                    var resultHtml = '';
                    var length = result.length;
                    for (var i = 0; i < length; i++) {
                        resultHtml += '<tr><td>' + result[i]._id + '</td><td>' + result[i].title + '</td><td>' + result[i].visited + '</td><td>' + result[i].comment + '</td><td>' + result[i].pubtime.getFullYear() + '</td><td><a href="/z_admin/blogpub?id=' + result[i]._id + '">编辑</a><br><a href="/z_admin/blogdel?id=' + result[i]._id + '">删除</a></td><td>' + result[i].classid + '</td></tr>';
                    }
                    mongo.close();
                    callback({
                        bloglist : resultHtml
                    });
                });
            }
        });
    });
};
