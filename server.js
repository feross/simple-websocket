module.exports = SocketServer

var events = require('events')
var inherits = require('inherits')
var Socket = require('./')
var WebSocketServer = require('ws').Server

inherits(SocketServer, events.EventEmitter)

function SocketServer (opts) {
  var self = this
  if (!(self instanceof SocketServer)) return new SocketServer(opts)

  opts = Object.assign({
    clientTracking: false,
    perMessageDeflate: false
  }, opts)

  events.EventEmitter.call(self)

  self.destroyed = false

  self._server = new WebSocketServer(opts)

  self._onListeningBound = function () {
    self._onListening()
  }
  self._server.on('listening', self._onListeningBound)

  self._onConnectionBound = function (conn) {
    self._onConnection(conn)
  }
  self._server.on('connection', self._onConnectionBound)

  self._onErrorBound = function (err) {
    self._onError(err)
  }
  self._server.once('error', self._onErrorBound)
}

SocketServer.prototype.address = function () {
  return this._server.address()
}

SocketServer.prototype.close = function (cb) {
  var self = this

  if (self.destroyed) return cb(new Error('server is closed'))
  self.destroyed = true
  if (cb) self.once('close', cb)

  self._server.removeListener('listening', self._onListeningBound)
  self._server.removeListener('connection', self._onConnectionBound)
  self._server.removeListener('error', self._onErrorBound)
  self._server.close(function () {
    self.emit('close')
  })
}

SocketServer.prototype._onListening = function () {
  this.emit('listening')
}

SocketServer.prototype._onConnection = function (conn) {
  var socket = new Socket({ socket: conn })
  socket._onOpen()
  socket.upgradeReq = conn.upgradeReq
  this.emit('connection', socket)
  this.once('close', function () {
    socket.upgradeReq = null
  })
}

SocketServer.prototype._onError = function (err) {
  this.emit('error', err)
  this.close()
}
