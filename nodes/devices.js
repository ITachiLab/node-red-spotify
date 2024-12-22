const SpotifyNode = require("../lib/spotify-node");

module.exports = function (RED) {
  class SpotifyDevices extends SpotifyNode {
    constructor (config) {
      super(RED, config);

      if (this.api) {
        this.on("input", this.onInput);
      }
    }

    onInput (msg, send, done) {
      const messages = [];

      this.api.getMyDevices().then(data => {
        for (const dev of data.body.devices) {
          messages.push({
            ...msg,
            topic: dev.id,
            payload: dev
          });
        }

        send([messages]);
        done();
      }).catch(err => {
        done(err);
      });
    }
  }

  RED.nodes.registerType("devices", SpotifyDevices);
};