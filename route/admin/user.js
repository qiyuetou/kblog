var render = require('../../views/readen.js');

function* index() {

    var self = this;

    function getList() {
        return function(callback) {
            self.mongo(function(db) {
                db.createCollection('user', function(err, collection) {
                    collection.find({}).toArray(function(err, result) {
                        var returnData = {};
                        returnData.data = result;
                        callback(null, returnData);
                    });
                })
            })
        }
    }

    var returnData = yield getList();
    this.body = yield render('admin/user.jade', returnData);
}

module.exports = index;
