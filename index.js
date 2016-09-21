/* jshint node: true */

var path = require('path');

var readFiles = require('read-vinyl-file-stream');
var File = require('vinyl');

module.exports = function reduceAsync(iterator, memo, enc) {

    var base = path.resolve('.');

    return readFiles(function(content, file, stream, cb) {
        iterator(memo, content, file, function (err, newMemo) {
            memo = newMemo;

            cb(err);
        });
    }, function (stream, cb) {
        stream.push(new File({
            contents: new Buffer(memo),
            path: 'reduces',
            base: base
        }));

        cb();
    }, enc === 'buffer' ? 'buffer' : 'utf8');

};
