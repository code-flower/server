//////////// IMPORTS ////////////

var appConfig = require('../../shared/appConfig.js');

//////////// PRIVATE ////////////

// CONSTRUCTOR //
function WebSocket(wsConn) {
  this.conn = wsConn;
}

// PRIVATE METHODS //
WebSocket.prototype._send = function(data) {
  console.log("Sending:", data.hasOwnProperty('text') ? data.text : data);
  if (this.conn)
    this.conn.send(JSON.stringify(data));
};

// PUBLIC METHODS //
WebSocket.prototype.text = function(text) {
  var self = this;
  var lines = text.toString('utf-8').split('\n');
  lines.forEach(function(line) {
    self._send({
      type: appConfig.messageTypes.text,
      text: line
    }); 
  });
};

WebSocket.prototype.invalidUrl = function(repo) {
  this.text('Not a valid git clone url.\n');
  this._send({
    type: appConfig.messageTypes.error
  });
  this.close();
};

WebSocket.prototype.needHTTPS = function(repo) {
  this.text('Please use an https url.\n');
  this._send({
    type: appConfig.messageTypes.error
  });
  this.close();
};

WebSocket.prototype.credentials = function(repo, needHTTPS) {
  this._send({
    type: appConfig.messageTypes.credentials,
    needHTTPS: needHTTPS
  });
  this.close();
};

WebSocket.prototype.complete = function(repo) {
  this._send({
    type: appConfig.messageTypes.complete,
    repoName: repo.fullName
  });
  this.close();
};

WebSocket.prototype.unauthorized = function(repo) {
  this._send({
    type: appConfig.messageTypes.unauthorized
  });
  this.close();
};

WebSocket.prototype.isOpen = function() {
  return !!this.conn;
};

WebSocket.prototype.close = function() {
  // the close function doesn't seem to work
  console.log("CLOSING CONNECTION");
  this.conn.close();
  this.conn = null;
};

//////////// EXPORTS ////////////

module.exports = WebSocket;



