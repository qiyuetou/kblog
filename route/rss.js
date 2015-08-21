var render = require('../views/readen.js');
var marked = require('marked');

function* rss(Tclass, Tpage) {
    var self = this;

    var model = {};

    function getData() {
        return function(callback) {
            self.mongo(function(db) {
                db.collection('blog').find({}).sort({
                    '_id': -1
                }).limit(20).toArray(function(err, res) {
                    for(var i in res){
                        res[i].content = marked(res[i].content);
                    }
                    callback(null, res);
                });
            });
        }
    }

    model.listS = yield getData();
    this.type = 'application/xml';
    this.body = yield render('rss.jade', model);
}

module.exports = rss;
