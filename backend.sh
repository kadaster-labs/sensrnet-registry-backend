#!/bin/bash

export VERBOSE=

function shout() {
  echo -e "${COLOR}${*}${NC}"
}

# Print the usage message
function printHelp() {
  echo "Usage: "
  echo "  backend.sh <Mode> [Flags]"
  echo "    <Mode>"
  echo "      - 'up' - bring up all backend components (backend, eventstore, mongo)"
  echo "      - 'down' - bring down all backend components and clean up"
  echo "      - 'restart' - restart the all backend components"
  echo
  echo "    Flags:"
  echo "    -verbose - verbose mode"
  echo "  backend.sh -h (print this message)"
  echo
  echo " Possible Mode and flags"
  echo "  backend.sh up"
  echo "  backend.sh down"
  echo
  echo " Taking all defaults:"
  echo "	backend.sh up"
  echo
  echo " Examples:"
  echo "  backend.sh up"
  echo "  backend.sh down"

  exit 0
}

function allUp() {
  shout "Bringing up all backend components ..."
  echo

  docker-compose build
  docker-compose up -d 2>&1

  docker ps -a

  if [ $? -ne 0 ]; then
    echo "ERROR !!!! Unable to start backend"
    exit 1
  fi

  exit 0
}

function allDown() {
  shout "Bringing down all backend components ..."
  echo

  docker-compose down --volumes --remove-orphans
  clearContainers
  removeUnwantedImages

  exit 0
}

# Obtain CONTAINER_IDS and remove them
# This function is called when you bring a network down
function clearContainers() {
  CONTAINER_IDS=$(docker ps -a | awk '($2 ~ /backend.*/) {print $1}')
  if [ -z "$CONTAINER_IDS" -o "$CONTAINER_IDS" == " " ]; then
    echo "---- No containers available for deletion ----"
  else
    docker rm -f $CONTAINER_IDS
  fi
}

# Delete any images that were generated as a part of this setup
# specifically the following images are often left behind:
# This function is called when you bring the network down
function removeUnwantedImages() {
  DOCKER_IMAGE_IDS=$(docker images | awk '($1 ~ /backend.*/) {print $3}')
  if [ -z "$DOCKER_IMAGE_IDS" -o "$DOCKER_IMAGE_IDS" == " " ]; then
    echo "---- No images available for deletion ----"
  else
    docker rmi -f $DOCKER_IMAGE_IDS
  fi
}


# Properties


# colors
COLOR='\033[0;36m'
NC='\033[0m' # No Color


###############################################################################
# Parse commandline args

## Parse mode
if [[ $# -lt 1 ]] ; then
  printHelp
  exit 0
else
  MODE=$1
  shift
fi

# parse flags

while [[ $# -ge 1 ]] ; do
  key="$1"
  case $key in
  -h )
    printHelp
    exit 0
    ;;
  -verbose )
    VERBOSE="-verbose"
    shift
    ;;
  * )
    echo
    echo "Unknown flag: $key"
    echo
    printHelp
    exit 1
    ;;
  esac
  shift
done

# Determine mode of operation and printing out what we asked for
if [ "$MODE" == "up" ]; then
  echo "Starting all backend components"
  echo
elif [ "$MODE" == "down" ]; then
  echo "Stopping all backend components"
  echo
elif [ "$MODE" == "restart" ]; then
  echo "Restarting all backend components"
  echo
else
  printHelp
  exit 1
fi

if [ "${MODE}" == "up" ]; then
  allUp
elif [ "${MODE}" == "down" ]; then
  allDown
elif [ "${MODE}" == "restart" ]; then
  allDown
  allUp
else
  printHelp
  exit 1
fi
