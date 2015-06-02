var render = require('../../views/readen.js');
var querystring = require('querystring');
var crypto = require('crypto');

function* index() {

    var self = this;

    function getArguments() {
        return function(callback) {
            var data = '';

            self.req.on('data', function(chunk) {
                data += chunk;
            }).on('end', function() {
                callback(null, querystring.parse(data))
            })
        }
    }

    function check(data) {
        return function(callback) {

            var fdata = data

            var username = fdata.username;
            var pwd = crypto.createHash('md5').update(fdata.pwd).digest('hex');

            self.mongo(function(db) {
                db.createCollection('user', function(err, collection) {
                    collection.find({
                        'username': username,
                        'password': pwd
                    }).toArray(function(err, result) {
                        if (result.length > 0) {
                            // var sessionM = session.start(req, res);
                            self.session.set('userid', result[0]['_id']);
                            self.session.set('username', username);
                            self.session.set('power', 'logined');
                            callback(null, {
                                text: '设置成功'
                            })
                        } else {

                            callback(null, {
                                text: '密码错误'
                            })
                        }
                    });
                })
            })
        }
    }

    var param = yield getArguments();
    var check = yield check(param);
    // console.log(param)
    this.body = check.text;
}
module.exports = index;


return false
