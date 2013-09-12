var fs = require('fs');
var SlowBuffer = require('buffer').SlowBuffer;
var sliceOnto = process.binding('smalloc').sliceOnto;

module.exports = function fsplit(path, delim, cb) {
  if (typeof path !== 'string')
    return new TypeError('path expects be a string');
  if (typeof delim !== 'string' && !(delim instanceof Buffer))
    return new TypeError('delimiter expects a string or buffer');

  if (typeof delim === 'string')
    delim = new Buffer(delim, 'binary');

  return getItAll(path, delim);
};

function nextSingle() {
  var data = this._data;
  var delim = this._delim[0];
  var current = this._current;
  var data_length = data.length;
  var start = current;

  while (data[current] !== delim && current <= data_length)
    current++;

  var length = current - start;

  while (data[current] === delim && current <= data_length)
    current++;

  this._current = current;

  if (start + length > data_length)
    length = 0;

  return length <= 0
      ? null
      : sliceOnto(data, new NativeBuffer(length), start, start + length);
}

function nextMulti() {
  throw new Error('not yet implemented');
}

function getItAll(path, delim) {
  try {
    var data = fs.readFileSync(path);
  } catch (e) {
    return e;
  }

  if (typeof delim === 'string')
    delim = new SlowBuffer(Buffer.bytelength(delim)).fill(delim);
  else if (!(delim instanceof Buffer))
    throw new Error('delimiter must be string or Buffer');

  return {
    next: delim.length === 1 ? nextSingle : nextMulti,
    _data: data,
    _current: 0,
    _delim: delim
  };
}


function NativeBuffer(length) {
  this.length = length;
}
NativeBuffer.prototype = Buffer.prototype;
