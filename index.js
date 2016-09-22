/* jshint node: true */

var path = require('path');

var readFiles = require('read-vinyl-file-stream');
var File = require('vinyl');

function validMemo(memo) {
    return typeof memo === 'string' || Buffer.isBuffer(memo);
}

function buffer(content) {
    if (Buffer.isBuffer(content)) {
        return content;
    }

    return new Buffer(content);
}

module.exports = function reduceAsync(iterator, memo, enc) {
    if (typeof iterator !== 'function') {
        throw new TypeError('iterator must be a function');
    }

    if (!validMemo(memo)) {
        throw new TypeError('memo must be a string or buffer');
    }

    var base = path.resolve('.');

    return readFiles(function(content, file, stream, cb) {
        iterator(memo, content, file, function (err, newMemo) {
            if (!validMemo(memo)) {
                cb(new TypeError(newMemo + ' must be a string'));

                return;
            }

            memo = newMemo;

            cb(err);
        });
    }, function (stream, cb) {

        stream.push(new File({
            contents: buffer(memo),
            path: path.resolve(base, 'reduced'),
            base: base
        }));

        cb();
    }, enc === 'buffer' ? 'buffer' : 'utf8');

};
