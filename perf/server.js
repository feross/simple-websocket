// run in a terminal, look at Node.js console for speed

const prettierBytes = require('prettier-bytes')
const speedometer = require('speedometer')
const ws = require('ws')

const speed = speedometer()

const server = new ws.Server({
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
