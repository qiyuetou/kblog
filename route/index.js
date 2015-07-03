var render = require('../views/readen.js');

function* index() {
    var self = this;

    this.body = yield render('index.jade', {
        sys: {
            url: self.request.url
        }
    });
}

module.exports = index;
