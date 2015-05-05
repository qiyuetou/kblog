var mongodb = require('myblog/db/mongodb.js');
var querystring = require('querystring');

exports.getData = function(callback, req, res) {
	res.writeHead(200, {
		"Content-Type" : "text/html;charset=utf-8"
	});
	var data = '';
	req.addListener('data', function(chunk) {
		data += chunk;
	}).addListener('end', function() {
		var dataObj = querystring.parse(data);
		mongodb.open(function(mongo, db) {
			mongo.createCollection('blog', function(err, collection) {
				if (err) {
					console.log('mongodb createCollection error');
				} else {
					if (dataObj.blogid) {
						//update the blog
						var ObjectId = require('mongodb').ObjectID;
						var id = new ObjectId(dataObj.blogid);
						//get old class
						var oldClass = '';
						collection.find({
							'_id' : id
						}).toArray(function(err, result) {
							oldClass = result[0]['classid'];
							updateBlog();
						});

						//fn
						function updateBlog() {
							collection.update({
								'_id' : id
							}, {
								$set : {
									'title' : dataObj.blogtitle,
									'classid' : dataObj.blogclass,
									'content' : dataObj.blogtext
								}
							}, function(err, result) {
								if (err) {
									res.write('博客修改失败');
								} else {
									res.write('博客修改成功');
								}
								if (oldClass == dataObj.blogclass) {
									updatecount(oldClass, function() {
										mongo.close();
										res.end();
									});
								} else {
									updatecount(oldClass, function() {
										updatecount(dataObj.blogclass, function() {
											mongo.close();
											res.end();
										});
									});
								}
							});
						};

					} else {
						//add new blog
						var classid = dataObj.blogclass;
						collection.insert({
							'title' : dataObj.blogtitle,
							'classid' : classid,
							'content' : dataObj.blogtext,
							'visited' : 0,
							'comment' : 0,
							'pubtime' : new Date()
						}, function(err, result) {
							if (err) {
								res.write('\u5199\u5165\u6570\u636E\u5E93\u51FA\u9519');
							} else {
								//update blogclass count
								updatecount(classid, function() {
									mongo.close();
								});
								res.write('\u535A\u5BA2\u53D1\u8868\u6210\u529F');
							}
							res.end();
						});
					}

					//update the count
					function updatecount(classid, fn) {
						mongo.createCollection('blog', function(err, collection) {
							collection.count({
								'classid' : classid.toString()
							}, function(err, count) {
								mongo.createCollection('blogclass', function(err, collection) {
									collection.update({
										'classid' : classid.toString()
									}, {
										$set : {
											'classcount' : count
										}
									}, function(err, result) {
										fn && fn();
									});
								});
							});
						});
					}

				}
			});
		});
	});
};
