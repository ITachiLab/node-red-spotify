class SpotifyNode {
  constructor(RED, config) {
    RED.nodes.createNode(this, config);
    const apiConfig = RED.nodes.getNode(config.api);

    this.api = apiConfig?.spotifyWebApi;
    if (!this.api) {
      this.status({fill: "red", shape: "ring", text: "not authenticated"});
    }
  }
}

module.exports = SpotifyNode;