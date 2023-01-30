/* global WebSocket */

import common from './common.js'
import Socket from '../index.js'
import test from 'tape'
import ws from 'ws' // websockets in node - will be empty object in browser

const _WebSocket = typeof ws !== 'function' ? WebSocket : ws

test('check connected on init (with custom socket)', function (t) {
  t.plan(2)

  const ws = new _WebSocket(common.SERVER_URL)
  ws.onopen = function () {
    const socket = new Socket({
      socket: ws
    })
    t.true(socket.connected, 'custom socket already connected')

    socket.on('close', function () {
      t.pass('destroyed socket')
    })
    socket.destroy()
  }
})

test('echo string (with custom socket)', function (t) {
  t.plan(4)

  const ws = new _WebSocket(common.SERVER_URL)
  const socket = new Socket({
    socket: ws
  })
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send('sup!')
    socket.on('data', function (data) {
      t.ok(ArrayBuffer.isView(data), 'data is Uint8')
      t.equal(Buffer.from(data).toString(), 'sup!')

      socket.on('close', function () {
        t.pass('destroyed socket')
      })
      socket.destroy()
    })
  })
})

test('echo Buffer (with custom socket)', function (t) {
  t.plan(4)

  const ws = new _WebSocket(common.SERVER_URL)
  const socket = new Socket({
    socket: ws
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

test('echo Uint8Array (with custom socket)', function (t) {
  t.plan(4)

  const ws = new _WebSocket(common.SERVER_URL)
  const socket = new Socket({
    socket: ws
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

test('echo ArrayBuffer (with custom socket)', function (t) {
  t.plan(4)

  const ws = new _WebSocket(common.SERVER_URL)
  const socket = new Socket({
    socket: ws
  })
  socket.on('connect', function () {
    t.pass('connect emitted')
    socket.send(new Uint8Array([1, 2, 3]).buffer)
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
