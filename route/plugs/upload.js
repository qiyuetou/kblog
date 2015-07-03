var render = require('../../views/readen.js');
var path = require('path');
var parse = require('co-busboy');
var fs = require('fs');

function* upload() {
    // this.body ='404'
    var staticPath = path.join(__dirname, '../../static');
    var basePath = path.join(staticPath, '/upload');
    var filename;

    var parts = parse(this);
    var part;
    while (part = yield parts) {
        if (part.length) {
            if (part[0] === 'path') {
                basePath = path.join(basePath, part[1]);
            }
            console.log(part)
        } else {
            console.log(part)
            var date = new Date();
            var fileprefix = date.getFullYear() + '_' + (date.getMonth() +
                1) + '_' + date.getDate() + '_' + (Math.random() * 36e6 |
                0 + 36e6).toString(36) + '_';
            var savePath = path.join(basePath, fileprefix + part.filename);
            var stream = fs.createWriteStream(savePath);
            part.pipe(stream);
            console.log('uploading1 %s -> %s', part.filename, stream.path);
            // console.oog(filename)
            filename = savePath.replace(staticPath, '');
            console.log(filename, savePath, this)
        }
    }
    this.body = filename;
}

module.exports = upload;
