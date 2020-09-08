#!/bin/sh
set -e

if [ "$1" = "run" ]; then
  exec npm run start:prod
else
  exec "$@"
fi
