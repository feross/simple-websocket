/* global WebSocket */

var common = require('./common')
var Socket = require('../')
var test = require('tape')
var ws = require('ws') // websockets in node - will be empty object in browser

var _WebSocket = typeof ws !== 'function' ? WebSocket : ws

test('echo string (with custom socket)', function (t) {
  t.plan(4)

  var ws = new _WebSocket(common.SERVER_URL)
  var socket = new Socket({
    socket: ws
  })
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send('sup!')
    socket.on('data', function (data) {
      t.ok(Buffer.isBuffer(data), 'data is Buffer')
      t.equal(data.toString(), 'sup!')

      socket.on('close', function () {
        t.pass('destroyed socket')
      })
      socket.destroy()
    })
  })
})

test('echo Buffer (with custom socket)', function (t) {
  t.plan(4)

  var ws = new _WebSocket(common.SERVER_URL)
  var socket = new Socket({
    socket: ws
  })
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send(Buffer.from([1, 2, 3]))
    socket.on('data', function (data) {
      t.ok(Buffer.isBuffer(data), 'data is Buffer')
      t.deepEqual(data, Buffer.from([1, 2, 3]), 'got correct data')

      socket.on('close', function () {
        t.pass('destroyed socket')
      })
      socket.destroy()
    })
  })
})

test('echo Uint8Array (with custom socket)', function (t) {
  t.plan(4)

  var ws = new _WebSocket(common.SERVER_URL)
  var socket = new Socket({
    socket: ws
  })
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send(new Uint8Array([1, 2, 3]))
    socket.on('data', function (data) {
      // binary types always get converted to Buffer
      // See: https://github.com/feross/simple-peer/issues/138#issuecomment-278240571
      t.ok(Buffer.isBuffer(data), 'data is Buffer')
      t.deepEqual(data, Buffer.from([1, 2, 3]), 'got correct data')

      socket.on('close', function () {
        t.pass('destroyed socket')
      })
      socket.destroy()
    })
  })
})

test('echo ArrayBuffer (with custom socket)', function (t) {
  t.plan(4)

  var ws = new _WebSocket(common.SERVER_URL)
  var socket = new Socket({
    socket: ws
  })
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send(new Uint8Array([1, 2, 3]).buffer)
    socket.on('data', function (data) {
      t.ok(Buffer.isBuffer(data), 'data is Buffer')
      t.deepEqual(data, Buffer.from([1, 2, 3]), 'got correct data')

      socket.on('close', function () {
        t.pass('destroyed socket')
      })
      socket.destroy()
    })
  })
})
