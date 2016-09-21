/* jshint node: true, mocha: true */

var expect = require('chai').expect;

describe('[index]', function () {
    it('calls the iterator for each file');

    it('passed in the new memo every time it calls the iterator with a new file');

    it('writes the final memo value to a vinyl file in the output');

    it('handles errors passed to the callback method');

    it('can optionally provide buffer content to the iterator');
});
