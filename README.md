# node-red-spotify
The Node-RED nodes for interacting with Spotify.

> [!WARNING]
> This is still work in progress. You can use the nodes, and I believe they will work for you, but you are doing it at your own risk (for example, I've just found out it sometimes crashes my Node-RED instance). I'm doing my best to make it pretty as soon as possible.

## "What is it, Precious?"

This package is a collection of Node-RED nodes you can use to control Spotify playback on your devices. It hasn't been decided yet what types of nodes will be implemented.

## Nodes

### devices

This node, when triggered by an arbitrary message, will send a payload with a list of available devices. The list can vary over time, depending on what devices are currently active.

### play/pause

As its name suggessts, the node can be used to play or pause the device.
