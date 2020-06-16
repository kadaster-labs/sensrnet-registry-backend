#!/bin/bash

set -ex

REGISTRY=sensrnetregistry.azurecr.io
USERNAME=sensrnet
# image name
IMAGE=registry-backend

docker build -t $REGISTRY/$USERNAME/$IMAGE:latest .
