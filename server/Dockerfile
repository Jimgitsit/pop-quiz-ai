FROM node:16.15.0

WORKDIR /usr/app

# install dependencies
COPY package*.json ./
RUN npm ci -qy

# build
COPY ./src ./src
COPY ./tsconfig.json ./
RUN npm install -g typescript
RUN npm run build

# serve
EXPOSE 3000
CMD npm run serve
