var views = require('co-views');
var render = views(__dirname, {
    map: {
        jade: 'jade'
    }
})

module.exports = render;
