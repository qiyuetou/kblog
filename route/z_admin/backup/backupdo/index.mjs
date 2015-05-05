var fs = require('fs');
var exec = require('child_process').exec;
var path = '/www/www.zhuwenlong.com/dbback/';
var dbPath = '/usr/local/mongodb/bin/';
var returnData = {};

exports.getData = function(callback, req, res) {
    var date = new Date();
    var backdate = date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate() + '_' + date.getHours() + '_' + date.getMinutes() + '_' + date.getSeconds() + '_' + date.getMilliseconds();
    exec(dbPath + 'mongodump -h 127.0.0.1 -d zhuwenlong -o ' + path + backdate, function(err, stdout, stderr) {
        console.log(err, stdout, stderr);
        var headData = {
            "Content-Type" : 'text/html; charset=utf-8',
            'Version' : 'HTTP/1.1',
        };
        res.writeHead(200, headData);
        res.write('操作结果<br/>');
        res.write(stdout+'<br/>');
        res.end('<a href="/z_admin/backup/">返回</a>');
    });
    callback({});
};
