var os = require('os');
var ifaces = os.networkInterfaces();

var vhosts = {
    'www.zhuwenlong.com': {},
    'zhuwenlong.com': {},
    //for test
    'zwl.com': {},
    'www.zwl.com': {},
    'static.zwl.com': {},
}

Object.keys(ifaces).forEach(function (ifname) {
    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' == iface.family) {
            vhosts[iface.address] = {};
        }
    });
});


var vhostNames = ['msite', 'mstaticize', 'webgl'];

for (var i = 0; i < vhostNames.length; i++) {
    var path = vhostNames[i];
    vhosts[path + '.zhuwenlong.com'] = {
        'path': path
    };
    //dev
    vhosts[path + '.zwl.com'] = {
        'path': path
    };
}


function* vhost(next) {
    var hostname = this.hostname;
    if (vhosts[hostname]) {
        var path = vhosts[hostname].path;
        if (path) {
            yield require('./' + path + '/index').call(this, next);
        } else {
            yield next;
        }
    }
    return false;
}

module.exports = vhost;
