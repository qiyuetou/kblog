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

    this.body = yield render('message.jade', model);
}

module.exports = message;
