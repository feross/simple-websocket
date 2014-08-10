var Socket = require('../')
var test = require('tape')

test('basic echo test', function (t) {
  var proto = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
  var socket = new Socket(proto + 'echo.websocket.org')
  socket.on('ready', function () {
    t.pass('ready emitted')
    socket.send('sup!')
    socket.on('message', function (data) {
      t.equal(data, 'sup!')
      t.end()
    })
  })
})
