//////////// IMPORTS ////////////

var config = require('@config');

//////////// PRIVATE ////////////

function WSResponder(wsConn) {

  let sendData = function(data) {
    if (wsConn)
      wsConn.send(JSON.stringify(data));
  };

  return {
    update: function(text) {
      let lines = text.toString('utf-8').split('\n');
      lines.forEach(line => {
        sendData({
          type: config.messageTypes.update,
          data: { text: line }
        }); 
      });
    },

    success: function(repo) {
      sendData({
        type: config.messageTypes.success,
        data: repo
      });
    },

    error: function(err) {
      sendData({
        type: config.messageTypes.error,
        data: err
      });
    },

    close: function() {
      wsConn.close();
      wsConn = null;
    }
  };
}

//////////// EXPORTS ////////////

module.exports = WSResponder;



