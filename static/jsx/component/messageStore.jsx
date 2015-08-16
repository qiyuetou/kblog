var Reflux = require('reflux');

var listAction = require('./messageAction.jsx');

var listStore = Reflux.createStore({
    listenables: listAction,
    onLoadList:function(obj){
        var self = this;
        obj = obj || {};
        var url = '/api/message?page=' + (obj.page ? obj.page : 1);
        $.get(url,function(data){
            self.trigger('loadList', data);
        })
    },
    onAddOne:function(obj){
        var self = this;
        self.trigger('addOne', obj);
    }
});

module.exports = listStore;