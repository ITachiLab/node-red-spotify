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

      if (play) {
        node.api.play({device_id: msg.payload.id}).catch(err => {
          node.warn("Could not resume playback on a device: " + err);
        });
      } else {
        node.api.pause({device_id: msg.payload.id}).catch(err => {
          node.warn("Could not resume playback on a device: " + err);
        });
      }
    });
  }


  RED.nodes.registerType("play/pause", SpotifyPlayPause);
}