var blogList = require('./blog_list.js');
var article = require('./blog_article.js');
var blogComment = require('./blog_comment.js');

var render = require('../views/readen.js');

function* blog(Tclass, Tpage) {
    var self = this;
    if (Tclass.length == '24') {
        yield article.apply(this, arguments);
    } else {
        yield blogList.apply(this, arguments);
    }
    return false;
}

module.exports = blog;
