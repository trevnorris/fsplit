## fsplit

Generator style file splitter.

Works like so:

```javascript
var fsplit = require('fsplit');
var file = fsplit('./path/to/file', '\n');
var chunk;

// Grab all chunks.
while ((chunk = file.next()) !== null) {
  // Work with the chunk.
}
```

Uses a little trick to look like a generator, but doesn't experience the
performance impact that generators have. Also has a little black magic
using core internals to make it supa fast.

Notes: Right now it only supports loading the entire file in immediately
and only supports single character splits. Though if others actually start
to use this I might add support.
