/* jshint node: true, mocha: true */

var expect = require('chai').expect;
var through = require('through2');
var File = require('vinyl');
var ns = require('node-stream');

var reduce = require('../');

function fileBuffer(opts) {
    opts = opts || {};

    return new File({
        contents: new Buffer(opts.content || 'fake file'),
        path: opts.path || Math.random().toString(36).slice(2) + '.txt',
        base: __dirname
    });
}

function fileStream(opts) {
    opts = opts || {};

    var stream = through.obj();

    setImmediate(function () {
        stream.write(new Buffer(opts.content || 'fake file'));
        stream.end();
    });

    return new File({
        contents: stream,
        path: opts.path || Math.random().toString(36).slice(2) + '.txt',
        base: __dirname
    });
}

function bufferStream() {
    var stream = through.obj();

    setImmediate(function () {
        stream.push(fileBuffer({
            content: '1'
        }));
        stream.push(fileBuffer({
            content: '2'
        }));
        stream.push(fileBuffer({
            content: '3'
        }));

        stream.end();
    });

    return stream;
}

describe('[index]', function () {
    it('calls the iterator for each file', function (done) {
        var count = 0;

        var out = reduce(function (memo, content, file, cb) {
            count += 1;

            expect(content).to.equal(count.toString());

            cb(null, memo);
        }, '');

        bufferStream().pipe(out);

        ns.wait.obj(out, function (err, data) {
            expect(err).to.equal(null);

            expect(data).to.be.an('array').and.to.have.lengthOf(1);

            var file = data[0];

            expect(file).to.have.property('contents').and.to.be.instanceOf(Buffer);

            done();
        });
    });

    it('passed in the new memo every time it calls the iterator with a new file', function (done) {
        var prevMemo = Math.random().toString(36);

        var out = reduce(function (memo, content, file, cb) {
            expect(memo).to.equal(prevMemo);

            prevMemo = Math.random().toString(36);

            cb(null, prevMemo);
        }, prevMemo);

        bufferStream().pipe(out);

        ns.wait.obj(out, function (err, data) {
            expect(err).to.equal(null);

            expect(data).to.be.an('array').and.to.have.lengthOf(1);

            done();
        });
    });

    it.only('writes the final memo value to a vinyl file in the output', function (done) {
        var CONTENT = Math.random().toString(36);

        var out = reduce(function (memo, content, file, cb) {
            cb(null, CONTENT);
        }, '');

        bufferStream().pipe(out);

        ns.wait.obj(out, function (err, data) {
            expect(err).to.equal(null);

            expect(data).to.be.an('array').and.to.have.lengthOf(1);

            var file = data[0];

            expect(Buffer.isBuffer(file.contents)).to.equal(true);
            expect(file.contents.toString()).to.equal(CONTENT);

            done();
        });
    });

    it('accepts buffers for the initial and new memo parameters');

    it('handles errors passed to the callback method');

    it('can optionally provide buffer content to the iterator');

    it('throws if iterator is not a function');

    it('throws if memo is not a string or buffer');

    it('errors the stream if a memo that is not a string or buffer is passed to the iterator callback');
});
