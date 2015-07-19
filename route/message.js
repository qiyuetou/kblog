var render = require('../views/readen.js');

function* message(Tclass, Tpage) {
    var self = this;

    var currentPage = 0;
    var pageList = 10;
    var model = {
        sys: {
            url: self.request.url
        },
        page: {}
    };

    function getList(model) {
        return function(callback) {
            self.mongo(function(db) {
                var tarBlog = db.collection('message').find({});
                tarBlog.count(function(err, res) {
                    var totalPage = Math.ceil(res / pageList);
                    tarBlog.sort({
                        "_id": -1
                    }).skip(currentPage * pageList).limit(pageList).toArray(function(err, res) {
                        var blogList = res ? res.length > 0 ? res : '' : '';
                        model.page.total = totalPage;
                        model.comment = blogList;
                        callback(null, model)
                    });
                });
            })
        }
    }
    yield getList(model);
    console.log(model)
    this.body = yield render('message.jade', model);
}

module.exports = message;
