# simple-websocket [![travis](https://img.shields.io/travis/feross/simple-websocket.svg)](https://travis-ci.org/feross/simple-websocket) [![npm](https://img.shields.io/npm/v/simple-websocket.svg)](https://npmjs.org/package/simple-websocket)

#### Simple, EventEmitter API for WebSockets

[![Sauce Test Status](https://saucelabs.com/browser-matrix/simple-websocket.svg)](https://saucelabs.com/u/simple-websocket)

## features

- **super simple** API for working with WebSockets in the browser
- Uses `EventEmitter` interface
- supports **text and binary data**

This module works in the browser with [browserify](http://browserify.org/), and it's used by [WebTorrent](http://webtorrent.io)!

## install

```
npm install simple-websocket
```

## usage

```js
var SimpleWebsocket = require('simple-websocket')

var socket = new SimpleWebsocket('ws://echo.websocket.org')
socket.on('ready', function () {
  // socket is connected!
  socket.send('sup!')
})

socket.on('message', function (data) {
  console.log('got message: ' + data)
})
```

Note: If you're **NOT** using browserify, then use the standalone `simplewebsocket.bundle.js`
file included in this repo. This exports a `SimpleWebsocket` function on the `window`.

## api

### `socket = new SimpleWebsocket([opts])`

Create a new WebSocket connection.

If `opts` is specified, then the default options (shown below) will be overridden.

```
{
  reconnect: 5000
}
```

The options do the following:

- `reconnect` - If websocket encounters an error, reconnect after this timeout (in milliseconds). Set to `false` to disable automatic reconnect on error.

### `socket.send(data)`

Send text/binary data to the remote socket. `data` can be any of several types: `String`, `Buffer` (see [buffer](https://github.com/feross/buffer)), TypedArrayView (Uint8Array, etc.), or ArrayBuffer.

Note: this method should not be called until the `sockt.on('ready')` event has fired.

### `socket.destroy([onclose])`

Destroy and cleanup this websocket connection.

If the optional `onclose` paramter is passed, then it will be registered as a listener on the 'close' event.


## events

### `socket.on('ready', function () {})`

Fired when the websocket connection is ready to use.

### `socket.on('message', function (data) {})`

Received a message from the websocket server.

`data` will be either a `String` or a `Buffer/Uint8Array` (see [buffer](https://github.com/feross/buffer)).

### `socket.on('close', function () {})`

Called when the websocket connection has closed.

### `socket.on('error', function (err) {})`

`err` is an `Error` object.

Fired when a fatal error occurs. If the `reconnect` option is set to something truthy (defaults to `5000`), then this event will never get emitted because the socket will automatically reconnect on error.

### `socket.on('warning', function (err) {})`

`err` is an `Error` object.

Fired when an error occurs but an auto-reconnect will be attempted. Thus, it's only a `warning`, not a full-fledged `error`.

## real-world applications that use simple-websocket

- [StudyNotes](http://www.apstudynotes.org) - Helping students learn faster and better
- [instant.io](https://github.com/feross/instant.io) - Secure, anonymous, streaming file transfer
- [lxjs-chat](https://github.com/feross/lxjs-chat) - Omegle chat clone
- \[ your application here - send a PR \]

## license

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).
