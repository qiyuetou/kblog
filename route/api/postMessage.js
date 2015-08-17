var querystring = require('querystring');

function* email() {
    var self = this;

    var code, message;

    var dataObj = yield(function getPost() {
        return function(callback) {
            var data = '';
            self.req.addListener('data', function(chunk) {
                data += chunk;
            }).addListener('end', function() {
                callback(null, querystring.parse(data));
            });
        }
    })();

    // check vcode
    var sessionCode = self.session.get('vcode');
    if (!sessionCode || dataObj.vcode.toLowerCase() !== sessionCode.toLowerCase()) {
        self.body = {
            code:'403',
            message:'保存失败，验证码错误'
        }
        return false;
    }

    // add timestamp
    dataObj.time = new Date();

    // computer avatar
    var emailHsah;
    if (dataObj.email) {
        var crypto = require('crypto');
        var email = dataObj.email.toLocaleLowerCase();
        emailHsah = crypto.createHash('md5').update(email).digest("hex");
    }
    dataObj.avatar = "http://www.gravatar.com/avatar/" + emailHsah;

    //save to db
    function saveToDb() {
        return function(callback) {
            self.mongo(function(db) {
                var commentCol = db.collection('message');
                console.log(dataObj);
                commentCol.insert(dataObj, function(err, result) {
                    console.log(err);
                    if (!dataObj['content'] || err) {
                        callback(null, false)
                    } else {
                        callback(null, true);
                    }
                });
            });
        };
    };

    if (yield saveToDb()) {
        code = 200
        message = dataObj
    }else{
        code = 403
        message = '保存失败'
    }

    this.body = {
        code : code,
        message : message
    };
};

module.exports = email;
