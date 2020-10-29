// run in a browser, with:
//   beefy perf/send.js

// 6.7MB

const Socket = require('../')
const stream = require('readable-stream')

const buf = Buffer.alloc(1000)

const endless = new stream.Readable({
  read: function () {
    this.push(buf)
  }
})

const socket = new Socket('ws://localhost:8080')
socket.on('connect', function () {
  endless.pipe(socket)
})
