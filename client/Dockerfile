FROM node:16.15.0

WORKDIR /usr/app

# install dependencies
COPY package*.json ./
RUN npm ci -qy

# build
COPY ./public ./public
COPY ./src ./src
COPY ./tsconfig*.json ./
# TODO: Copying .env breaks local docker builds but is needed for fly.io. Local need .env.local
COPY ./.env ./
RUN npm install -g typescript
RUN npm run build

# serve
EXPOSE 3001
RUN npm install -g serve
CMD npm run serve
