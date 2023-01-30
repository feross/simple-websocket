import common from './common.js'
import Socket from '../index.js'
import test from 'tape'

test('echo string {objectMode: true}', function (t) {
  t.plan(4)

  const socket = new Socket({
    url: common.SERVER_URL,
    objectMode: true
  })
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send('sup!')
    socket.on('data', function (data) {
      t.equal(typeof data, 'string', 'data is a string')
      t.equal(data, 'sup!')

      socket.on('close', function () {
        t.pass('destroyed socket')
      })
      socket.destroy()
    })
  })
})

test('echo Buffer {objectMode: true}', function (t) {
  t.plan(4)

  const socket = new Socket({
    url: common.SERVER_URL,
    objectMode: true
  })
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send(Buffer.from([1, 2, 3]))
    socket.on('data', function (data) {
      t.ok(ArrayBuffer.isView(data), 'data is Uint8')
      t.deepEqual(data, new Uint8Array(Buffer.from([1, 2, 3])), 'got correct data')

      socket.on('close', function () {
        t.pass('destroyed socket')
      })
      socket.destroy()
    })
  })
})

test('echo Uint8Array {objectMode: true}', function (t) {
  t.plan(4)

  const socket = new Socket({
    url: common.SERVER_URL,
    objectMode: true
  })
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send(new Uint8Array([1, 2, 3]))
    socket.on('data', function (data) {
      // binary types always get converted to Buffer
      // See: https://github.com/feross/simple-peer/issues/138#issuecomment-278240571
      t.ok(ArrayBuffer.isView(data), 'data is Uint8')
      t.deepEqual(data, new Uint8Array(Buffer.from([1, 2, 3])), 'got correct data')

      socket.on('close', function () {
        t.pass('destroyed socket')
      })
      socket.destroy()
    })
  })
})

test('echo ArrayBuffer {objectMode: true}', function (t) {
  t.plan(4)

  const socket = new Socket({
    url: common.SERVER_URL,
    objectMode: true
  })
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send(new Uint8Array([1, 2, 3]).buffer)
    socket.on('data', function (data) {
      // binary types always get converted to Buffer
      // See: https://github.com/feross/simple-peer/issues/138#issuecomment-278240571
      t.ok(ArrayBuffer.isView(data), 'data is Uint8')
      t.deepEqual(data, new Uint8Array(Buffer.from([1, 2, 3])), 'got correct data')

      socket.on('close', function () {
        t.pass('destroyed socket')
      })
      socket.destroy()
    })
  })
})
