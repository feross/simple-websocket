var Socket = require('../')
var test = require('tape')

test('basic echo test', function (t) {
  t.plan(3)
  var socket = new Socket('wss://echo.websocket.org')
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
