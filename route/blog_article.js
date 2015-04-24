var render = require('../views/readen.js');

var ObjectID = require('mongodb').ObjectID;
var marked = require('marked');

function* blogList(Tclass, Tpage) {

    var self = this;

    var id = ObjectID(Tclass);

    var model = {};

    model.sys = {
        url: self.request.url
    };

    // this.body = ;
    function getArticleFromDB() {
        var model = {};
        return function(callback) {
            self.mongo(function(db) {

                db.collection('blog').find({
                    '_id': id
                }).toArray(function(err, res) {
                    // console.log('!!!!!', id, res);
                    if (res.length < 1) {
                        callback(null, model);
                        return false;
                    }

                    var date = res[0].pubtime.getFullYear() + '年';
                    date += (res[0].pubtime.getMonth() + 1) + '月';
                    date += res[0].pubtime.getDate() + '日 ';
                    date += res[0].pubtime.getHours() + ':';
                    date += res[0].pubtime.getMinutes() + ':';
                    date += res[0].pubtime.getSeconds();
                    // console.log(res[0])
                    model = res[0];
                    //page
                    model.page = {
                        title: res[0].title + ' -- HI!I am Z.Mofei! 朱文龙的自留地'
                    };
                    model.id = id
                    model.page.nav = 'blog'
                        //date
                    model.time = date;

                    model.url = "http://www.zhuwenlong.com" + self.req.url;

                    marked.setOptions({
                        highlight: function(code) {
                            return require('highlight.js').highlightAuto(code).value;
                        }
                    });
                    model.content = marked(res[0].content);

                    //update visited
                    db.collection('blog').update({
                        '_id': id
                    }, {
                        $set: {
                            'visited': model.visited + 1
                        }
                    }, function(err, result) {

                    });

                    callback(null, model);
                });

            });
        }
    }

    function getNext() {
        return function(callback) {
            self.mongo(function(db) {
                db.collection('blog').find({
                    '_id': {
                        $lt: id
                    }
                }).sort({
                    '_id': -1
                }).limit(1).toArray(function(err, result) {
                    if (result.length > 0) {
                        model.prev = {
                            id: result[0]._id,
                            title: result[0].title
                        };
                    }
                    callback(null, model);
                });
            })

        }
    }

    function getPre() {
        return function(callback) {
            self.mongo(function(db) {
                db.collection('blog').find({
                    '_id': {
                        $lt: id
                    }
                }).sort({
                    '_id': -1
                }).limit(1).toArray(function(err, result) {
                    if (result.length > 0) {
                        model.prev = {
                            id: result[0]._id,
                            title: result[0].title
                        };
                    }
                    callback(null, model);
                });
            })

        }
    }

    function getNext() {
        return function(callback) {
            self.mongo(function(db) {
                db.collection('blog').findOne({
                    '_id': {
                        $gt: id
                    }
                }, function(err, result) {
                    if (result) {
                        model.next = {
                            id: result._id,
                            title: result.title
                        };
                    }
                    callback(null, model);
                });
            })
        }
    }

    function getComment() {
        return function(callback) {
            self.mongo(function(db) {
                var commentC = db.collection('blogcomment').find({
                    'blogid': id
                });
                commentC.sort({
                    '_id': 1
                }).toArray(function(err, result) {
                    commentC.count(function(err, res) {
                        model.comment = result;
                        model.page = model.page || {};
                        model.page.commentLength = res;
                        callback(null, model);
                    })
                });
            });
        }
    }


    function copy(from, to) {
        for (var i in from) {
            to[i] = from[i];
        }
    }

    var articleModel = yield getArticleFromDB(model);
    copy(articleModel, model)
    yield getNext();
    yield getPre();
    yield getComment();

    this.body = yield render('blog_article.jade', model);

}

module.exports = blogList;
