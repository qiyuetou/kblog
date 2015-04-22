var koa = require('koa');
var logger = require('koa-logger');
var route = require('koa-route');
var views = require('co-views');
var render = views(__dirname + '/views', {
    map: {
        jade: 'jade'
    }
});

var app = koa();

app.use(logger());

function routePath(path) {
    console.log('@@@@@', __dirname + '/route/' + path);
    return require(__dirname + '/route/' + path);
}


var blog = require(__dirname + '/route/index.js');
console.log(blog)
app.use(route.get('/', index));
app.use(route.get('/blog', routePath('index.js')));
// app.use(route.get('/idea', idea));
// app.use(route.get('/about', about));

function* index() {
    this.body = yield render('index.jade', {
        user: 'tobi'
    });
}

app.listen(5123);
