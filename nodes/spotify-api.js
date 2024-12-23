const SpotifyWebApi = require("spotify-web-api-node");
const credentialsStore = require("../lib/credentials.js");
const successPageContent = require("../lib/success-page.js");

module.exports = function (RED) {
  let tokenMap = {};

  function SpotifyApiConfig(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    const credentials = {
      ...node.credentials,
      ...credentialsStore.getCredentials(node, RED)
    };

    if (credentials.refreshToken) {
      node.spotifyWebApi = new SpotifyWebApi(credentials);
      node.refreshTimeout = null;

      refreshTokens();
    }

    node.on("close", (removed, done) => {
      clearTimeout(node.refreshTimeout);

      if (removed) {
        credentialsStore.removeCredentials(node, RED);
      }

      done();
    });

    function refreshTokens() {
      node.spotifyWebApi.refreshAccessToken().then(data => {
        const {
          access_token: accessToken,
          expires_in: expiresIn,
          refresh_token: refreshToken
        } = data.body;

        node.spotifyWebApi.setAccessToken(accessToken);

        if (refreshToken) {
          credentialsStore.setCredentials({refreshToken}, node, RED);
        }

        clearTimeout(node.refreshTimeout);
        node.refreshTimeout = setTimeout(refreshTokens, expiresIn / 2 * 1000);
      });
    }
  }

  RED.httpAdmin.get("/spotify/oauth", (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;

    if (state !== null && code !== null) {
      tokenMap[state] = code;
      res.send(successPageContent);
    }
  });

  RED.httpAdmin.get("/spotify/oauth/continue", (req, res) => {
    const {state, nodeId} = req.query;

    if (state === null || nodeId === null) {
      res.sendStatus(400);
    } else if (!(state in tokenMap)) {
      res.sendStatus(202);
    } else {
      const node = RED.nodes.getNode(req.query.nodeId);
      const spotifyApi = new SpotifyWebApi(node.credentials);
      const code = tokenMap[state];

      spotifyApi.authorizationCodeGrant(code).then(data => {
        credentialsStore.setCredentials({
          "refreshToken": data.body.refresh_token
        }, node, RED);
        res.sendStatus(200);
      }).catch(err => {
        res.status(500).send(err.message);
      }).finally(() => {
        tokenMap = {};
      });
    }
  });

  RED.nodes.registerType("spotify-api", SpotifyApiConfig, {
    credentials: {
      clientId: {type: "text"},
      redirectUri: {type: "text"},
      clientSecret: {type: "password"}
    }
  });
};