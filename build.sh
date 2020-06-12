#!/bin/bash

set -ex

USERNAME=sensrnet
# image name
IMAGE=registry-backend

docker build -t $USERNAME/$IMAGE:latest .
