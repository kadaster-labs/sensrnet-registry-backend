#!/bin/bash
set -e

if [ "$1" = "run" ]; then
  exec npm start
else
  exec "$@"
fi
