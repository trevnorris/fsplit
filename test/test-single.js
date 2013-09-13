var assert = require('assert');
var fsplit = require('../lib/fsplit');

var file = fsplit('./fixtures/single.txt', '\n');

assert.equal(file.next().toString(), 'aaa');
assert.equal(file.next().toString(), 'bbb');
assert.equal(file.next().toString(), 'ccc');
assert.equal(file.next().toString(), 'ddd');
assert.equal(file.next(), null);
console.log('ok');
