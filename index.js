//pm2 start koa.js --node-args="--harmony";
var koa = require('koa');
var logger = require('koa-logger');
var route = require('koa-route');
var staticFile = require('koa-static');
var mongo = require('./mongo/mongo');
var session = require('./session/session');

var app = koa();

//logger
app.use(logger());

//session
app.use(session());

//mongodb
app.use(mongo({
    db: 'zhuwenlong',
    user: 'zhuwenlong',
    pwd: '123123'
}));


//vhost
app.use(function*(next) {
    var vhost = this.hostname.split('.');
    if (vhost.length >= 3) {
        if (vhost[0] == 'msite') {
            yield require('./vhost/msite/index').call(this, next);
        } else if (vhost[0] == 'mstaticize') {
            yield require('./vhost/mstaticize/index').call(this, next);
        } else if (vhost[0] == 'www' || vhost[0] == '127') {
            yield next;
        }
        return false;
    }
    yield next;
});


//static
app.use(staticFile('./static', {
    'maxage': 1000 * 3600 * 24 * 30
}));

//route
function requireRoute(router) {
    return require('./route/' + router + '.js');
}


//index
app.use(route.get('/', requireRoute('index')));

//blog
app.use(route.get('/blog/:class/:page', requireRoute('blog')));
app.use(route.get('/blog/:class', requireRoute('blog')));
app.use(route.get('/blog', requireRoute('blog')));
app.use(route.post('/blog/articleComment', requireRoute('blog_comment')));

//verification
app.use(route.get('/verification/img', requireRoute('/verification/img')));

//about
app.use(route.get('/about', function*() {
    this.redirect('/#about')
}));

//rss
app.use(route.get('/rss', requireRoute('/rss')));

//api
app.use(route.post('/api/sendemail', requireRoute('/api/sendemail')));

//lab
app.use(route.get('/lab', requireRoute('lab')));

//listen the port
app.listen(5123);
