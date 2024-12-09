module.exports = function (RED) {
  function SpotifyPlayPause(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const apiConfig = RED.nodes.getNode(config.api);

    if (apiConfig) {
      this.api = apiConfig.spotifyWebApi;
    }

    node.on('input', function (msg) {
      const play = !!msg.topic;
      const devices = Array.isArray(msg.payload) ? msg.payload : [msg.payload];

      for (const device of devices) {
        if (play) {
          node.api.play({device_id: device.id});
        } else {
          node.api.pause({device_id: device.id});
        }
      }
    });
  }


  RED.nodes.registerType("play/pause", SpotifyPlayPause);
}