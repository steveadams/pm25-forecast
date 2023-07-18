FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./

RUN npm install

COPY public ./public
COPY src ./src
COPY index.html ./index.html

EXPOSE 1337

CMD [ "npm", "run", "dev" ]
