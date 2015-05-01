var koa = require('koa');
var staticFile = require('koa-static');
var render = require('../../views/readen.js');

var msite = koa();


var views = require('co-views');
var render = views(__dirname, {
    map: {
        jade: 'jade'
    }
});

msite.use(staticFile(__dirname + '/static', {
    'maxage': 1000 * 3600 * 24 * 30
}));

msite.use(function*(next) {
    // yield next;
    // if ('/' != this.url) return;
    this.body = yield render('./index.jade', {});
    // this.body = '2Hello from www app';
});

function compose(middleware) {
    return function*(next) {
        if (!next) next = (function* noop() {})();
        var i = middleware.length;
        while (i--) {
            next = middleware[i].call(this, next);
        }
        yield * next;
    }
}

module.exports = compose(msite.middleware);
