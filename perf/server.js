// run in a terminal, look at Node.js console for speed

var prettierBytes = require('prettier-bytes')
var speedometer = require('speedometer')
var ws = require('ws')

var speed = speedometer()

var server = new ws.Server({
  perMessageDeflate: false,
  port: 8080
})

server.once('connection', function (socket) {
  socket.on('message', function (message) {
    speed(message.length)
  })
})

setInterval(function () {
  console.log(prettierBytes(speed()))
}, 1000)
