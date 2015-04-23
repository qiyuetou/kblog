var koa = require('koa');
var logger = require('koa-logger');
var route = require('koa-route');
var staticFile = require('koa-static');
var mongo = require('./mongo/mongo');

var app = koa();



//logger
app.use(logger());

//mongodb
app.use(mongo({
    db: 'zhuwenlong',
    user: 'zhuwenlong',
    pwd: '123123'
}));

//statis
app.use(staticFile('./static'));

//route
function requireRoute(router) {
    return require('./route/' + router + '.js');
}

app.use(route.get('/', requireRoute('index')));
app.use(route.get('/blog/:class/:page', requireRoute('blog')));


//listen the port
app.listen(5123);
