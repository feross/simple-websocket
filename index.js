/* global Blob */

module.exports = Socket

var debug = require('debug')('simple-websocket')
var inherits = require('inherits')
var isTypedArray = require('is-typedarray')
var stream = require('stream')
var toBuffer = require('typedarray-to-buffer')
var ws = require('ws') // websockets in node - will be empty object in browser

var WebSocket = typeof window !== 'undefined' ? window.WebSocket : ws

inherits(Socket, stream.Duplex)

/**
 * WebSocket. Same API as node core `net.Socket`. Duplex stream.
 * @param {string} url websocket server url
 * @param {Object} opts options to stream.Duplex
 */
function Socket (url, opts) {
  var self = this
  if (!(self instanceof Socket)) return new Socket(url, opts)
  if (!opts) opts = {}
  debug('new websocket %s %o', url, opts)

  opts.allowHalfOpen = false
  stream.Duplex.call(self, opts)

  self.url = url
  self.connected = false
  self.destroyed = false

  self._buffer = []

  self._ws = new WebSocket(self.url)
  self._ws.binaryType = 'arraybuffer'
  self._ws.onopen = self._onOpen.bind(self)
  self._ws.onmessage = self._onMessage.bind(self)
  self._ws.onclose = self._onClose.bind(self)
  self._ws.onerror = self._onError.bind(self)

  self.on('finish', function () {
    if (self.connected) {
      // When stream is finished writing, close socket connection. Half open connections
      // are currently not supported.
      self._destroy()
    } else {
      // If socket is not connected when stream is finished writing, wait until data is
      // flushed to network at "connect" event.
      // TODO: is there a more reliable way to accomplish this?
      self.once('connect', function () {
        setTimeout(function () {
          self._destroy()
        }, 100)
      })
    }
  })
}

Socket.prototype.send = function (chunk, cb) {
  var self = this
  if (!cb) cb = noop
  self._write(chunk, undefined, cb)
}

Socket.prototype.destroy = function (onclose) {
  var self = this
  self._destroy(null, onclose)
}

Socket.prototype._destroy = function (err, onclose) {
  var self = this
  if (self.destroyed) return
  if (onclose) self.once('close', onclose)

  debug('destroy (error: %s)', err && err.message)

  self.connected = false
  self.destroyed = true

  if (self._ws) {
    try {
      self._ws.close()
    } catch (err) {}

    self._ws.onopen = null
    self._ws.onmessage = null
    self._ws.onclose = null
    self._ws.onerror = null
  }
  self._ws = null

  this.readable = this.writable = false

  if (!self._readableState.ended) self.push(null)
  if (!self._writableState.finished) self.end()

  if (err) self.emit('error', err)
  self.emit('close')
}

Socket.prototype._read = function () {}

/**
 * Send text/binary data to the WebSocket server.
 * @param {string|Buffer|TypedArrayView|ArrayBuffer|Blob} chunk
 * @param {string} encoding
 * @param {function} cb
 */
Socket.prototype._write = function (chunk, encoding, cb) {
  var self = this
  if (self.destroyed) return cb(new Error('cannot write after socket is destroyed'))

  var len = chunk.length || chunk.byteLength || chunk.size
  if (!self.connected) {
    debug('_write before ready: length %d', len)
    self._buffer.push(chunk)
    cb(null)
    return
  }
  debug('_write: length %d', len)

  if (isTypedArray.strict(chunk) || chunk instanceof ArrayBuffer ||
    Buffer.isBuffer(chunk) || typeof chunk === 'string' ||
    (typeof Blob !== 'undefined' && chunk instanceof Blob)) {
    self._ws.send(chunk)
  } else {
    self._ws.send(JSON.stringify(chunk))
  }

  cb(null)
}

Socket.prototype._onMessage = function (event) {
  var self = this
  if (self.destroyed) return
  var data = event.data
  debug('on message: length %d', data.byteLength || data.length)

  if (data instanceof ArrayBuffer) {
    data = toBuffer(new Uint8Array(data))
    self.push(data)
  } else if (Buffer.isBuffer(data)) {
    self.push(data)
  } else {
    try {
      data = JSON.parse(data)
    } catch (err) {}
    self.emit('data', data)
  }
}

Socket.prototype._onOpen = function () {
  var self = this
  if (self.connected || self.destroyed) return
  self.connected = true

  self._buffer.forEach(function (chunk) {
    self.send(chunk)
  })
  self._buffer = []

  debug('connect')
  self.emit('connect')
}

Socket.prototype._onClose = function () {
  var self = this
  if (self.destroyed) return
  debug('on close')
  self._destroy()
}

Socket.prototype._onError = function (err) {
  var self = this
  if (self.destroyed) return
  debug('error %s', err.message || err)
  self._destroy(err)
}

function noop () {}
