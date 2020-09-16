#!/bin/sh
set -e

if [ "$1" = "run" ]; then
  exec node ./dist/main.js
else
  exec "$@"
fi
