# mitu-prerender:
    FROM node:20.1-alpine

    ENV CHROME_BIN=/usr/bin/chromium-browser
    ENV CHROME_PATH=/usr/lib/chromium/
    # TODO: IS IT CORRECT?
    COPY ./mitu-prerender/.env . 

    COPY ./mitu-prerender/package*.json .

    # install chromium, tini and clear cache
    RUN apk add --update-cache chromium tini \
    && rm -rf /var/cache/apk/* /tmp/*


    # chrome can't run as a sudo - TODO: WHY?
    USER node
    WORKDIR /home/node

    COPY --chown=node:node mitu-prerender .

    RUN npm install

    ENTRYPOINT ["tini", "--"]
    CMD ["node", "server.js"]
