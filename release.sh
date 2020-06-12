#!/bin/bash

set -ex
# SET THE FOLLOWING VARIABLES
USERNAME=sensrnet
# image name
IMAGE=registry-backend
# ensure we're up to date
git pull
# bump version
bumped release patch

PACKAGE_VERSION=$(node -pe "require('./package.json').version")

echo $PACKAGE_VERSION

version="$PACKAGE_VERSION"
echo "version: $version"
# run build
./build.sh

# tag it
git add -A
git commit -m "release $version"
git tag -a "$version" -m "release $version"
git push
git push --tags
docker tag $USERNAME/$IMAGE:latest $USERNAME/$IMAGE:$version
# push it
# docker push $USERNAME/$IMAGE:latest
# docker push $USERNAME/$IMAGE:$version
