#!/bin/bash

set -ex
# SET THE FOLLOWING VARIABLES
REGISTRY=sensrnetregistry.azurecr.io
USERNAME=sensrnet
# image name
IMAGE=registry-backend

# ensure we're logged on at the registry
az acr login --name sensrnetregistry

# ensure we're up to date
git pull
# bump version
npm version patch --no-git-tag-version

VERSION=$(node -pe "require('./package.json').version")
echo "version: $VERSION"

rm VERSION
echo "$VERSION" >> VERSION

# run build
./build.sh

# tag it
git add -A
git commit -m "release v$VERSION"
git tag -a "$VERSION" -m "release v$VERSION"
git push
git push --tags
docker tag $REGISTRY/$USERNAME/$IMAGE:latest $REGISTRY/$USERNAME/$IMAGE:$VERSION

# push it
docker push $REGISTRY/$USERNAME/$IMAGE:latest
docker push $REGISTRY/$USERNAME/$IMAGE:$VERSION
