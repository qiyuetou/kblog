var render = require('../views/readen.js');

function* blogList() {

    var self = this;

    var Tclass = this.params.Tclass;
    // console.log('@@@@@',Tclass)
    var Tpage = this.params.Tpage;


    var model = {};

    model.sys = {
        url: self.request.url
    }

    model.page = model.page || {};
    model.page.nav = 'blog';

    //page
    var pageList = 10;
    var currentPage = Tpage ? Tpage - 1 : 0;
    model.page.current = currentPage + 1;



    var self = this;

    function getBlogClass() {
        return function(callback) {
            self.mongo(function(db) {
                db.collection('blogclass').find({}).sort({
                    classid: 1
                }).toArray(function(err, res) {
                    callback(null, res);
                });
            });
        }
    };

    function getBlogNumber() {
        return function(callback) {
            self.mongo(function(db) {
                db.collection('blog').count(function(err, res) {
                    callback(null, res);
                });
            })
        }
    }

    function getFromMongo(query) {
        return function(callback) {
            self.mongo(function(db) {
                db.collection('blog').findOne({}, function(err, doc) {
                    callback(null, doc.content);
                });
            });
        }
    }

    function getList(model) {
        return function(callback) {
            self.mongo(function(db) {
                //class
                var blogQuery = {};
                if (Tclass != 0 && typeof(Tclass) == 'string') {
                    console.log('xxxx', Tclass);
                    model.classid = blogQuery.classid = Tclass;
                }

                var tarBlog = db.collection('blog').find(blogQuery);
                tarBlog.count(function(err, res) {
                    var totalPage = Math.ceil(res / pageList);
                    tarBlog.sort({
                        "pubtime": -1
                    }).skip(currentPage * pageList).limit(pageList).toArray(function(err, res) {
                        var blogList = res ? res.length > 0 ? res : '' : '';
                        model.page.total = totalPage;
                        model.blogList = blogList;
                        callback(null, model)
                    });
                });
            })
        }
    }

    model.blogClass = yield getBlogClass();
    model.total = yield getBlogNumber();
    yield getList(model);
    // this.body = yield getFromMongo();
    this.body = yield render('blog.jade', model);

}

module.exports = blogList;
