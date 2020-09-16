
# First Stage : to install and build dependences
FROM node:12 AS builder

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY src src
COPY tsconfig*.json ./

RUN npm run test && \
    npm run build && \
    npm prune --production


# Second Stage : Setup command to run your app using lightweight node image
FROM node:12-slim

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node VERSION .
COPY --chown=node:node entrypoint.sh entrypoint.sh

COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/node_modules ./node_modules

USER node

EXPOSE 3000

ENTRYPOINT ["/home/node/app/entrypoint.sh"]
CMD ["run"]
