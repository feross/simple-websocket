var Server = require('../server')

// Make an echo server
var port = 6789
var server = new Server({ port: port })
server.on('connection', function (socket) {
  socket.on('data', function (data) {
    socket.send(data)
  })
})
