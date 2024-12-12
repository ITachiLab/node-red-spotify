const SpotifyWebApi = require('spotify-web-api-node');

module.exports = function (RED) {
  let tokenMap = {};

  function SpotifyApiConfig(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    if (node.credentials.refreshToken) {
      node.spotifyWebApi = new SpotifyWebApi(node.credentials);
      node.refreshTimeout = null;

      refreshToken();

      node.on("close", () => {
        clearTimeout(node.refreshTimeout);
      });
    }

    function refreshToken() {
      node.spotifyWebApi.refreshAccessToken().then(data => {
        console.log("Refresh tokens");

        const {
          access_token: accessToken,
          expires_in: expiresIn,
        } = data.body;

        node.spotifyWebApi.setAccessToken(accessToken);

        clearTimeout(node.refreshTimeout);
        node.refreshTimeout = setTimeout(refreshToken, expiresIn / 2 * 1000);
      });
    }
  }

  RED.httpAdmin.get("/spotify/oauth", (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;

    if (state !== null && code !== null) {
      tokenMap[state] = code;
    }

    res.sendStatus(200);
  });

  RED.httpAdmin.get("/spotify/oauth/continue", (req, res) => {
    const {state, nodeId} = req.query;

    if (state === null || nodeId === null) {
      res.sendStatus(400);
    } if (!(state in tokenMap)) {
      res.sendStatus(202);
    } else {
      const node = RED.nodes.getNode(req.query.nodeId);
      console.log(node);
      const credentials = node.credentials;
      const spotifyApi = new SpotifyWebApi(credentials);
      const code = tokenMap[state];

      spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
          tokens: {...data.body}
        });
      }).catch(err => {
        res.status(500).send(err.message);
      }).finally(() => {
        tokenMap = {};
      });
    }
  })

  RED.nodes.registerType("spotify-api", SpotifyApiConfig, {
    credentials: {
      clientId: {type: "text"},
      redirectUri: {type: "text"},
      clientSecret: {type: "password"},
      refreshToken: {type: "password"}
    }
  });
}