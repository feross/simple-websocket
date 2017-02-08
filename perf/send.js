// run in a browser, with:
//   beefy perf/send.js

// 6.7MB

var Socket = require('../')
var stream = require('readable-stream')

var buf = Buffer.alloc(1000)

var endless = new stream.Readable({
  read: function () {
    this.push(buf)
  }
})

var socket = new Socket('ws://localhost:8080')
socket.on('connect', function () {
  endless.pipe(socket)
})
