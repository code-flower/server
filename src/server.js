//////////////////// IMPORTS //////////////////////

var config = require('../config');
var HTTP = require('./HTTP/');
var WS = require('./WS/');
var system = require('./system/');



////////////// CREATE THE HTTP SERVER /////////////
// this server handles static file requests, sample repos,
// and harvesting the json after repos are cloned

var httpServer = HTTP.createServer(function(request, response) {

  var urlInfo = HTTP.parseUrl(request.url);

  switch(urlInfo.pathname) {
    case config.endpoints.harvest:
      HTTP.serveFlower(response, urlInfo.query.repo);
      break;
    case config.endpoints.email:
      HTTP.sendEmail(response, urlInfo.query.message);
      break;
    default:
      HTTP.serveStaticFile(request, response, urlInfo.pathname);
      break;
  }

});



/////////// CREATE THE WEBSOCKETS SERVER ///////////
// this server handles clone requests and broadcasts
// the server events to the client

var wsServer = new WS.createServer({server: httpServer});

wsServer.on('connection', function(conn) {
  var socket;

  conn.on('message', function (rawData) {
    var data = JSON.parse(rawData);

    switch(data.type) {
      case config.messageTypes.clone:
        socket = new WS.WebSocket(conn);
        system.cloneFlower(data.repo, socket);
        break;
      case config.messageTypes.abort:
        socket.close();
        break;
    }
  });
});



///////////////// START LISTENING ///////////////////

httpServer.listen(config.ports.HTTP, function() {
  console.log(`HTTP server running at port ${config.ports.HTTP} using protocol '${config.protocols.HTTP}'`);
  console.log(`Websockets server running at port ${config.ports.WS} using protocol '${config.protocols.WS}'`);
});

