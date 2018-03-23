var common = require('./common')
var Socket = require('../')
var test = require('tape')

test('detect WebSocket support', function (t) {
  t.equal(Socket.WEBSOCKET_SUPPORT, true, 'websocket support')
  t.end()
})

test('create invalid socket', function (t) {
  t.plan(2)

  var socket
  t.doesNotThrow(function () {
    socket = new Socket('invalid://invalid-url')
  })
  socket.on('error', function (err) {
    t.ok(err instanceof Error, 'got error')
    socket.destroy()
  })
})

test('echo string', function (t) {
  t.plan(4)

  var socket = new Socket(common.SERVER_URL)
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

test('echo string (opts.url version)', function (t) {
  t.plan(4)

  var socket = new Socket({
    url: common.SERVER_URL
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

test('echo Buffer', function (t) {
  t.plan(4)

  var socket = new Socket(common.SERVER_URL)
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

test('echo Uint8Array', function (t) {
  t.plan(4)

  var socket = new Socket(common.SERVER_URL)
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

test('echo ArrayBuffer', function (t) {
  t.plan(4)

  var socket = new Socket(common.SERVER_URL)
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
