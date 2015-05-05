var koa = require('koa');
var staticFile = require('koa-static');
var render = require('../../views/readen.js');

var webgl = koa();


var views = require('co-views');
var render = views(__dirname, {
    map: {
        jade: 'jade'
    }
});

webgl.use(staticFile(__dirname + '/static', {
    'maxage': 1000 * 3600 * 24 * 30
}));

webgl.use(function*(next) {
    this.body = yield render('./index.jade', {});
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

module.exports = compose(webgl.middleware);
