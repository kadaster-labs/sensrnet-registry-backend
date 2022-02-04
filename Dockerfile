
# First Stage: to install and build dependences
FROM node:16.5.0 AS builder

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY src src

COPY migrations ./migrations
COPY migrate-mongo-config.js ./migrate-mongo-config.js

RUN npm run build && \
    npm prune --production


# Second Stage: use lightweight alpine image and run as non-root
FROM node:16.13.2-alpine3.15

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

COPY --chown=node:node --from=builder /app/migrations ./migrations
COPY --chown=node:node --from=builder /app/migrate-mongo-config.js ./migrate-mongo-config.js

COPY --chown=node:node VERSION .
COPY --chown=node:node entrypoint.sh entrypoint.sh

USER node

EXPOSE 3000

ENTRYPOINT ["/home/node/app/entrypoint.sh"]
CMD ["run"]
