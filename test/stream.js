var str = require('string-to-stream')
var Socket = require('../')
var test = require('tape')

var SOCKET_SERVER = 'wss://echo.websocket.org'

test('duplex stream: send data before "connect" event', function (t) {
  t.plan(6)

  var socket = new Socket(SOCKET_SERVER)
  str('abc').pipe(socket)

  socket.on('data', function (chunk) {
    t.ok(socket.connected)
    t.equal(chunk.toString(), 'abc', 'got correct message')
  })
  socket.on('finish', function () {
    t.pass('got socket "finish"')
    t.ok(socket._writableState.finished)
  })
  socket.on('end', function () {
    t.pass('got socket "end"')
    t.ok(socket._readableState.ended)
  })
})

test('duplex stream: send data one-way', function (t) {
  t.plan(6)

  var socket = new Socket(SOCKET_SERVER)
  socket.on('connect', function () {
    str('abc').pipe(socket)
  })

  socket.on('data', function (chunk) {
    t.ok(socket.connected)
    t.equal(chunk.toString(), 'abc', 'got correct message')
  })
  socket.on('finish', function () {
    t.pass('got socket "finish"')
    t.ok(socket._writableState.finished)
  })
  socket.on('end', function () {
    t.pass('got socket "end"')
    t.ok(socket._readableState.ended)
  })
})
