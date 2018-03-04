// Start an echo server for airtap browser tests

console.log('airtap port is', process.env.AIRTAP_PORT)

var common = require('./common')
var server = common.createEchoServer(function () {
  console.log('listening on port', server.address().port)
})
