FROM node:20-alpine

WORKDIR /redocs

COPY package*.json ./

RUN npm ci

ARG NODE_ENV
ARG PORT
ARG COMMIT_HASH

ENV NODE_ENV=$NODE_ENV \
    PORT=$PORT \
    COMMIT_HASH=$COMMIT_HASH

COPY . .

EXPOSE $PORT

CMD ["npm", "start"]
