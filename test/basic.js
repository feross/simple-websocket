var Socket = require('../')
var test = require('tape')

var SOCKET_SERVER = 'wss://echo.websocket.org'

test('echo text', function (t) {
  t.plan(3)

  var socket = new Socket(SOCKET_SERVER)
  socket.on('ready', function () {
    t.pass('ready emitted')
    socket.send('sup!')
    socket.on('message', function (data) {
      t.equal(data, 'sup!')

      socket.destroy(function () {
        t.pass('destroyed socket')
      })
    })
  })
})

test('echo binary data', function (t) {
  t.plan(3)

  var socket = new Socket(SOCKET_SERVER)
  socket.on('ready', function () {
    t.pass('ready emitted')
    socket.send(new Uint8Array([1, 2, 3]))
    socket.on('message', function (data) {
      t.ok(Buffer.isBuffer(data), 'data is Buffer')
      t.deepEqual(data, new Buffer([1, 2, 3]), 'got correct message')

      socket.destroy(function () {
        t.pass('destroyed socket')
      })
    })
  })
})
