/**
 * @author zhuwenlong
 */
var querystring = require('querystring');
var session = require('myblog/plug/session.js');
var mongodb = require('myblog/db/mongodb.js');
var crypto = require('crypto');

exports.getData = function(callback, req, res) {
    var data = '';
    req.addListener('data', function(chunk) {
        data += chunk;
    }).addListener('end', function() {
        res.writeHead(200, {
            "Content-Type" : "text/html;charset=utf-8"
        });
        var fdata = querystring.parse(data);

        var username = fdata.username;
        var pwd = crypto.createHash('md5').update(fdata.pwd).digest('hex');
        

        mongodb.open(function(mongo, db) {
            mongo.createCollection('user', function(err, collection) {
		collection.find({
                    'username' : username,
                    'password' : pwd
                }).toArray(function(err, result) {
                    if (result.length > 0) {
                        var sessionM = session.start(req, res);
                        sessionM.set('userid',result[0]['_id']);
                        sessionM.set('username', username);
                        sessionM.set('power', 'logined');
                        res.writeHead(302, {
                            'location' : '/z_admin'
                        });
                        res.end('设置成功');
                    } else {
                        res.writeHead(302, {
                            'location' : '/z_admin/login?check=wrong'
                        });
                        res.end('密码错误');
                    }
                });
            });
        });
    });
};
