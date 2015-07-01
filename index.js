//pm2 start koa.js --node-args="--harmony";
var koa = require('koa');
var logger = require('koa-logger');
// var route = require('koa-route');
var router = require('koa-router')();
var staticFile = require('koa-static');
var mongo = require('./mongo/mongo');
var session = require('./session/session');
var vhost = require('./vhost/index');

var app = module.exports = koa();

//logger
//app.use(logger());

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

// app.use(router(app));

//index
router.get('/', requireRoute('index'));

//blog
router.get('/blog', requireRoute('blog'));
router.get('/blog/:Tclass/:Tpage', requireRoute('blog'));
router.get('/blog/:Tclass', requireRoute('blog'));
router.post('/blog/articleComment', requireRoute('blog_comment'));

//verification
router.get('/verification/img', requireRoute('/verification/img'));

//about
router.get('/about', function*() {
    this.status = 301;
    this.redirect('/#about');
});

//rss
router.get('/rss', requireRoute('/rss'))

//api
router.post('/api/sendemail', requireRoute('/api/sendemail'));

// //lab
router.get('/lab', requireRoute('lab'));

//lab
router.get('/links', requireRoute('links'));


//admin
router.use(function*(next) {
    var url = this.request.url;
    if (/^\/admin/.test(url)) {

        if (/^\/admin\/login/.test(url)) {
            yield next
        } else {
            var power = this.session.get('power')
            if (power == 'logined') {
                yield next
            } else {
                this.status = 301;
                this.redirect('/admin/login?check=wrong');
            }
        }
    } else {
        yield next
    }

})
router.get('/admin/', requireRoute('/admin/index'))
router.get('/admin/blog', requireRoute('/admin/blog'))
router.get('/admin/blogpub', requireRoute('/admin/blogpub'))
router.post('/admin/blogsave', requireRoute('/admin/blogsave'))
router.get('/admin/blogdel', requireRoute('/admin/blogdel'))
router.get('/admin/blogclass', requireRoute('/admin/blogclass'))
router.get('/admin/blogclassremove', requireRoute('/admin/blogclassremove'))
router.post('/admin/blogclassadd', requireRoute('/admin/blogclassadd'))
router.get('/admin/blogbackup', requireRoute('/admin/blogbackup'))
router.get('/admin/blogbackupdo', requireRoute('/admin/blogbackupdo'))
router.get('/admin/user', requireRoute('/admin/user'))
router.post('/admin/useredit', requireRoute('/admin/useredit'))
router.get('/admin/login', requireRoute('/admin/login'))
router.post('/admin/logincheck', requireRoute('/admin/logincheck'))

// app.get('/admin/editor', requireRoute('/admin/editor'))

app
    .use(router.routes())
    .use(router.allowedMethods());

//listen the port
if (!module.parent) app.listen(5123);
// app.listen(5123)
