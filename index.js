//pm2 start koa.js --node-args="--harmony";
var koa = require('koa');
var logger = require('koa-logger');
var route = require('koa-route');
var router = require('koa-router');
var staticFile = require('koa-static');
var mongo = require('./mongo/mongo');
var session = require('./session/session');
var vhost = require('./vhost/index');

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

app.use(vhost);


//static
app.use(staticFile('./static', {
    'maxage': 1000 * 3600 * 24 * 30
}));

//route
function requireRoute(router) {
    return require('./route/' + router + '.js');
}

app.use(router(app));

//index
// app.use(route.get('/', requireRoute('index')));
app.get('/', requireRoute('index'));

//blog
app.get('/blog', requireRoute('blog'));
app.get('/blog/:Tclass/:Tpage', requireRoute('blog'));
app.get('/blog/:Tclass', requireRoute('blog'));
app.post('/blog/articleComment', requireRoute('blog_comment'));
// app.use(route.get('/blog', requireRoute('blog')));
// app.use(route.get('/blog/:class/:page', requireRoute('blog')));
// app.use(route.get('/blog/:class', requireRoute('blog')));
// app.use(route.post('/blog/articleComment', requireRoute('blog_comment')));

//verification
app.use(route.get('/verification/img', requireRoute('/verification/img')));

//about
app.use(route.get('/about', function*() {
    this.status = 301;
    this.redirect('/#about');
}));

//rss
app.use(route.get('/rss', requireRoute('/rss')));

//api
app.use(route.post('/api/sendemail', requireRoute('/api/sendemail')));

//lab
app.use(route.get('/lab', requireRoute('lab')));

//lab
app.use(route.get('/links', requireRoute('links')));

//listen the port
app.listen(5123);
