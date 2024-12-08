module.exports = function (RED) {
  function RemoteServerNode(config) {
    RED.nodes.createNode(this, config);
  }

  RED.nodes.registerType("spotify-api", RemoteServerNode, {
    credentials: {
      client_id: {type: "string"},
      client_secret: {type: "password"},
      access_token: {type: "password"},
      refresh_token: {type: "password"},
    }
  });
}