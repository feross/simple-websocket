// run in a terminal, look at Node.js console for speed

import prettierBytes from 'prettier-bytes'
import speedometer from 'speedometer'
import { Server } from 'ws'

const speed = speedometer()

const server = new Server({
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
