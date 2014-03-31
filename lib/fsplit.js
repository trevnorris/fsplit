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
  var ret, length;

  while (data[current] !== delim && current <= data_length)
    current++;

  length = current - start;

  while (data[current] === delim && current <= data_length)
    current++;

  this._current = current;

  if (start + length > data_length)
    length = 0;

  if (length > 0) {
    ret = new NativeBuffer(length);
    sliceOnto(data, ret, start, start + length);
  } else {
    ret = null;
  }

  return ret;
}

function nextMulti() {
  var data = this._data;
  var delim = this._delim[0];
  var current = this._current;
  var data_length = data.length;
  var delim_length = delim.length;
  var start = current;

  while (data[current] !== delim[0] && current <= data_length) {
    for (var i = 1; i < delim_length; i++) {
      if (delim[i] !== data[current + i])
        continue;
    }
    current += delim_length;
  }

  var length = current - start;

  /*
  while (data[current] === delim && current <= data_length) {
    for (var i = 1; i < delim_length; i++) {
      if (delim[i]
    }
    current++;
  }
  */

  this._current = current;

  if (start + length > data_length)
    length = 0;

  return length <= 0
      ? null
      : sliceOnto(data, new NativeBuffer(length), start, start + length);
}

function getItAll(path, delim) {
  var data = fs.readFileSync(path);

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
