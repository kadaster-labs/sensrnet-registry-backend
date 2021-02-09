#!/bin/sh
set -e

if [ "$1" = "run" ]; then
  exec node ./dist/main.js
elif [ "$1" = "migrate" ]; then
  exec node ./node_modules/migrate-mongo/bin/migrate-mongo.js up -f /home/node/app/migrate-mongo-config.js
else
  exec "$@"
fi
