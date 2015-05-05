var session = require('myblog/plug/session.js');

exports.getData = function(callback, req, res) {
    var ses=session.start(req, res);
    console.log(ses.get());
    callback({'username':ses.get('username'),'userid':ses.get('userid')});
};
