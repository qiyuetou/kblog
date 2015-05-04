var https = require('https');
var querystring = require('querystring');
var url = require('url');
var mongodb = require('myblog/db/mongodb.js');
var session = require('myblog/plug/session.js');

exports.getData = function(callback, req, res) {
    var sessionM = session.start(req, res);
    var query = querystring.parse(url.parse(req.url).query);

    var postData = querystring.stringify({
        'grant_type' : 'authorization_code',
        'code' : query.code,
        'redirect_uri' : 'http://www.zhuwenlong.com/weibologin',
        'client_id' : '3314722704',
        'client_secret' : '864158356247022bb03a02c2e52de8c1'
    });

    var options = {
        hostname : 'api.weibo.com',
        port : 443,
        path : '/oauth2/access_token',
        method : 'POST',
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Content-Length' : postData.length
        }

    };

    var request = https.request(options, function(resp) {
        var returnD = '';
        resp.on('data', function(d) {
            returnD = d;
        }).on('end', function() {
            var theData=JSON.parse(returnD.toString());
            mongodb.open(function(mongo, db) {
                mongo.createCollection('user', function(err, collection) {
                    if (err) {
                        console.log('save weibo token', err);
                    } else {
                        var ObjectId = require('mongodb').ObjectID;
                        var id = new ObjectId(sessionM.get('userid') && sessionM.get('userid').toString());
                        if (theData.access_token) {
                            console.log(id)
                            collection.update({
                                '_id' : id
                            }, {
                                $set : {
                                    'weiboToken' : theData.access_token
                                }
                            }, function(err, result) {
                                if (err) {
                                    res.writeHead(200, {
                                        "Content-Type" : "text/html;charset=utf-8"
                                    });
                                    console.log(theData);
                                    res.end('失败');
                                } else {
                                    res.writeHead(200, {
                                        "Content-Type" : "text/html;charset=utf-8"
                                    });
                                    console.log(theData);
                                    res.end('成功');
                                }
                            });
                        } else {
                            res.writeHead(200, {
                                "Content-Type" : "text/html;charset=utf-8"
                            });
                            console.log(theData);
                            res.end('失败');
                        }

                    }
                });
            });

        });
    });

    request.write(postData);
    request.end();

    request.on('error', function(e) {
        console.error(e);
    });
};
