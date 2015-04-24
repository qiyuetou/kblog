var render = require('../views/readen.js');

function* lab(Tclass, Tpage) {
    var self = this;
    this.body = yield render('lab.jade', {
        sys: {
            url: self.request.url
        }
    });
}

module.exports = lab;
