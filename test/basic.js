var Socket = require('../')
var test = require('tape')

var SOCKET_SERVER = 'wss://echo.websocket.org'

test('echo string', function (t) {
  t.plan(3)

  var socket = new Socket(SOCKET_SERVER)
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send('sup!')
    socket.on('data', function (data) {
      t.equal(data.toString(), 'sup!')

      socket.destroy(function () {
        t.pass('destroyed socket')
      })
    })
  })
})

test('echo Uint8Array', function (t) {
  t.plan(4)

  var socket = new Socket(SOCKET_SERVER)
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send(new Uint8Array([1, 2, 3]))
    socket.on('data', function (data) {
      t.ok(Buffer.isBuffer(data), 'data is Buffer')
      t.deepEqual(data, new Buffer([1, 2, 3]), 'got correct data')

      socket.destroy(function () {
        t.pass('destroyed socket')
      })
    })
  })
})

test('echo Buffer', function (t) {
  t.plan(4)

  var socket = new Socket(SOCKET_SERVER)
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send(new Buffer([1, 2, 3]))
    socket.on('data', function (data) {
      t.ok(Buffer.isBuffer(data), 'data is Buffer')
      t.deepEqual(data, new Buffer([1, 2, 3]), 'got correct data')

      socket.destroy(function () {
        t.pass('destroyed socket')
      })
    })
  })
})

test('echo ArrayBuffer', function (t) {
  t.plan(4)

  var socket = new Socket(SOCKET_SERVER)
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send(new Uint8Array([1, 2, 3]).buffer)
    socket.on('data', function (data) {
      t.ok(Buffer.isBuffer(data), 'data is Buffer')
      t.deepEqual(data, new Buffer([1, 2, 3]), 'got correct data')

      socket.destroy(function () {
        t.pass('destroyed socket')
      })
    })
  })
})

test('Socket.WEBSOCKET_SUPPORT', function (t) {
  t.ok(Socket.WEBSOCKET_SUPPORT)
  t.end()
})
