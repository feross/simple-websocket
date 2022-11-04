const Server = require('../server')

const server = new Server({ port: 0, objectMode: true })

server.on('connection', function (socket) {
  socket.on('data', function (data) {
    socket.write(data)
  })
})

exports.SERVER_URL = 'ws://localhost:' + server._server._server.address().port
exports.server = server
