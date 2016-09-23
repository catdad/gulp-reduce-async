# gulp reduce async

[![Build][1]][2]
[![Test Coverage][3]][4]
[![Code Climate][5]][6]
[![Downloads][7]][8]
[![Version][9]][8]
[![Dependency Status][10]][11]

[1]: https://travis-ci.org/catdad/gulp-reduce-async.svg?branch=master
[2]: https://travis-ci.org/catdad/gulp-reduce-async

[3]: https://codeclimate.com/github/catdad/gulp-reduce-async/badges/coverage.svg
[4]: https://codeclimate.com/github/catdad/gulp-reduce-async/coverage

[5]: https://codeclimate.com/github/catdad/gulp-reduce-async/badges/gpa.svg
[6]: https://codeclimate.com/github/catdad/gulp-reduce-async

[7]: https://img.shields.io/npm/dm/gulp-reduce-async.svg
[8]: https://www.npmjs.com/package/gulp-reduce-async
[9]: https://img.shields.io/npm/v/gulp-reduce-async.svg

[10]: https://david-dm.org/catdad/gulp-reduce-async.svg
[11]: https://david-dm.org/catdad/gulp-reduce-async

Reduce all files in a gulp stream to a single file using the file contents directly.

## Install

```bash
npm install gulp-reduce-async
```

## API

### gulp-reduce-async(iterator {Function}, memo {String|Buffer} [, encoding {String}])

The module is a function that can be used to set up the reduce operation. It takes the following parameters, in order:

- **iterator** _{Function}_ - the iterator method that will be used to process each file.
- **memo** _{String|Buffer}_ - the initial value to use as the memo for the iterator.
- **encoding** _{String}_ Optional - the encoding to use for the content provided to the iterator method. By default, this is a UTF-8 string. The following options are supported:
  - `'utf8'` - provide the content in a UTF-8 string.
  - `'buffer'` - provide the content in a raw buffer. This is useful if you are processing binary files, for example.

### iterator(memo {String|Buffer}, content {String|Buffer}, file {Object}, callback {Function})

This is the declaration of the iterator function. It takes the following parameters, in order:

- **memo** _{String|Buffer}_ - the current value of the reduce operation. This will be the initial `memo` value passed to the reduce method on the first call of the iterator, and the memo value passed to the callback of the previos iteration after that.
- **content** _{String|Buffer}_ - the content of the current file being iterated.
- **file** _{Object}_ - the actual vinyl file object for the current file.
- **callback** _{Function}_ - the method to call when done processing the file. This method takes an error as its first parameter (or `null` if no error occured), and the new memo value as the second parameter.

Note that the resulting file will be named `reduced` with no extension. If you want to use a more meaningful name, you can use a module like [gulp-rename](https://github.com/hparra/gulp-rename) to accomplish that.

## Examples

```javascript
var gulp = require('gulp');
var reduce = require('gulp-reduce-async');
var rename = require('gulp-rename');

gulp.task('files-to-json', function () {
    return gulp.src('myfiles/*')
        .pipe(reduce(memo, content, file, cb) {
            var json = JSON.parse(memo);

            json[file.path] = content;

            cb(null, JSON.stringify(json));
        }, '{}')
        .pipe(rename('allfiles.json'))
        .pipe(dest('dist'));
});
```
