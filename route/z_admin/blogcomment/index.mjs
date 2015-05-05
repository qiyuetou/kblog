var mongodb = require('myblog/db/mongodb.js');
var querystring = require('querystring');
var url = require('url');

exports.getData = function(callback, req, res) {

    var page = querystring.parse(url.parse(req.url).query).page || 1;
    var perpage=20;

    mongodb.open(function(mongo) {
        var coll = mongo.collection('blogcomment').find();
        coll.count(function(err, count) {
            
            var count=count;
            var maxpage=Math.ceil(count/perpage);
            if(page>maxpage){
                page=maxpage;
            }
            var pageHtml='<div class="pagination"><ul>';
            for(var i=0;i<maxpage;i++){
                pageHtml+='<li class="'+((i+1)==page?'active':'')+'"><a href="?page='+(i+1)+'">'+(i+1)+'</a></li>';
            }
            pageHtml+='</ul></div>';
            
            coll.sort({
                '_id' : -1
            }).limit(perpage).skip((page - 1) * perpage).toArray(function(err, data) {
                var html = [];
                for (var i in data) {
                    //blogcomment : [blogid, name, email, blog, content, privote,time],
                    var htmlT = '<tr>';
                    htmlT += '<td><input type="checkbox" name="' + data[i]['_id'] + '"></td>';
                    htmlT += '<td><a href="/blog/' + data[i]['blogid'] + '" target="_blank" > ' + data[i]['blogid'] + '</a></td>';
                    htmlT += '<td>' + data[i]['name'] + '</td>';
                    htmlT += '<td>' + data[i]['email'] + '</td>';
                    htmlT += '<td>' + data[i]['blog'] + '</td>';
                    htmlT += '<td>' + data[i]['content'] + '</td>';
                    htmlT += '<td>' + data[i]['privote'] + '</td>';
                    htmlT += '<td>' + data[i]['time'] + '</td>';
                    htmlT += '</tr>';
                    html.push(htmlT);
                }
                callback({
                    'comment' : html.join(''),
                    'pages':pageHtml
                });
            });
        });
    });
};
