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

    var sessionCode = self.session.get('vcode');

    if (sessionCode && sessionCode.toLowerCase() == dataObj.vcode) {
        if (dataObj.content) {
            code = 200;
            message = 'ok';
            var html = (dataObj.username || '无名') + '<br>' + (dataObj.email || '未留邮箱') + '<br>' + dataObj.content;
            yield send(html);
        } else {
            code = 403;
            message = 'content is required';
        }

    } else {
        code = 403;
        message = 'vcode is wrong';
    }

    console.log(sessionCode, dataObj);

    function send(html) {
        return function(callback) {
            var nodemailer = require("nodemailer");
            var transport = nodemailer.createTransport({
                host: "smtp.exmail.qq.com", // hostname
                secure: true, // use SSL
                port: 465, // port for secure SMTP
                auth: {
                    user: "noreplay@zhuwenlong.com",
                    pass: "zwl891027"
                }
            });

            var mailOptions = {
                from: "Mofei<noreplay@zhuwenlong.com>",
                to: '13761509829@163.com',
                subject: '新留言@zhuwenlong.com',
                html: html
            }

            transport.sendMail(mailOptions, function() {
                console.log(arguments);
                console.log('email send');
                callback(null, null);
                transport.close();
            });
        }

    }


    this.body = {
        'meta': {
            'code': code,
            'message': message
        },
        'data': {}
    };
};

module.exports = email;
