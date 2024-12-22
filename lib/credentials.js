const path = require("node:path");
const fs = require("node:fs");
const crypto = require("node:crypto");

const encryptionAlgorithm = "aes-256-ctr";

function decryptCredentials(key, cryptJson) {
  let cipher = JSON.parse(cryptJson)["$"];
  const initVector = Buffer.from(cipher.substring(0, 32), "hex");
  cipher = cipher.substring(32);

  const decipher = crypto.createDecipheriv(encryptionAlgorithm, key,
      initVector);
  const decrypted = decipher.update(cipher, "base64", "utf8") + decipher.final(
      "utf8");
  return JSON.parse(decrypted);
}

function encryptCredentials(key, credentials) {
  const initVector = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(encryptionAlgorithm, key, initVector);

  return JSON.stringify({
    "$": initVector.toString("hex") + cipher.update(
        JSON.stringify(credentials), "utf8", "base64") + cipher.final(
        "base64")
  });
}

function getKey(node) {
  const key = node?.credentials?.clientSecret;
  if (!key) {
    throw new Error("The secret key is missing");
  }

  return key;
}

function getCredentialsFile(node, RED) {
  const dir = path.join(RED.settings.userDir, ".node-red-spotify");
  const file = path.join(dir, node.id);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  return file;
}

module.exports = {
  getCredentials: function(node, RED) {
    const file = getCredentialsFile(node, RED);
    if (!fs.existsSync(file)) {
      return {};
    }

    return decryptCredentials(getKey(node), fs.readFileSync(file).toString());
  },

  setCredentials: function(credentials, node, RED) {
    fs.writeFileSync(
        getCredentialsFile(node, RED),
        encryptCredentials(getKey(node), credentials));
  },

  removeCredentials: function(node, RED) {
    fs.rmSync(getCredentialsFile(node, RED));
  }
};