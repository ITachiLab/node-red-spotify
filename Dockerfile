FROM nodered/node-red:4.0.5-22-minimal

COPY . /tmp/node-red-spotify
RUN npm install /tmp/node-red-spotify

# Debugging section
#
# 1. Bind port 9229 to localhost
# 2. Uncomment entrypoint:
# ENTRYPOINT ["npm"]
#
# 3a. Uncomment below CMD for breaking immediately after Node-RED start.
# CMD ["run", "debug_brk", "--", "--userDir", "/data"]
#
# 3b. OR uncomment below CMD for casual debugging.
# CMD ["run", "debug", "--", "--userDir", "/data"]
