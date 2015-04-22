var views = require('co-views');
var render = views(__dirname + '/..', {
    map: {
        jade: 'jade'
    }
});

function* index() {
    this.body = yield render('/views/index.jade', {
        user: 'tobi'
    });
}


module.exports = index;
