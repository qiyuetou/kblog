var fs = require('fs');
var path = '/www/www.zhuwenlong.com/dbback/';
var returnData = {};

exports.getData = function(callback, req, res) {
    fs.readdir(path, function(err, result) {
        returnData.list = [];
        var len = result&&result.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var time = new Date(fs.statSync(path + result[i])['mtime']);
                returnData.list.push({
                    'index' : i + 1,
                    'name' : result[i],
                    'time' : time.getFullYear() + '年' + (time.getMonth() + 1) + '月' + time.getDate() + '日'
                });
            };
        }
        callback(returnData);
    });
};
