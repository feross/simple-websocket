var common = require('./common')
var Socket = require('../')
var test = require('tape')

var server
test('create echo server', function (t) {
  if (process.browser) return t.end()
  server = common.createEchoServer(function () {
    t.pass('echo server is listening')
    t.end()
  })
})

test('echo string {objectMode: true}', function (t) {
  t.plan(4)

  var socket = new Socket({
    url: common.SERVER_URL,
    objectMode: true
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

test('echo Buffer {objectMode: true}', function (t) {
  t.plan(4)

  var socket = new Socket({
    url: common.SERVER_URL,
    objectMode: true
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

test('echo Uint8Array {objectMode: true}', function (t) {
  t.plan(4)

  var socket = new Socket({
    url: common.SERVER_URL,
    objectMode: true
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

test('echo ArrayBuffer {objectMode: true}', function (t) {
  t.plan(4)

  var socket = new Socket({
    url: common.SERVER_URL,
    objectMode: true
  })
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send(new Uint8Array([1, 2, 3]).buffer)
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

test('close server', function (t) {
  if (process.browser) return t.end()
  server.close(function () {
    t.pass('server closed')
    t.end()
  })
})
