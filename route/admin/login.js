var render = require('../../views/readen.js');

function* index() {

    var self = this;

    this.body = yield render('admin/login.jade', {});
}

module.exports = index;
