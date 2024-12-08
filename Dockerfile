FROM nodered/node-red:4.0.5-22-minimal

COPY . /tmp/node-red-spotify
RUN npm install /tmp/node-red-spotify