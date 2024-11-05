FROM node:20.1-alpine

ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/lib/chromium/

# install chromium, tini and clear cache
RUN apk add --update-cache chromium tini \
 && rm -rf /var/cache/apk/* /tmp/*

# chrome can't run as a sudo
USER node
WORKDIR /home/node

COPY --chown=node:node . .

RUN npm install

ENTRYPOINT ["tini", "--"]
CMD ["node", "server.js"]
