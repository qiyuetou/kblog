var app=require('../index.js');
var request = require('supertest').agent(app.listen());

describe('Virtual Host', function(){
    describe('www.zhuwenlong.com',function(){
        it('/',function(done){
            request
                .get('/')
                .set('Host','www.zhuwenlong.com')
                .expect(200,done)
        })

        it('/about',function(done){
            request
                .get('/about')
                .set('Host','www.zhuwenlong.com')
                .expect(301,done)
        })

        it('/links',function(done){
            request
                .get('/links')
                .set('Host','www.zhuwenlong.com')
                .expect(200,done)
        })

        it('/blog',function(done){
            request
                .get('/blog')
                .set('Host','www.zhuwenlong.com')
                .expect(200,done)
        })

        it('/notfound',function(done){
            request
                .get('/notfound')
                .set('Host','www.zhuwenlong.com')
                .expect(404,done)
        })
    })

    describe('webgl.zhuwenlong.com',function(){
        it('/',function(done){
            request
                .get('/')
                .set('Host','webgl.zhuwenlong.com')
                .expect(200,done)
        })
    })

})
