# mitu_frontend:
    FROM node:20.1-alpine as build-stage
    COPY .env.prod .
    RUN mkdir front
    COPY ./mitu-frontend/package*.json /front
    WORKDIR /front
    RUN npm install
    COPY ./mitu-frontend .
    RUN npm run build
    
    FROM nginx:stable-alpine as production-stage
    COPY --from=build-stage ./front/dist /usr/share/nginx/html
    COPY ./mitu-frontend/nginx.conf /etc/nginx/conf.d/default.conf
    
    ENTRYPOINT ["nginx", "-g", "daemon off;"]