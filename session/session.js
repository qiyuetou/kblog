var session = require('msession');

module.exports = sessionDo;

function sessionDo() {

    return function* mongo(next) {
        var self = this;
        // console.log('xxxx');
        this.session = session.start(self.req, self.res);

        yield * next;
    }

}
