# mitu-prerender:
    FROM node:20.1-alpine

    ENV CHROME_BIN=/usr/bin/chromium-browser
    ENV CHROME_PATH=/usr/lib/chromium/

    COPY ./mitu-prerender/.env . 

    COPY ./mitu-prerender/package*.json ./

    # install chromium, tini and clear cache
    RUN apk add --update-cache chromium tini \
    && rm -rf /var/cache/apk/* /tmp/*


    # chrome can't run as a sudo
    USER node
    WORKDIR /home/node

    COPY --chown=node:node mitu-prerender .

    RUN npm install

    CMD /usr/bin/chromium-browser & node server.js
