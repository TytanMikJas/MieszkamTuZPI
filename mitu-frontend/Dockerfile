# mitu_frontend:
FROM node:20.1-alpine as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy our app into the image and build it. Doing this as a separate step creates a separate
# "layer" so if the application changes but the package.json does not, the next image build
# process will start here instead of above.
COPY . .

RUN npm run build

### Production stage ###
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

