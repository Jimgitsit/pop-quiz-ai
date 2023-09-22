FROM node:16.15.0

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci -qy
RUN npm install -g serve

COPY . .

EXPOSE 3000

CMD npm run serve
