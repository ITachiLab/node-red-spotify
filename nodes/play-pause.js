const SpotifyNode = require("../lib/spotify-node");

module.exports = function (RED) {
  class SpotifyPlayPause extends SpotifyNode {
    constructor(config) {
      super(RED, config);

      this.on('input', this.onInput);
    }

    onInput(msg, send, done) {
      const play = !!msg.payload;
      const deviceId = msg.topic;

      if (play) {
        this.api.play({device_id: deviceId})
            .then(() => done())
            .catch(err => done(err));
      } else {
        this.api.pause({device_id: deviceId})
            .then(() => done())
            .catch(err => done(err));
      }
    }
  }

  RED.nodes.registerType("play/pause", SpotifyPlayPause);
}