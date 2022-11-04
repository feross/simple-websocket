// Test the Server class

const Socket = require('../../')
const Server = require('../../server')
const test = require('tape')

test('socket server', function (t) {
  t.plan(5)

  const server = new Server({ port: 0 })
  const port = server._server._server.address().port

  server.on('connection', function (socket) {
    t.equal(typeof socket.read, 'function') // stream function is present
    socket.on('data', function (data) {
      t.ok(Buffer.isBuffer(data), 'type is buffer')
      t.equal(data.toString(), 'ping')
      socket.write('pong')
    })
  })

  const client = new Socket('ws://localhost:' + port)
  client.on('data', function (data) {
    t.ok(Buffer.isBuffer(data), 'type is buffer')
    t.equal(data.toString(), 'pong')

    server.close()
    client.destroy()
  })
  client.write('ping')
})

test('socket server, with objectmode', function (t) {
  t.plan(5)

  const server = new Server({ port: 0, objectMode: true })
  const port = server._server._server.address().port

  server.on('connection', function (socket) {
    t.equal(typeof socket.read, 'function') // stream function is present
    socket.on('data', function (data) {
      t.equal(typeof data, 'string', 'type is string')
      t.equal(data, 'ping')
      socket.write('pong')
    })
  })

  const client = new Socket({ url: 'ws://localhost:' + port, objectMode: true })
  client.on('data', function (data) {
    t.equal(typeof data, 'string', 'type is string')
    t.equal(data, 'pong')

    server.close()
    client.destroy()
  })
  client.write('ping')
})
