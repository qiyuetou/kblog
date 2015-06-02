var querystring = require('querystring');
var url = require('url');
var fs = require('fs');
var render = require('../../views/readen.js');

function* index() {
    var self = this;
    var path = '/www/www.zhuwenlong.com/dbback/';

    function getList() {
        return function(callback) {
            fs.readdir(path, function(err, result) {
                var list = [];
                var len = result && result.length;
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        var time = new Date(fs.statSync(path + result[i])['mtime']);
                        list.push({
                            'index': i + 1,
                            'name': result[i],
                            'time': time.getFullYear() + '年' + (time.getMonth() + 1) + '月' + time.getDate() + '日'
                        });
                    };
                }
                callback(null, list);
            });
        }
    }

    var returnData = yield getList();
    this.body = yield render('admin/blogbackup.jade', {
        'list': returnData
    });
}

module.exports = index;

return false
