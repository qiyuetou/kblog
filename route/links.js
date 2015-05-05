var render = require('../views/readen.js');

function* links(Tclass, Tpage) {
    var self = this;
    this.body = yield render('links.jade', {
        sys: {
            url: self.request.url
        }
    });
}

module.exports = links;
