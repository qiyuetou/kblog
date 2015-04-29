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

//static
app.use(staticFile('./static'));

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

// app.use()

//lab
app.use(route.get('/lab', requireRoute('lab')));

//listen the port
app.listen(5123);
