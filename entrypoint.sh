#!/bin/bash
set -e

if [ "$1" = "run" ]; then
  npm start
else
  exec "$@"
fi
