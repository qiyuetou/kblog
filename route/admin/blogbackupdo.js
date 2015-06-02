var fs = require('fs');
var exec = require('child_process').exec;
var path = '/www/www.zhuwenlong.com/dbback/';
var dbPath = '/usr/local/mongodb/bin/';
var returnData = {};

function* index() {

    function getList() {
        return function(callback) {
            var date = new Date();
            var backdate = date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate() + '_' + date.getHours() + '_' + date.getMinutes() + '_' + date.getSeconds() + '_' + date.getMilliseconds();
            exec(dbPath + 'mongodump -h 127.0.0.1 -d zhuwenlong -o ' + path + backdate, function(err, stdout, stderr) {
                // console.log(err, stdout, stderr);
                var headData = {
                    "Content-Type": 'text/html; charset=utf-8',
                    'Version': 'HTTP/1.1',
                };
                callback(null, {
                    text: stdout
                });
            });
        }
    }

    var returnData = yield getList();
    this.body = returnData.text
}

module.exports = index;

return false
