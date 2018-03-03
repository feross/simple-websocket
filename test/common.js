var Server = require('../server')

var PORT = Number(process.env.AIRTAP_PORT) || 6789

exports.createEchoServer = function (onlistening) {
  // Make an echo server
  var server = new Server({ port: PORT })
  server.on('connection', function (socket) {
    socket.on('data', function (data) {
      socket.send(data)
    })
  })

  if (onlistening) server.on('listening', onlistening)

  return server
}

exports.SERVER_URL = process.browser
  ? 'ws://' + window.location.host
  : 'ws://localhost:' + PORT
