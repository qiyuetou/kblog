var querystring = require('querystring');
var url = require('url');

function* email() {
    var self = this;
    var url_parts = url.parse(this.req.url, true);
    var query = url_parts.query;

    var limit = query.limit || 10;
    limit = limit > 50 ? 50 : limit;

    var page = query.page || 1;
    var skip = limit * (page - 1);

    function getMessage() {
        return function(callback) {
            self.mongo(function(db) {
                var commentCol = db.collection('message');
                commentCol.find({}).skip(skip).limit(parseInt(limit, 10)).sort({
                    '_id': -1
                }).toArray(function(err, data) {
                    callback(null, data);
                })
            })
        }
    }

    function getTotalPage() {
        return function(callback) {
            self.mongo(function(db) {
                var commentCol = db.collection('message');
                commentCol.count(function(err, count) {
                    callback(null, count);
                })
            })
        }
    }

    var list = yield getMessage();
    var pageCount = yield getTotalPage();
    var page = {
        totalPage: Math.ceil(pageCount / limit),
        thisPage: parseInt(page)
    }


    this.body = {
        code: '200',
        message: list,
        page: page
    };

};

module.exports = email;
