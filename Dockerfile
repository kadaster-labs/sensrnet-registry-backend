
# First Stage: to install and build dependences
FROM node:12.18.4 AS builder

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY tsconfig*.json ./
COPY src src

RUN npm run build && \
    npm prune --production


# Second Stage: use lightweight alpine image and run as non-root
FROM node:12.18.4-alpine3.12

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

COPY --chown=node:node VERSION .
COPY --chown=node:node entrypoint.sh entrypoint.sh

USER node

EXPOSE 3000

ENTRYPOINT ["/home/node/app/entrypoint.sh"]
CMD ["run"]
