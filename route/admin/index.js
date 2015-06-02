var render = require('../../views/readen.js');

function* index() {
    var self = this;

    this.body = yield render('admin/index.jade', {
        // sys: {
            'username': self.session.get('username'),
            'userid': self.session.get('userid')
        // }
    });
}

module.exports = index;
