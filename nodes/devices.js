module.exports = function (RED) {
  function SpotifyDevices(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const apiConfig = RED.nodes.getNode(config.api);

    if (apiConfig) {
      this.api = apiConfig.spotifyWebApi;
    }

    node.on('input', function (msg) {
      node.api.getMyDevices().then(data => {
        msg.payload = data.body.devices;
        node.send(msg);
      });
    });
  }

  RED.nodes.registerType("devices", SpotifyDevices);
}