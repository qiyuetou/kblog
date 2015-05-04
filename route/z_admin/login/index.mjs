/**
 * @author zhuwenlong
 */
var session = require('myblog/plug/session.js');
exports.getData = function(callback, req, res) {
    var sessionM = session.start(req, res);
    callback({});
};
