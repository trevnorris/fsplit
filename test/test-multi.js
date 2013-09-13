var assert = require('assert');
var fsplit = require('../lib/fsplit');

var file = fsplit('./fixtures/multi.txt', '\n\n');

assert.equal(file.next().toString(), 'aaa');
assert.equal(file.next().toString(), 'bbb');
assert.equal(file.next().toString(), 'ccc\nddd');
assert.equal(file.next(), null);
console.log('ok');
