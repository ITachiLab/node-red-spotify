const SpotifyWebApi = require('spotify-web-api-node');

module.exports = function (RED) {
  let tokenMap = {};

  function RemoteServerNode(config) {
    RED.nodes.createNode(this, config);
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
    const state = req.query.state || null;
    const secret = req.query.secret || null;
    const clientId = req.query.client_id || null;

    if (secret == null || clientId == null || state == null) {
      res.sendStatus(400);
    } else if (!(state in tokenMap)) {
      res.sendStatus(202);
    } else {
      const code = tokenMap[state];
      const credentials = {
        clientId: clientId,
        clientSecret: secret,
        redirectUri: "http://localhost:1880/spotify/oauth"
      };
      const spotifyApi = new SpotifyWebApi(credentials);

      spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
          access_token: data.body["access_token"],
          refresh_token: data.body["refresh_token"]
        });
      }).catch(err => {
        res.status(500).send(err.message);
      }).finally(() => {
        tokenMap = {};
      });
    }
  })

  RED.nodes.registerType("spotify-api", RemoteServerNode, {
    credentials: {
      client_id: {type: "string"},
      client_secret: {type: "password"},
      access_token: {type: "password"},
      refresh_token: {type: "password"},
    }
  });
}