var blogList = require('./blog_list.js');
var article = require('./blog_article.js');
var blogComment = require('./blog_comment.js');

var render = require('../views/readen.js');

function* blog() {
    var Tclass = this.params.Tclass;
    var Tpage = this.params.Tpage;
    if (Tclass && Tclass.length == '24') {
        yield article.apply(this, arguments);
    } else {
        yield blogList.apply(this, arguments);
    }
    return false;
}

module.exports = blog;
