module.exports = function (RED) {
  function SpotifyNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', function (msg) {
      msg.payload = msg.payload.toLowerCase();
      node.send(msg);
    });
  }


  RED.nodes.registerType("spotify", SpotifyNode);
}