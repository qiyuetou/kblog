var render = require('../views/readen.js');

var querystring = require('querystring');


function* blogComment(Tclass, Tpage) {

    var self = this;

    //session
    var sessionCode = self.session.get('vcode');

    var dataObj = yield(function getPost() {
        return function(callback) {
            var data = '';
            self.req.addListener('data', function(chunk) {
                data += chunk;
            }).addListener('end', function() {
                // var dataObj =;
                callback(null, querystring.parse(data));
            });
        }
    })();

    console.log(dataObj.vcode, sessionCode)
    if (dataObj.vcode.toLowerCase() !== sessionCode.toLowerCase()) {
        this.body = "保存失败，验证码错误";
        return false;
    }

    dataObj.blogid = this.mongoObj(dataObj.blogid);
    dataObj.time = new Date();

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
                var commentCol = db.collection('blogcomment');
                console.log(dataObj);
                commentCol.insert(dataObj, function(err, result) {
                    if (!dataObj['content'] || err) {
                        callback(null, false)
                    } else {
                        callback(null, true);
                    }
                });
            });
        };
    };

    //update count
    function updateCount() {
        return function(callback) {
            self.mongo(function(db) {
                var commentCol = db.collection('blogcomment');
                commentCol.find({
                    'blogid': dataObj.blogid
                }).count(function(err, count) {
                    var blogCol = db.collection('blog');
                    blogCol.update({
                        '_id': dataObj.blogid
                    }, {
                        $set: {
                            'comment': count
                        }
                    }, {
                        w: 1
                    }, function(err, db) {
                        if (err) {
                            callback(null, false);
                        } else {
                            callback(null, true);
                        }
                    });

                });
            });
        };
    };

    function findInfoByCommentId() {
        return function(callback) {
            self.mongo(function(db) {
                var commentCol = db.collection('blogcomment');
                commentCol.findOne({
                    '_id': self.mongoObj(dataObj.replayid)
                }, function(err, res) {
                    callback(null, res)
                });
            });
        }
    }


    if (yield saveToDb()) {
        //save ok
        //update count
        if (yield updateCount()) {
            // sendEmail();
            var sendInfo = {}
            if (dataObj.replayid) {
                var lastCommentUser = yield findInfoByCommentId();
                sendInfo.userName = lastCommentUser.name;
                sendInfo.userEmail = lastCommentUser.email;
                sendInfo.commentText = lastCommentUser.content;
            } else {
                sendInfo.userName = 'Mofei';
                sendInfo.userEmail = '13761509829@163.com';
                sendInfo.commentText = '您是作者';
            }
            sendInfo.articleUrl = dataObj.url;
            sendInfo.articleName = dataObj.title;
            sendInfo.replayName = dataObj.name;
            sendInfo.replayText = dataObj.content;
            sendmail(sendInfo);

            self.body = '保存成功';

            return false;
        }
    }


    function sendmail(obj) {


        var siteUrl = 'http://www.zhuwenlong.com';
        var siteName = '朱文龙的自留地';
        var userName = obj.userName || '';
        var userEmail = obj.userEmail || '';
        var articleUrl = obj.articleUrl || '';
        var articleName = obj.articleName || '';
        var commentText = obj.commentText || '';
        var replayName = obj.replayName || '';
        var replayText = obj.replayText || '';
        var html = '<div style="BORDER: #666666 1px solid; MARGIN: 10px auto 0px; WIDTH: 702px; FONT-FAMILY: 微软雅黑, Arial; COLOR: #111; FONT-SIZE: 12px; -moz-border-radius: 8px; -webkit-border-radius: 8px; -khtml-border-radius: 8px; border-radius: 8px"> <div style="WIDTH: 100%; BACKGROUND: #666666; HEIGHT: 60px; COLOR: white; -moz-border-radius: 6px 6px 0 0; -webkit-border-radius: 6px 6px 0 0; -khtml-border-radius: 6px 6px 0 0; border-radius: 6px 6px 0 0"> <span style="LINE-HEIGHT: 60px; HEIGHT: 60px; MARGIN-LEFT: 30px; FONT-SIZE: 12px">您在 <a style="COLOR: #00bbff; FONT-WEIGHT: 600; TEXT-DECORATION: none" href="' + siteUrl + '" target="_blank">' + siteName + '</a> 上的留言有新回复啦！</span> </div> <div style="MARGIN: 0px auto; WIDTH: 90%"> <p>' + userName + ', 您好!</p> <p>您曾在 <a href="' + siteUrl + '" target="_blank">' + siteName + '</a> 的文章《<a href="' + articleUrl + '"  target="_blank">' + articleName + '</a>》的留言: <br> </p> <p style="BORDER-BOTTOM: #ddd 1px solid; BORDER-LEFT: #ddd 1px solid; PADDING-BOTTOM: 20px; BACKGROUND-COLOR: #eee; MARGIN: 15px 0px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px; BORDER-TOP: #ddd 1px solid; BORDER-RIGHT: #ddd 1px solid; PADDING-TOP: 20px">' + commentText + '</p> <p>' + replayName + ' 给您的回复如下: </p> <p style="BORDER-BOTTOM: #ddd 1px solid; BORDER-LEFT: #ddd 1px solid; PADDING-BOTTOM: 20px; BACKGROUND-COLOR: #eee; MARGIN: 15px 0px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px; BORDER-TOP: #ddd 1px solid; BORDER-RIGHT: #ddd 1px solid; PADDING-TOP: 20px">' + replayText + '</p> <p>您可以点击 <a style="COLOR: #00bbff; TEXT-DECORATION: none" href="' + articleUrl + '" target="_blank">查看回复的完整內容</a> </p> <p>欢迎再次光临 <a style="COLOR: #00bbff; TEXT-DECORATION: none" href="' + siteUrl + '" target="_blank">' + siteName + '</a> </p> <p>(此邮件由系统自动发出, 请勿回复.)</p> </div></div>'


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
            to: userEmail,
            subject: '你在 [' + siteName + '] 的留言有了新回复',
            html: html
        }

        transport.sendMail(mailOptions, function() {
            console.log(arguments);
            console.log('email send');
            transport.close();
        });
    };

    this.body = "保存失败";

}

module.exports = blogComment;
