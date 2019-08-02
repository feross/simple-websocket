const events = require('events')
const Socket = require('./')
const WebSocketServer = require('ws').Server

class SocketServer extends events.EventEmitter {
  constructor (opts) {
    opts = Object.assign({
      clientTracking: false,
      perMessageDeflate: false
    }, opts)

    super()

    this.destroyed = false

    this._server = new WebSocketServer(opts)

    this._onListeningBound = () => this._onListening()
    this._server.on('listening', this._onListeningBound)

    this._onConnectionBound = conn => this._onConnection(conn)
    this._server.on('connection', this._onConnectionBound)

    this._onErrorBound = err => this._onError(err)
    this._server.once('error', this._onErrorBound)
  }

  address () {
    return this._server.address()
  }

  close (cb) {
    if (this.destroyed) return cb(new Error('server is closed'))
    this.destroyed = true
    if (cb) this.once('close', cb)

    this._server.removeListener('listening', this._onListeningBound)
    this._server.removeListener('connection', this._onConnectionBound)
    this._server.removeListener('error', this._onErrorBound)
    this._server.close(() => this.emit('close'))
  }

  _onListening () {
    this.emit('listening')
  }

  _onConnection (conn) {
    const socket = new Socket({ socket: conn })
    socket._onOpen()
    socket.upgradeReq = conn.upgradeReq
    this.emit('connection', socket)
    this.once('close', () => {
      socket.upgradeReq = null
    })
  }

  _onError (err) {
    this.emit('error', err)
    this.close()
  }
}

module.exports = SocketServer
