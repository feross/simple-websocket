var common = require('./common')
var Socket = require('../')
var test = require('tape')

var SOCKET_SERVER = 'ws://localhost:6789'

var server
test('create echo server', function (t) {
  server = common.createEchoServer(function () {
    t.pass('echo server is listening')
    t.end()
  })
})

test('duplex stream: send data before "connect" event', function (t) {
  t.plan(6)

  var socket = new Socket(SOCKET_SERVER)
  socket.write('abc')

  socket.on('data', function (chunk) {
    t.ok(socket.connected)
    t.equal(chunk.toString(), 'abc', 'got correct message')
    socket.end()
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
    socket.write('abc')
  })

  socket.on('data', function (chunk) {
    t.ok(socket.connected)
    t.equal(chunk.toString(), 'abc', 'got correct message')
    socket.end()
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

test('close server', function (t) {
  server.close(function () {
    t.pass('server closed')
    t.end()
  })
})
